#!/usr/bin/env node
/**
 * rhizome-advisory.js — PreToolUse hook for Bash.
 *
 * Emits a stderr warning when the agent uses Bash for code navigation tasks
 * that should use Rhizome MCP tools instead. Always exits 0 (advisory only).
 */

let data = '';
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || '';

    const patterns = [
      {
        re: /grep\s+(-\w+\s+)*["']?(fn |pub fn |def |class |function )/,
        tool: 'mcp__rhizome__search_symbols',
        use: 'find symbol definitions',
      },
      {
        re: /grep\s+-r\w*\s+.*\s+(src\/|lib\/|server\/|crates\/)/,
        tool: 'mcp__rhizome__find_references',
        use: 'find references across the codebase',
      },
      {
        re: /\brg\s+["']?[A-Z][a-zA-Z]+["']?\s+(src|lib|server|crates)\b/,
        tool: 'mcp__rhizome__search_symbols',
        use: 'find a named symbol',
      },
      {
        re: /find\s+\.\s+.*-name\s+["']?\*\.(rs|ts|tsx|js|jsx)["']?/,
        tool: 'mcp__rhizome__get_structure or Glob',
        use: 'discover source files',
      },
      {
        re: /\b(cat|head|tail)\s+(src|lib|server|crates)\/\S+\.(rs|ts|tsx|js|jsx)\b/,
        tool: 'Read',
        use: 'read a source file',
      },
      {
        re: /\bsed\s+-n\s+\d/,
        tool: 'Read with offset/limit',
        use: 'read a line range from a file',
      },
    ];

    for (const { re, tool, use } of patterns) {
      if (re.test(cmd)) {
        process.stderr.write(
          `[rhizome-advisory] Bash used for code navigation — prefer: ${tool}\n` +
          `  To: ${use}\n` +
          `  See CLAUDE.md 'Tool Priority' for Rhizome rules.\n`
        );
        break;
      }
    }
  } catch (_) {
    // malformed input — pass through silently
  }

  process.stdout.write(data);
});
