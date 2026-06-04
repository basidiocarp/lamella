const fs = require('fs');
const path = require('path');
const { loadMarkdownFrontmatter, validateRequiresValue } = require('./requires');
const { CONTENT_ROOT, BASE_DIR } = require('./content-root');

const SKILLS_DIR = path.join(CONTENT_ROOT, 'skills');
const CLAUDE_MANIFESTS_DIR = path.join(BASE_DIR, 'manifests', 'claude');
const CODEX_MANIFESTS_DIR = path.join(BASE_DIR, 'manifests', 'codex');
const VALID_SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_NAME_SEGMENTS = new Set(['anthropic', 'claude']);
const PORTABLE_CODEX_RESOURCE_TYPES = ['skills', 'workflows', 'templates', 'scripts'];

function listSkillDirs() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  const out = [];
  for (const category of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!category.isDirectory() || category.name.startsWith('.')) continue;
    const categoryPath = path.join(SKILLS_DIR, category.name);
    for (const skill of fs.readdirSync(categoryPath, { withFileTypes: true })) {
      if (!skill.isDirectory() || skill.name.startsWith('.')) continue;
      out.push({
        category: category.name,
        name: skill.name,
        relPath: `${category.name}/${skill.name}`,
        dir: path.join(categoryPath, skill.name),
        skillMd: path.join(categoryPath, skill.name, 'SKILL.md'),
      });
    }
  }

  return out.sort((a, b) => a.relPath.localeCompare(b.relPath));
}

function normalizeAllowedTools(value) {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\s]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return null;
}

function sortedStrings(items) {
  return [...new Set((items || []).filter((item) => typeof item === 'string'))].sort();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function buildExpectedCodexManifest(claudeManifest) {
  return {
    name: claudeManifest.name,
    description: claudeManifest.description || '',
    source_plugin: claudeManifest.name,
    dependencies: claudeManifest.dependencies || [],
    resources: {
      skills: claudeManifest.resources?.skills || [],
      workflows: claudeManifest.resources?.workflows || [],
      templates: claudeManifest.resources?.templates || [],
      scripts: [],
    },
    options: {
      include_workflow_wrappers: true,
      include_template_wrappers: true,
    },
  };
}

function detectHardcodedHomePaths(skillDir, reportWarning) {
  // Placeholder names (case-insensitive) that should not be flagged
  const placeholderNames = new Set([
    'user',
    'username',
    'name',
    'you',
    'your-name',
    'yourname',
    'me',
    'myname',
    'someone',
    'example',
    'johndoe',
    'jdoe',
    'foo',
    'bar',
  ]);

  // Script extensions to scan in full
  const scriptExtensions = new Set(['sh', 'bash', 'zsh', 'fish', 'py', 'rb', 'pl', 'lua', 'js', 'ts', 'mjs']);

  // Markdown filenames to skip
  const skipMdFilenames = new Set(['readme.md', 'changelog.md', 'claude.md', 'agents.md', 'license.md']);

  // Regex patterns for hardcoded user paths
  const posixRegex = /(?:\/Users\/|\/home\/)([A-Za-z0-9._-]+)/g;
  const windowsRegex = /[Cc]:[\\/]Users[\\/]([A-Za-z0-9._-]+)/g;

  function isPlaceholder(name) {
    return placeholderNames.has(name.toLowerCase());
  }

  function isScript(filePath, content) {
    // Check for shebang
    if (content.startsWith('#!')) {
      return true;
    }
    // Check file extension
    const ext = path.extname(filePath).slice(1).toLowerCase();
    return scriptExtensions.has(ext);
  }

  function extractFrontmatterBody(content) {
    // Skip YAML frontmatter in markdown files. Match the closing fence with
    // either LF or CRLF line endings so CRLF-authored files are handled the
    // same as LF ones (otherwise the whole file, frontmatter included, gets
    // scanned). Returns the body after the closing fence, or the full content
    // when there is no frontmatter.
    if (content.startsWith('---')) {
      const fence = content.match(/\r?\n---\r?\n/);
      if (fence) {
        return content.slice(fence.index + fence[0].length);
      }
    }
    return content;
  }

  function scanContent(filePath, content, isMarkdown) {
    const hits = [];

    // For markdown, skip frontmatter so template metadata is not flagged.
    const contentToScan = isMarkdown ? extractFrontmatterBody(content) : content;

    // matchAll returns a fresh iterator per call, so the global-flagged regex
    // objects carry no lastIndex state between files.
    for (const regex of [posixRegex, windowsRegex]) {
      for (const match of contentToScan.matchAll(regex)) {
        const username = match[1];
        if (!isPlaceholder(username)) {
          hits.push({ file: filePath, text: match[0] });
        }
      }
    }

    return hits;
  }

  // Walk the skill directory tree
  function walkDir(dir) {
    const allHits = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Skip hidden directories and symlinks
        if (entry.name.startsWith('.')) {
          continue;
        }

        const fullPath = path.join(dir, entry.name);

        if (entry.isSymbolicLink()) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          allHits.push(...walkDir(fullPath));
        } else if (entry.isFile()) {
          const relativePath = path.relative(skillDir, fullPath);
          const filename = entry.name.toLowerCase();
          const isMarkdown = filename.endsWith('.md');

          // Skip certain markdown files
          if (isMarkdown && skipMdFilenames.has(filename)) {
            continue;
          }

          try {
            const content = fs.readFileSync(fullPath, 'utf-8');

            // Decide whether to scan this file
            let shouldScan = false;
            if (isMarkdown) {
              shouldScan = true;
            } else if (isScript(fullPath, content)) {
              shouldScan = true;
            }

            if (shouldScan) {
              const hits = scanContent(relativePath, content, isMarkdown);
              allHits.push(...hits);
            }
          } catch (err) {
            // Skip files we can't read (binary, permission denied, etc.)
          }
        }
      }
    } catch (err) {
      // Silently skip inaccessible directories
    }

    return allHits;
  }

  const hits = walkDir(skillDir);

  // Report each hit via reportWarning
  for (const hit of hits) {
    reportWarning(`${hit.file} - hardcoded user-home path found: ${hit.text}`);
  }
}

function validateSkillFrontmatter(skill, reportError, reportWarning = () => {}) {
  if (!fs.existsSync(skill.skillMd)) {
    reportError(`${skill.relPath} - missing SKILL.md`);
    return null;
  }

  const content = fs.readFileSync(skill.skillMd, 'utf-8');
  if (content.trim().length === 0) {
    reportError(`${skill.relPath}/SKILL.md - empty file`);
    return null;
  }

  const frontmatter = loadMarkdownFrontmatter(skill.skillMd);
  if (!frontmatter) {
    reportError(`${skill.relPath}/SKILL.md - missing frontmatter`);
    return null;
  }

  if (!frontmatter.name || typeof frontmatter.name !== 'string') {
    reportError(`${skill.relPath}/SKILL.md - missing required 'name'`);
  } else {
    if (frontmatter.name.length > 64) {
      reportError(`${skill.relPath}/SKILL.md - name must be 64 characters or fewer`);
    }
    if (!VALID_SKILL_NAME.test(frontmatter.name)) {
      reportError(`${skill.relPath}/SKILL.md - name '${frontmatter.name}' must be kebab-case`);
    }
    if (frontmatter.name !== skill.name) {
      reportError(`${skill.relPath}/SKILL.md - name '${frontmatter.name}' must match directory '${skill.name}'`);
    }
    const tokens = frontmatter.name.split('-');
    for (const token of tokens) {
      if (RESERVED_NAME_SEGMENTS.has(token)) {
        reportError(`${skill.relPath}/SKILL.md - name '${frontmatter.name}' must not include reserved token '${token}'`);
      }
    }
  }

  if (!frontmatter.description || typeof frontmatter.description !== 'string' || !frontmatter.description.trim()) {
    reportError(`${skill.relPath}/SKILL.md - missing required 'description'`);
  } else if (frontmatter.description.length > 1024) {
    reportError(`${skill.relPath}/SKILL.md - description must be 1024 characters or fewer`);
  }

  if (frontmatter.compatibility !== undefined) {
    if (typeof frontmatter.compatibility !== 'string') {
      reportError(`${skill.relPath}/SKILL.md - compatibility must be a string when present`);
    } else if (frontmatter.compatibility.length > 500) {
      reportError(`${skill.relPath}/SKILL.md - compatibility must be 500 characters or fewer`);
    }
  }

  if (frontmatter.license !== undefined && typeof frontmatter.license !== 'string') {
    reportError(`${skill.relPath}/SKILL.md - license must be a string when present`);
  }

  const allowedTools = normalizeAllowedTools(frontmatter['allowed-tools']);
  if (allowedTools === null) {
    reportError(`${skill.relPath}/SKILL.md - allowed-tools must be a string or list`);
  } else if (allowedTools.some((item) => typeof item !== 'string' || item.trim() === '')) {
    reportError(`${skill.relPath}/SKILL.md - allowed-tools entries must be non-empty strings`);
  }

  validateRequiresValue(`${skill.relPath}/SKILL.md`, frontmatter.requires, reportError);

  if (!content.includes('## Workflow')) {
    reportWarning(`${skill.relPath}/SKILL.md - missing recommended '## Workflow' section`);
  }

  // Detect hardcoded home paths in the skill directory
  detectHardcodedHomePaths(path.dirname(skill.skillMd), reportWarning);

  return {
    frontmatter,
    allowedTools: allowedTools === null ? [] : allowedTools,
  };
}

function validateManifestAlignment(skillIndex, reportError, reportWarning = () => {}, options = {}) {
  const claudeManifestsDir = options.claudeManifestsDir || CLAUDE_MANIFESTS_DIR;
  const codexManifestsDir = options.codexManifestsDir || CODEX_MANIFESTS_DIR;
  const writeEnabled = options.writeEnabled === true;

  if (!fs.existsSync(claudeManifestsDir)) {
    return { aligned: 0, detected: 0, written: 0, errored: 0 };
  }

  const manifestFiles = fs.readdirSync(claudeManifestsDir)
    .filter((file) => file.endsWith('.json') && file !== 'schema.json' && file !== 'index.json')
    .sort();

  let alignedManifests = 0;
  let detected = 0;
  let written = 0;
  let errored = 0;

  for (const file of manifestFiles) {
    const claudePath = path.join(claudeManifestsDir, file);
    const claudeManifest = readJson(claudePath);
    const manifestName = claudeManifest.name || file.replace(/\.json$/, '');

    // Skill-ref checks are source errors — always reportError, even in write mode.
    let hadSkillRefError = false;
    for (const skillRef of claudeManifest.resources?.skills || []) {
      const skillMeta = skillIndex.get(skillRef);
      if (!skillMeta) {
        reportError(`manifests/claude/${file} - references unknown skill '${skillRef}'`);
        hadSkillRefError = true;
        continue;
      }
      if (skillMeta.frontmatter?.name && skillMeta.frontmatter.name !== skillMeta.name) {
        reportError(`manifests/claude/${file} - skill '${skillRef}' frontmatter name does not match directory`);
        hadSkillRefError = true;
      }
    }
    if (hadSkillRefError) {
      errored += 1;
    }

    const codexPath = path.join(codexManifestsDir, `${manifestName}.yaml`);
    if (!fs.existsSync(codexPath)) {
      detected += 1;
      if (writeEnabled) {
        fs.writeFileSync(codexPath, JSON.stringify(buildExpectedCodexManifest(claudeManifest), null, 2) + '\n');
        written += 1;
      } else {
        reportError(`manifests/claude/${file} - missing paired Codex manifest ${manifestName}.yaml`);
        if (!hadSkillRefError) {
          errored += 1;
        }
      }
      continue;
    }

    const codexManifest = readJson(codexPath);
    const expectedManifest = buildExpectedCodexManifest(claudeManifest);

    // Determine whether this manifest has any drift before deciding how to handle it.
    const driftErrors = [];

    if (codexManifest.name !== expectedManifest.name) {
      driftErrors.push(`manifests/codex/${manifestName}.yaml - name drift from manifests/claude/${file}`);
    }

    if (codexManifest.description !== expectedManifest.description) {
      driftErrors.push(`manifests/codex/${manifestName}.yaml - description drift from manifests/claude/${file}`);
    }

    if (codexManifest.source_plugin !== expectedManifest.source_plugin) {
      driftErrors.push(`manifests/codex/${manifestName}.yaml - source_plugin drift from manifests/claude/${file}`);
    }

    if (JSON.stringify(sortedStrings(codexManifest.dependencies || [])) !== JSON.stringify(sortedStrings(expectedManifest.dependencies))) {
      driftErrors.push(`manifests/codex/${manifestName}.yaml - dependencies drift from manifests/claude/${file}`);
    }

    const actualResourceKeys = sortedStrings(Object.keys(codexManifest.resources || {}));
    const expectedResourceKeys = sortedStrings(PORTABLE_CODEX_RESOURCE_TYPES);
    if (JSON.stringify(actualResourceKeys) !== JSON.stringify(expectedResourceKeys)) {
      driftErrors.push(`manifests/codex/${manifestName}.yaml - resources keys must match Lamella's portable Codex surface`);
    }

    for (const resourceType of PORTABLE_CODEX_RESOURCE_TYPES) {
      const expected = sortedStrings(expectedManifest.resources[resourceType] || []);
      const actual = sortedStrings(codexManifest.resources?.[resourceType] || []);
      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        driftErrors.push(`manifests/codex/${manifestName}.yaml - ${resourceType} drift from manifests/claude/${file}`);
      }
    }

    const expectedOptions = expectedManifest.options;
    const actualOptions = codexManifest.options || {};
    for (const [key, value] of Object.entries(expectedOptions)) {
      if (actualOptions[key] !== value) {
        driftErrors.push(`manifests/codex/${manifestName}.yaml - option '${key}' drift from manifests/claude/${file}`);
      }
    }

    if (driftErrors.length > 0) {
      detected += 1;
      if (writeEnabled) {
        // Repair mode: rewrite the codex manifest to match the expected shape.
        fs.writeFileSync(codexPath, JSON.stringify(buildExpectedCodexManifest(claudeManifest), null, 2) + '\n');
        written += 1;
      } else {
        // Detect mode: emit all per-field errors exactly as before.
        for (const msg of driftErrors) {
          reportError(msg);
        }
        if (!hadSkillRefError) {
          errored += 1;
        }
      }
    }

    alignedManifests += 1;
  }

  return { aligned: alignedManifests, detected, written, errored };
}

module.exports = {
  SKILLS_DIR,
  CLAUDE_MANIFESTS_DIR,
  CODEX_MANIFESTS_DIR,
  VALID_SKILL_NAME,
  listSkillDirs,
  normalizeAllowedTools,
  sortedStrings,
  readJson,
  buildExpectedCodexManifest,
  detectHardcodedHomePaths,
  validateSkillFrontmatter,
  validateManifestAlignment,
  PORTABLE_CODEX_RESOURCE_TYPES,
};
