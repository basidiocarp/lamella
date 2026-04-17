#!/usr/bin/env node
/**
 * Session-End Shim - Delegate to cortina session-end adapter
 *
 * Transitional hook that pipes session-end events to cortina's structured
 * capture. When cortina becomes unavailable, exits cleanly without blocking
 * the session.
 *
 * Will be replaced by direct cortina wiring in a future cutover (#67c).
 */

const { spawnSync } = require('child_process');
const { readStdinJson, commandExists, logHookError, log } = require('../lib/utils');

async function main() {
  // Read the hook input (Claude Code session-end event envelope)
  const input = await readStdinJson();

  // Check if cortina is available
  if (!commandExists('cortina')) {
    log('[SessionEnd] cortina not found, session-end shim skipping (exiting cleanly)');
    process.exit(0);
  }

  // Convert input back to JSON for piping to cortina
  const inputJson = JSON.stringify(input);

  // Delegate to cortina session-end adapter
  const result = spawnSync('cortina', ['session-end'], {
    input: inputJson,
    encoding: 'utf8',
    stdio: ['pipe', 'inherit', 'inherit'],
    timeout: 10000 // 10s timeout for cortina
  });

  // Exit with cortina's exit code if it was successful, otherwise 0
  // (we don't want to block the session on cortina failure)
  const exitCode = result.error ? 0 : (result.status ?? 0);
  if (result.error) {
    log(`[SessionEnd] cortina execution error: ${result.error.message}`);
  }

  process.exit(exitCode);
}

main().catch(error => {
  logHookError('session-end', error);
  process.exit(0);
});
