#!/usr/bin/env node
/**
 * Validate cross-references — ensure path references to agents/, skills/,
 * commands/, workflows/, templates/ in markdown files resolve to real targets.
 *
 * Scans all .md files under agents/, commands/, workflows/, templates/, docs/,
 * and skills/ for path-like references and checks they exist on disk.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../..');

// Directories to scan for markdown files containing references
const SCAN_DIRS = ['agents', 'commands', 'workflows', 'templates'];

// Files/directories to skip (reference docs with example paths, roadmap with future plans)
const SKIP_PATHS = [
  'docs/reference',
  'docs/authoring/best-practices.md',
  'docs/authoring/skills-spec.md',
  'docs/roadmap.md',
];

// Path prefixes we validate (relative to BASE_DIR)
const VALID_PREFIXES = ['agents/', 'skills/', 'commands/', 'workflows/', 'templates/'];

// Patterns that look like resource path references
// Matches: agents/foo/bar.md, skills/core/brainstorming, commands/dev/tdd.md, etc.
const PATH_PATTERN = /(?:agents|skills|commands|workflows|templates)\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_.-]+)*/g;

// Paths to ignore (common false positives)
const IGNORE_PATTERNS = [
  /^\$/, // shell variables like $BASE_DIR/agents/
  /\{/,  // template interpolation
];

let errors = 0;
let warnings = 0;
let filesScanned = 0;
let refsChecked = 0;

function findMdFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_')) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relFile = path.relative(BASE_DIR, filePath);

  // Skip files inside code blocks
  const lines = content.split('\n');
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const matches = line.matchAll(PATH_PATTERN);
    for (const match of matches) {
      const ref = match[0];

      // Skip false positives
      if (IGNORE_PATTERNS.some(p => p.test(ref))) continue;

      refsChecked++;
      const fullPath = path.join(BASE_DIR, ref);

      // Check if the path exists (as file, directory, or with .md extension)
      if (!fs.existsSync(fullPath) && !fs.existsSync(fullPath + '.md')) {
        console.error(`ERROR: ${relFile}:${i + 1} - Broken reference: ${ref}`);
        errors++;
      }
    }
  }
}

// Scan all target directories
for (const dir of SCAN_DIRS) {
  const fullDir = path.join(BASE_DIR, dir);
  const files = findMdFiles(fullDir);
  for (const file of files) {
    filesScanned++;
    validateFile(file);
  }
}

// Summary
const parts = [`Scanned ${filesScanned} files (${refsChecked} references checked)`];
if (warnings > 0) parts.push(`${warnings} warnings`);
console.log(parts.join(', '));

if (errors > 0) {
  console.error(`\n${errors} error(s) found`);
  process.exit(1);
}
