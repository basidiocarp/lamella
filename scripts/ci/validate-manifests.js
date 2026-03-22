#!/usr/bin/env node
/**
 * Validate plugin manifests — ensure every resource listed actually exists on disk.
 *
 * Checks all plugin-manifests/*.json (excluding schema.json and index.json).
 * For each resource type (skills, agents, commands, rules, hooks, workflows,
 * templates, scripts, mcp-configs), verifies the referenced path exists.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../..');
const MANIFESTS_DIR = path.join(BASE_DIR, 'manifests', 'claude');

// Map resource types to their base directories
const RESOURCE_DIRS = {
  skills: path.join(BASE_DIR, 'resources', 'skills'),
  agents: path.join(BASE_DIR, 'resources', 'agents'),
  commands: path.join(BASE_DIR, 'resources', 'commands'),
  rules: path.join(BASE_DIR, 'resources', 'rules'),
  hooks: path.join(BASE_DIR, 'scripts', 'hooks'),
  workflows: path.join(BASE_DIR, 'resources', 'workflows'),
  templates: path.join(BASE_DIR, 'resources', 'templates'),
  scripts: path.join(BASE_DIR, 'scripts'),
  'mcp-configs': path.join(BASE_DIR, 'resources', 'mcp-configs'),
};

let errors = 0;
let warnings = 0;
let manifestCount = 0;
let resourceCount = 0;

function validateManifest(manifestPath) {
  const name = path.basename(manifestPath);
  let manifest;

  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: ${name} - Invalid JSON: ${e.message}`);
    errors++;
    return;
  }

  // Check required fields
  for (const field of ['name', 'version', 'description']) {
    if (!manifest[field]) {
      console.error(`ERROR: ${name} - Missing required field: ${field}`);
      errors++;
    }
  }

  // Validate resources
  const resources = manifest.resources || {};

  for (const [type, entries] of Object.entries(resources)) {
    if (!Array.isArray(entries)) {
      console.error(`ERROR: ${name} - resources.${type} is not an array`);
      errors++;
      continue;
    }

    const baseDir = RESOURCE_DIRS[type];
    if (!baseDir) {
      console.warn(`WARN: ${name} - Unknown resource type: ${type}`);
      warnings++;
      continue;
    }

    for (const entry of entries) {
      resourceCount++;
      const fullPath = path.join(baseDir, entry);

      if (!fs.existsSync(fullPath)) {
        console.error(`ERROR: ${name} - Missing ${type}: ${entry}`);
        errors++;
      }
    }
  }

  // Validate dependencies reference existing plugins
  if (Array.isArray(manifest.dependencies)) {
    for (const dep of manifest.dependencies) {
      const depPath = path.join(MANIFESTS_DIR, `${dep}.json`);
      if (!fs.existsSync(depPath)) {
        console.warn(`WARN: ${name} - Dependency not found: ${dep}`);
        warnings++;
      }
    }
  }
}

// Find all manifest files
const files = fs.readdirSync(MANIFESTS_DIR)
  .filter(f => f.endsWith('.json') && f !== 'schema.json' && f !== 'index.json')
  .sort();

for (const file of files) {
  manifestCount++;
  validateManifest(path.join(MANIFESTS_DIR, file));
}

// Summary
const parts = [`Validated ${manifestCount} manifests (${resourceCount} resources)`];
if (warnings > 0) parts.push(`${warnings} warnings`);
console.log(parts.join(', '));

if (errors > 0) {
  console.error(`\n${errors} error(s) found`);
  process.exit(1);
}
