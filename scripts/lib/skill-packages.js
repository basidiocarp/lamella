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

  return {
    frontmatter,
    allowedTools: allowedTools === null ? [] : allowedTools,
  };
}

function validateManifestAlignment(skillIndex, reportError, reportWarning = () => {}, options = {}) {
  const claudeManifestsDir = options.claudeManifestsDir || CLAUDE_MANIFESTS_DIR;
  const codexManifestsDir = options.codexManifestsDir || CODEX_MANIFESTS_DIR;

  if (!fs.existsSync(claudeManifestsDir)) {
    return 0;
  }

  const manifestFiles = fs.readdirSync(claudeManifestsDir)
    .filter((file) => file.endsWith('.json') && file !== 'schema.json' && file !== 'index.json')
    .sort();

  let alignedManifests = 0;

  for (const file of manifestFiles) {
    const claudePath = path.join(claudeManifestsDir, file);
    const claudeManifest = readJson(claudePath);
    const manifestName = claudeManifest.name || file.replace(/\.json$/, '');

    for (const skillRef of claudeManifest.resources?.skills || []) {
      const skillMeta = skillIndex.get(skillRef);
      if (!skillMeta) {
        reportError(`manifests/claude/${file} - references unknown skill '${skillRef}'`);
        continue;
      }
      if (skillMeta.frontmatter?.name && skillMeta.frontmatter.name !== skillMeta.name) {
        reportError(`manifests/claude/${file} - skill '${skillRef}' frontmatter name does not match directory`);
      }
    }

    const codexPath = path.join(codexManifestsDir, `${manifestName}.yaml`);
    if (!fs.existsSync(codexPath)) {
      reportError(`manifests/claude/${file} - missing paired Codex manifest ${manifestName}.yaml`);
      continue;
    }

    const codexManifest = readJson(codexPath);
    const expectedManifest = buildExpectedCodexManifest(claudeManifest);

    if (codexManifest.name !== expectedManifest.name) {
      reportError(`manifests/codex/${manifestName}.yaml - name drift from manifests/claude/${file}`);
    }

    if (codexManifest.description !== expectedManifest.description) {
      reportError(`manifests/codex/${manifestName}.yaml - description drift from manifests/claude/${file}`);
    }

    if (codexManifest.source_plugin !== expectedManifest.source_plugin) {
      reportError(`manifests/codex/${manifestName}.yaml - source_plugin drift from manifests/claude/${file}`);
    }

    if (JSON.stringify(sortedStrings(codexManifest.dependencies || [])) !== JSON.stringify(sortedStrings(expectedManifest.dependencies))) {
      reportError(`manifests/codex/${manifestName}.yaml - dependencies drift from manifests/claude/${file}`);
    }

    const actualResourceKeys = sortedStrings(Object.keys(codexManifest.resources || {}));
    const expectedResourceKeys = sortedStrings(PORTABLE_CODEX_RESOURCE_TYPES);
    if (JSON.stringify(actualResourceKeys) !== JSON.stringify(expectedResourceKeys)) {
      reportError(`manifests/codex/${manifestName}.yaml - resources keys must match Lamella's portable Codex surface`);
    }

    for (const resourceType of PORTABLE_CODEX_RESOURCE_TYPES) {
      const expected = sortedStrings(expectedManifest.resources[resourceType] || []);
      const actual = sortedStrings(codexManifest.resources?.[resourceType] || []);
      if (JSON.stringify(expected) !== JSON.stringify(actual)) {
        reportError(`manifests/codex/${manifestName}.yaml - ${resourceType} drift from manifests/claude/${file}`);
      }
    }

    const expectedOptions = expectedManifest.options;
    const actualOptions = codexManifest.options || {};
    for (const [key, value] of Object.entries(expectedOptions)) {
      if (actualOptions[key] !== value) {
        reportError(`manifests/codex/${manifestName}.yaml - option '${key}' drift from manifests/claude/${file}`);
      }
    }

    alignedManifests += 1;
  }

  return alignedManifests;
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
  validateSkillFrontmatter,
  validateManifestAlignment,
  PORTABLE_CODEX_RESOURCE_TYPES,
};
