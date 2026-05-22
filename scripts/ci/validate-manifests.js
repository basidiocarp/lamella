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
const { CONTENT_ROOT, BASE_DIR } = require('../lib/content-root');

const MANIFESTS_DIR = path.join(BASE_DIR, 'manifests', 'claude');

// Map resource types to their base directories.
// Content resources resolve via CONTENT_ROOT; infrastructure resources stay under BASE_DIR.
const RESOURCE_DIRS = {
  skills: path.join(CONTENT_ROOT, 'skills'),
  agents: path.join(CONTENT_ROOT, 'agents'),
  commands: path.join(CONTENT_ROOT, 'commands'),
  rules: path.join(CONTENT_ROOT, 'rules'),
  hooks: path.join(BASE_DIR, 'scripts', 'hooks'),
  workflows: path.join(CONTENT_ROOT, 'workflows'),
  templates: path.join(CONTENT_ROOT, 'templates'),
  scripts: path.join(BASE_DIR, 'scripts'),
  'mcp-configs': path.join(CONTENT_ROOT, 'mcp-configs'),
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

      // Reject path traversal before any filesystem access.
      // path.join normalises sequences like ../../ but path.resolve
      // gives the canonical absolute path that lets us check containment.
      const fullPath = path.join(baseDir, entry);
      const canonical = path.resolve(fullPath);
      const baseSep = baseDir.endsWith(path.sep) ? baseDir : baseDir + path.sep;
      if (!canonical.startsWith(baseSep) && canonical !== baseDir) {
        console.error(`ERROR: ${name} - Path traversal in ${type}: ${entry}`);
        errors++;
        continue;
      }

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
