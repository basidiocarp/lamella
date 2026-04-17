#!/usr/bin/env node
/**
 * PostToolUse Hook: Structured audit log for MCP tool annotation metadata
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Reads a PostToolUse event from stdin. Extracts the tool name and its MCP
 * annotation fields (readOnlyHint, destructiveHint, idempotentHint). Writes
 * one structured log line to stderr so operators have a record of which
 * annotated tools fired and what their declared capabilities were.
 *
 * Exit code 0 — always non-blocking.
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

    const readOnly = Boolean(annotations.readOnlyHint);
    const destructive = Boolean(annotations.destructiveHint);
    const idempotent = Boolean(annotations.idempotentHint);

    process.stderr.write(
      `[annotation-audit] tool=${toolName}` +
      ` readOnly=${readOnly}` +
      ` destructive=${destructive}` +
      ` idempotent=${idempotent}\n`
    );
  } catch {
    // Malformed or empty stdin — exit cleanly without logging.
  }

  process.exit(0);
});
