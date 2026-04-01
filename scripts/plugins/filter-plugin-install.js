#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  loadMarkdownFrontmatter,
  normalizeRequires,
  requirementsSatisfied,
  describeRequires,
  pathLabel,
} = require('../lib/requires');

function usage() {
  console.error('Usage: filter-plugin-install.js <src-plugin-dir> <dst-plugin-dir>');
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

function copyDir(src, dst) {
  ensureDir(path.dirname(dst));
  fs.cpSync(src, dst, { recursive: true });
}

function shouldIncludeMarkdown(filePath, detectedTools, ignoreRequires) {
  const frontmatter = loadMarkdownFrontmatter(filePath);
  const requires = frontmatter ? normalizeRequires(frontmatter.requires) : [];
  return {
    include: requirementsSatisfied(requires, detectedTools, ignoreRequires),
    requires: requires || [],
  };
}

function recordSkip(summary, kind, baseDir, filePath, requires) {
  summary.skipped.push({
    kind,
    path: pathLabel(baseDir, filePath),
    requires: describeRequires(requires),
  });
}

function filterMarkdownFiles(srcDir, dstDir, kind, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcDir)) return;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);

    if (entry.isDirectory()) {
      filterMarkdownFiles(srcPath, dstPath, kind, detectedTools, ignoreRequires, summary);
      continue;
    }

    if (!entry.isFile()) continue;

    if (!entry.name.endsWith('.md')) {
      copyFile(srcPath, dstPath);
      summary.copied += 1;
      continue;
    }

    const decision = shouldIncludeMarkdown(srcPath, detectedTools, ignoreRequires);
    if (!decision.include) {
      recordSkip(summary, kind, srcDir.includes('_standalone') ? srcDir : path.dirname(srcDir), srcPath, decision.requires);
      continue;
    }

    copyFile(srcPath, dstPath);
    summary.copied += 1;
  }
}

function filterAgents(srcDir, dstDir, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcDir)) return;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const srcPath = path.join(srcDir, entry.name);
    const decision = shouldIncludeMarkdown(srcPath, detectedTools, ignoreRequires);
    if (!decision.include) {
      recordSkip(summary, 'agent', srcDir, srcPath, decision.requires);
      continue;
    }

    copyFile(srcPath, path.join(dstDir, entry.name));
    summary.copied += 1;
  }
}

function filterCommands(srcDir, dstDir, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcDir)) return;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const srcPath = path.join(srcDir, entry.name);
    const decision = shouldIncludeMarkdown(srcPath, detectedTools, ignoreRequires);
    if (!decision.include) {
      recordSkip(summary, 'command', srcDir, srcPath, decision.requires);
      continue;
    }

    copyFile(srcPath, path.join(dstDir, entry.name));
    summary.copied += 1;
  }
}

function filterSkills(srcDir, dstDir, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcDir)) return;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const srcSkillDir = path.join(srcDir, entry.name);
    const skillFile = path.join(srcSkillDir, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const decision = shouldIncludeMarkdown(skillFile, detectedTools, ignoreRequires);
    if (!decision.include) {
      recordSkip(summary, 'skill', srcDir, skillFile, decision.requires);
      continue;
    }

    copyDir(srcSkillDir, path.join(dstDir, entry.name));
    summary.copied += 1;
  }
}

function filterStandalone(srcDir, dstDir, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcDir)) return;

  for (const resourceType of ['rules', 'workflows', 'templates']) {
    const resourceSrcDir = path.join(srcDir, resourceType);
    if (!fs.existsSync(resourceSrcDir)) continue;
    filterMarkdownFiles(resourceSrcDir, path.join(dstDir, resourceType), resourceType.slice(0, -1), detectedTools, ignoreRequires, summary);
  }
}

function filterHooksConfig(srcPath, dstPath, detectedTools, ignoreRequires, summary) {
  if (!fs.existsSync(srcPath)) return;

  const raw = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));
  const sourceHooks = raw.hooks || raw;

  function stripRequiresFromHook(hook) {
    const next = { ...hook };
    delete next.requires;
    return next;
  }

  let filteredHooks;

  if (Array.isArray(sourceHooks)) {
    filteredHooks = sourceHooks
      .map((matcher, matcherIndex) => {
        if (!matcher || typeof matcher !== 'object' || !Array.isArray(matcher.hooks)) {
          return matcher;
        }

        const nextHooks = matcher.hooks.filter((hook, hookIndex) => {
          const requires = normalizeRequires(hook.requires) || [];
          const include = requirementsSatisfied(requires, detectedTools, ignoreRequires);
          if (!include) {
            summary.skipped.push({
              kind: 'hook',
              path: `hooks[${matcherIndex}].hooks[${hookIndex}]`,
              requires: describeRequires(requires),
            });
          }
          return include;
        }).map(stripRequiresFromHook);

        if (nextHooks.length === 0) return null;
        return { ...matcher, hooks: nextHooks };
      })
      .filter(Boolean);
  } else {
    filteredHooks = {};
    for (const [eventName, matchers] of Object.entries(sourceHooks)) {
      if (!Array.isArray(matchers)) {
        filteredHooks[eventName] = matchers;
        continue;
      }

      const nextMatchers = matchers
        .map((matcher, matcherIndex) => {
          if (!matcher || typeof matcher !== 'object' || !Array.isArray(matcher.hooks)) {
            return matcher;
          }

          const nextHooks = matcher.hooks.filter((hook, hookIndex) => {
            const requires = normalizeRequires(hook.requires) || [];
            const include = requirementsSatisfied(requires, detectedTools, ignoreRequires);
            if (!include) {
              summary.skipped.push({
                kind: 'hook',
                path: `${eventName}[${matcherIndex}].hooks[${hookIndex}]`,
                requires: describeRequires(requires),
              });
            }
            return include;
          }).map(stripRequiresFromHook);

          if (nextHooks.length === 0) return null;
          return { ...matcher, hooks: nextHooks };
        })
        .filter(Boolean);

      if (nextMatchers.length > 0) {
        filteredHooks[eventName] = nextMatchers;
      }
    }
  }

  const output = raw.hooks ? { ...raw, hooks: filteredHooks } : filteredHooks;
  ensureDir(path.dirname(dstPath));
  fs.writeFileSync(dstPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  summary.copied += 1;
}

function main() {
  const srcPluginDir = process.argv[2];
  const dstPluginDir = process.argv[3];
  if (!srcPluginDir || !dstPluginDir) usage();

  const detectedTools = new Set(
    (process.env.LAMELLA_DETECTED_TOOLS || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
  );
  const ignoreRequires = process.env.LAMELLA_IGNORE_REQUIRES === '1';

  fs.rmSync(dstPluginDir, { recursive: true, force: true });
  ensureDir(dstPluginDir);

  const summary = {
    copied: 0,
    skipped: [],
  };

  const pluginMeta = path.join(srcPluginDir, '.claude-plugin');
  if (fs.existsSync(pluginMeta)) {
    copyDir(pluginMeta, path.join(dstPluginDir, '.claude-plugin'));
    summary.copied += 1;
  }

  const scriptsDir = path.join(srcPluginDir, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    copyDir(scriptsDir, path.join(dstPluginDir, 'scripts'));
    summary.copied += 1;
  }

  filterAgents(path.join(srcPluginDir, 'agents'), path.join(dstPluginDir, 'agents'), detectedTools, ignoreRequires, summary);
  filterCommands(path.join(srcPluginDir, 'commands'), path.join(dstPluginDir, 'commands'), detectedTools, ignoreRequires, summary);
  filterSkills(path.join(srcPluginDir, 'skills'), path.join(dstPluginDir, 'skills'), detectedTools, ignoreRequires, summary);
  filterHooksConfig(
    path.join(srcPluginDir, 'hooks', 'hooks.json'),
    path.join(dstPluginDir, 'hooks', 'hooks.json'),
    detectedTools,
    ignoreRequires,
    summary,
  );
  filterStandalone(path.join(srcPluginDir, '_standalone'), path.join(dstPluginDir, '_standalone'), detectedTools, ignoreRequires, summary);

  process.stdout.write(JSON.stringify(summary));
}

main();
