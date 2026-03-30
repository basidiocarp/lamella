#!/usr/bin/env node
/**
 * PostToolUse hook: warn when edited files contain inline-dash comment headers.
 *
 * Cross-platform replacement for comment-style-check.sh.
 */

const { existsSync } = require('fs');
const { readStdinJson, readFile, grepFile, log, logHookError } = require('../lib/utils');

const INLINE_DASH_PATTERN = /^\s*(#|\/\/) ─{2,}\s+.+\s+─{3,}/u;

async function main() {
  const input = await readStdinJson();
  const filePath = input.tool_input?.file_path || '';

  if (!filePath || !existsSync(filePath)) {
    return;
  }

  const content = readFile(filePath);
  if (!content) {
    return;
  }

  const matches = grepFile(filePath, INLINE_DASH_PATTERN);
  if (matches.length === 0) {
    return;
  }

  log(`[Hook] Found ${matches.length} inline-dash comment(s) in ${filePath}`);
  log('[Hook] Use boxed style instead:');
  log('[Hook]   # ─────────────────────────────────────────────────────────────────────────────');
  log('[Hook]   # Section Name');
  log('[Hook]   # ─────────────────────────────────────────────────────────────────────────────');

  for (const match of matches.slice(0, 3)) {
    log(`[Hook]   → ${match.lineNumber}:${match.content}`);
  }
}

main().catch(error => {
  logHookError('comment-style-check', error);
  process.exit(0);
});
