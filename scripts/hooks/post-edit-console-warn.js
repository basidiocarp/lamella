#!/usr/bin/env node
/**
 * PostToolUse Hook: Warn about console.log statements after edits
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs after Edit tool use. Reads the edited file and checks for
 * console.log statements. Warns via stderr if found.
 *
 * Exit code 0 — warn only, does not block.
 */

const fs = require('fs');
const path = require('path');

// Files where console.log is expected
const EXCLUDED_PATTERNS = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\.config\.[jt]s$/,
  /scripts\//,
  /__tests__\//,
  /__mocks__\//,
];

const MAX_STDIN = 1024 * 1024; // 1MB limit
let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += chunk.length > remaining ? chunk.slice(0, remaining) : chunk;
  }
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = input.tool_input?.file_path || '';

    // Only check JS/TS files
    if (!/\.[jt]sx?$/.test(filePath)) {
      process.stdout.write(data);
      return;
    }

    // Skip excluded patterns
    const normalized = filePath.replace(/\\/g, '/');
    if (EXCLUDED_PATTERNS.some(pattern => pattern.test(normalized))) {
      process.stdout.write(data);
      return;
    }

    // Read the file and check for console.log
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const matches = [];

      for (let i = 0; i < lines.length; i++) {
        if (/\bconsole\.log\b/.test(lines[i])) {
          matches.push({ line: i + 1, text: lines[i].trim() });
        }
      }

      if (matches.length > 0) {
        console.error(`[Hook] WARNING: ${matches.length} console.log statement(s) in ${path.basename(filePath)}`);
        for (const m of matches.slice(0, 3)) {
          console.error(`[Hook]   L${m.line}: ${m.text.substring(0, 80)}`);
        }
        if (matches.length > 3) {
          console.error(`[Hook]   ... and ${matches.length - 3} more`);
        }
        console.error('[Hook] Remove before committing');
      }
    }
  } catch {
    // Parse error — pass through
  }

  process.stdout.write(data);
});
