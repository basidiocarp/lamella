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

const DIST_DIR = path.join(__dirname, '../../dist/plugins');

let errors = 0;
let warnings = 0;
let pluginCount = 0;

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
      // Verify each plugin source path exists
      for (const p of marketplace.plugins) {
        const srcPath = path.join(DIST_DIR, '..', p.source);
        if (!fs.existsSync(srcPath)) {
          console.error(`ERROR: marketplace.json — plugin source not found: ${p.source}`);
          errors++;
        }
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
