#!/usr/bin/env node
/**
 * Validate built plugin output — ensure each dist/plugins/<name>/ directory
 * is a valid Claude Code plugin with .claude-plugin/plugin.json.
 *
 * Run after `make build` or `build-marketplace.sh`.
 * This is an optional post-build validator, not part of source validation.
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../../dist/claude/plugins');

let errors = 0;
let warnings = 0;
let pluginCount = 0;

function reportError(message) {
  console.error(message);
  errors++;
}

function validateMarketplaceSource(plugin, entry, distRoot) {
  if (typeof entry.source === 'string') {
    const srcPath = path.join(distRoot, entry.source);
    if (!fs.existsSync(srcPath)) {
      reportError(`ERROR: marketplace.json — plugin source not found: ${entry.source}`);
    }
    return;
  }

  if (!entry.source || Array.isArray(entry.source) || typeof entry.source !== 'object') {
    reportError(`ERROR: marketplace.json — plugin '${plugin}' has invalid source entry`);
    return;
  }

  if (entry.source.source === 'git-subdir') {
    for (const field of ['url', 'path', 'ref']) {
      if (typeof entry.source[field] !== 'string' || entry.source[field].trim() === '') {
        reportError(`ERROR: marketplace.json — plugin '${plugin}' missing source.${field}`);
      }
    }
    return;
  }

  reportError(`ERROR: marketplace.json — plugin '${plugin}' has unsupported source mode: ${entry.source.source ?? '<missing>'}`);
}

function collectCommands(node, commands = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectCommands(item, commands);
    return commands;
  }

  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'command' && typeof value === 'string') {
        commands.push(value);
      }
      collectCommands(value, commands);
    }
  }

  return commands;
}

function validateHookScriptRefs(name, pluginDir, hooksJsonPath) {
  const hooks = JSON.parse(fs.readFileSync(hooksJsonPath, 'utf-8'));
  const commands = collectCommands(hooks.hooks || hooks);
  const scriptPattern = /\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/hooks\/([A-Za-z0-9._-]+)/g;

  for (const command of commands) {
    for (const match of command.matchAll(scriptPattern)) {
      const scriptName = match[1];
      const scriptPath = path.join(pluginDir, 'scripts', 'hooks', scriptName);
      if (!fs.existsSync(scriptPath)) {
        reportError(`ERROR: ${name} — hooks.json references missing script ${scriptName}`);
      }
    }
  }
}

function validateLspServerMap(name, sourceLabel, value) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    reportError(`ERROR: ${name} — ${sourceLabel} must be an object mapping server names to configs`);
    return;
  }

  for (const [serverName, config] of Object.entries(value)) {
    if (!config || Array.isArray(config) || typeof config !== 'object') {
      reportError(`ERROR: ${name} — ${sourceLabel}.${serverName} must be an object`);
      continue;
    }

    if (typeof config.command !== 'string' || config.command.trim() === '') {
      reportError(`ERROR: ${name} — ${sourceLabel}.${serverName} missing string 'command'`);
    }

    const mapping = config.extensionToLanguage;
    if (!mapping || Array.isArray(mapping) || typeof mapping !== 'object' || Object.keys(mapping).length === 0) {
      reportError(`ERROR: ${name} — ${sourceLabel}.${serverName} missing object 'extensionToLanguage'`);
      continue;
    }

    for (const [extension, language] of Object.entries(mapping)) {
      if (!extension.startsWith('.')) {
        reportError(`ERROR: ${name} — ${sourceLabel}.${serverName} extension '${extension}' must start with '.'`);
      }

      if (typeof language !== 'string' || language.trim() === '') {
        reportError(`ERROR: ${name} — ${sourceLabel}.${serverName}.${extension} must map to a non-empty language string`);
      }
    }
  }
}

function validateLspReference(name, pluginDir, ref) {
  if (typeof ref === 'string') {
    if (!ref.startsWith('./')) {
      reportError(`ERROR: ${name} — lspServers path must start with './': ${ref}`);
      return;
    }

    const lspPath = path.join(pluginDir, ref.slice(2));
    if (!fs.existsSync(lspPath)) {
      reportError(`ERROR: ${name} — missing lsp config: ${ref}`);
      return;
    }

    try {
      const config = JSON.parse(fs.readFileSync(lspPath, 'utf-8'));
      validateLspServerMap(name, `${ref}`, config);
    } catch (e) {
      reportError(`ERROR: ${name} — invalid JSON in ${ref}: ${e.message}`);
    }

    return;
  }

  if (Array.isArray(ref)) {
    for (const item of ref) {
      validateLspReference(name, pluginDir, item);
    }
    return;
  }

  validateLspServerMap(name, 'lspServers', ref);
}

function validatePlugin(pluginDir) {
  const name = path.basename(pluginDir);
  const manifestPath = path.join(pluginDir, '.claude-plugin', 'plugin.json');

  // Must have .claude-plugin/plugin.json
  if (!fs.existsSync(manifestPath)) {
    console.error(`ERROR: ${name} — missing .claude-plugin/plugin.json`);
    errors++;
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: ${name} — invalid plugin.json: ${e.message}`);
    errors++;
    return;
  }

  // Required field: name
  if (!manifest.name) {
    console.error(`ERROR: ${name} — plugin.json missing 'name'`);
    errors++;
  }

  // Recommended fields
  for (const field of ['version', 'description']) {
    if (!manifest[field]) {
      console.warn(`WARN: ${name} — plugin.json missing '${field}'`);
      warnings++;
    }
  }

  if (manifest.lspServers !== undefined) {
    validateLspReference(name, pluginDir, manifest.lspServers);
  }

  // Agents should be flat .md files (not nested in subdirs)
  const agentsDir = path.join(pluginDir, 'agents');
  if (fs.existsSync(agentsDir)) {
    const agentFiles = fs.readdirSync(agentsDir);
    for (const f of agentFiles) {
      const full = path.join(agentsDir, f);
      if (fs.statSync(full).isDirectory()) {
        console.warn(`WARN: ${name} — agents/${f} is a directory (should be flat .md files)`);
        warnings++;
      }
    }
  }

  // Skills should have SKILL.md in each subdirectory
  const skillsDir = path.join(pluginDir, 'skills');
  if (fs.existsSync(skillsDir)) {
    const skillDirs = fs.readdirSync(skillsDir).filter(d =>
      fs.statSync(path.join(skillsDir, d)).isDirectory()
    );
    for (const d of skillDirs) {
      if (!fs.existsSync(path.join(skillsDir, d, 'SKILL.md'))) {
        console.warn(`WARN: ${name} — skills/${d}/ missing SKILL.md`);
        warnings++;
      }
    }
  }

  // Commands should be flat .md files
  const commandsDir = path.join(pluginDir, 'commands');
  if (fs.existsSync(commandsDir)) {
    const cmdFiles = fs.readdirSync(commandsDir);
    for (const f of cmdFiles) {
      if (!f.endsWith('.md')) {
        console.warn(`WARN: ${name} — commands/${f} is not a .md file`);
        warnings++;
      }
    }
  }

  // Hooks should be in hooks/hooks.json
  const hooksDir = path.join(pluginDir, 'hooks');
  if (fs.existsSync(hooksDir)) {
    const hooksJson = path.join(hooksDir, 'hooks.json');
    if (!fs.existsSync(hooksJson)) {
      console.warn(`WARN: ${name} — hooks/ directory exists but no hooks.json`);
      warnings++;
    } else {
      try {
        validateHookScriptRefs(name, pluginDir, hooksJson);
      } catch (e) {
        reportError(`ERROR: ${name} — invalid hooks.json: ${e.message}`);
      }
    }
  }

  pluginCount++;
}

// Check if dist exists
if (!fs.existsSync(DIST_DIR)) {
  console.log('No built plugins found (dist/plugins/ does not exist). Run `make build` first.');
  process.exit(0);
}

// Validate each plugin
const dirs = fs.readdirSync(DIST_DIR).filter(d =>
  fs.statSync(path.join(DIST_DIR, d)).isDirectory()
);

for (const dir of dirs.sort()) {
  validatePlugin(path.join(DIST_DIR, dir));
}

// Validate marketplace.json if present
const marketplacePath = path.join(DIST_DIR, '..', '.claude-plugin', 'marketplace.json');
if (fs.existsSync(marketplacePath)) {
  try {
    const marketplace = JSON.parse(fs.readFileSync(marketplacePath, 'utf-8'));
    if (!marketplace.name) {
      console.error('ERROR: marketplace.json missing "name"');
      errors++;
    }
    if (!Array.isArray(marketplace.plugins)) {
      console.error('ERROR: marketplace.json missing "plugins" array');
      errors++;
    } else {
      // Verify each plugin source entry is valid for the selected marketplace mode.
      for (const p of marketplace.plugins) {
        validateMarketplaceSource(p.name ?? '<unknown>', p, path.join(DIST_DIR, '..'));
      }
      console.log(`Validated marketplace.json (${marketplace.plugins.length} plugins)`);
    }
  } catch (e) {
    console.error(`ERROR: marketplace.json — invalid JSON: ${e.message}`);
    errors++;
  }
}

// Summary
const parts = [`Validated ${pluginCount} built plugins`];
if (warnings > 0) parts.push(`${warnings} warnings`);
console.log(parts.join(', '));

if (errors > 0) {
  console.error(`\n${errors} error(s) found`);
  process.exit(1);
}
