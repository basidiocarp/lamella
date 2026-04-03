#!/usr/bin/env node
/**
 * Validate cross-references between authoring resources.
 *
 * Scans markdown files under the shared source directories and checks that
 * path-like references to resources resolve on disk.
 */

const fs = require('fs');
const path = require('path');
const { CONTENT_ROOT, BASE_DIR } = require('../lib/content-root');

// Directories to scan for markdown files containing references.
// These are relative to CONTENT_ROOT (subagents, commands, etc.).
const SCAN_DIRS = ['subagents', 'commands', 'workflows', 'templates'];

// Files/directories to skip (reference docs with example paths, roadmap with future plans)
const SKIP_PATHS = [
  'docs/reference',
  'docs/authoring/best-practices.md',
  'docs/authoring/skills-spec.md',
  'docs/roadmap.md',
];

// Patterns that look like resource path references
// Matches:
// - resources/subagents/code-quality/code-reviewer/SUBAGENT.md
// - resources/subagents/code-quality/code-reviewer
// - resources/skills/core/brainstorming
// - resources/commands/dev/tdd.md
const PATH_PATTERN = /(?:resources\/)?(?:subagents|skills|commands|workflows|templates)\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_.-]+)*/g;

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

      if (!referenceExists(ref)) {
        console.error(`ERROR: ${relFile}:${i + 1} - Broken reference: ${ref}`);
        errors++;
      }
    }
  }
}

function referenceExists(ref) {
  const candidatePaths = [];
  const basePath = path.join(BASE_DIR, ref);
  candidatePaths.push(basePath);
  candidatePaths.push(`${basePath}.md`);

  // Strip the "resources/" prefix and resolve against CONTENT_ROOT.
  // This supports both `resources/skills/...` references and bare `skills/...` references.
  if (ref.startsWith('resources/')) {
    const stripped = ref.slice('resources/'.length);
    const contentPath = path.join(CONTENT_ROOT, stripped);
    candidatePaths.push(contentPath);
    candidatePaths.push(`${contentPath}.md`);
  } else {
    const contentPath = path.join(CONTENT_ROOT, ref);
    candidatePaths.push(contentPath);
    candidatePaths.push(`${contentPath}.md`);
  }

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return true;
    }

    if (candidate.includes(`${path.sep}subagents${path.sep}`)) {
      const stat = fs.statSync(candidate, { throwIfNoEntry: false });
      if (stat && stat.isDirectory() && fs.existsSync(path.join(candidate, 'SUBAGENT.md'))) {
        return true;
      }
    }
  }

  return false;
}

// Scan all target directories (relative to CONTENT_ROOT)
for (const dir of SCAN_DIRS) {
  const fullDir = path.join(CONTENT_ROOT, dir);
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
