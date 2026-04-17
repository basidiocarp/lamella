#!/usr/bin/env node
/**
 * PreToolUse Hook: Advisory warning for destructive MCP tool annotations
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Reads a PreToolUse event from stdin. Inspects the MCP tool annotation
 * metadata (readOnlyHint, destructiveHint, idempotentHint). If the tool is
 * annotated as destructive, writes an advisory message to stderr so the
 * operator can review before approving.
 *
 * Exit code 0 — advisory only, non-blocking.
 */

const MAX_STDIN = 1024 * 1024; // 1 MB limit
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
    const event = JSON.parse(data);

    const toolName = event.tool_name || event.toolName || '(unknown)';
    const annotations = event.tool_annotations
      || event.toolAnnotations
      || event.annotations
      || {};

    const destructive = Boolean(annotations.destructiveHint);
    const readOnly = Boolean(annotations.readOnlyHint);
    const idempotent = Boolean(annotations.idempotentHint);

    if (destructive) {
      process.stderr.write(
        `[annotation-advisory] tool=${toolName} destructive=true` +
        ` readOnly=${readOnly} idempotent=${idempotent}` +
        ` — review before approving\n`
      );
    }
  } catch {
    // Malformed or empty stdin — pass through silently.
  }

  process.exit(0);
});
