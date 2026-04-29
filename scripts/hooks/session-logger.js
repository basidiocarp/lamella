#!/usr/bin/env node
/**
 * PostToolUse hook: log tool activity to JSONL for later analysis.
 */

const fs = require('fs');
const path = require('path');
const {
  readStdinJson,
  ensureDir,
  getHomeDir,
  getDateString,
  getProjectName,
  logHookError
} = require('../lib/utils');

function stringifyValue(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function estimateTokens(value) {
  return Math.floor(value.length / 4);
}

/**
 * Redact common secret patterns from a command string before logging.
 * Targets Bearer tokens, API_KEY/TOKEN/SECRET/PASSWORD assignments, and
 * Authorization header values that appear in shell commands.
 *
 * @param {string} str - Raw command string
 * @returns {string} Command with secret values replaced by [REDACTED]
 */
function redactSecrets(str) {
  if (!str) return str;
  // Bearer / Authorization header tokens (e.g. curl -H "Authorization: Bearer sk-...")
  let out = str.replace(/Bearer\s+\S+/g, 'Bearer [REDACTED]');
  // Common secret env-var assignments: API_KEY=..., TOKEN=..., SECRET=..., PASSWORD=...
  out = out.replace(
    /((?:API_?KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH(?:ORIZATION)?|ACCESS_?KEY|PRIVATE_?KEY)\s*=\s*)(\S+)/gi,
    '$1[REDACTED]'
  );
  // Authorization header values in bare header form
  out = out.replace(/(Authorization:\s*)(\S+)/gi, '$1[REDACTED]');
  return out;
}

async function main() {
  const input = await readStdinJson();
  const logDir = process.env.CLAUDE_LOG_DIR || path.join(getHomeDir(), '.claude', 'logs');
  const enableTokens = (process.env.CLAUDE_LOG_TOKENS || 'true').toLowerCase() === 'true';
  const sessionId = process.env.CLAUDE_SESSION_ID || `${Date.now()}-${process.pid}`;

  ensureDir(logDir);

  const toolName = input.tool_name || 'unknown';
  const toolInput = input.tool_input || {};
  const toolInputText = stringifyValue(toolInput);
  const toolOutputText = stringifyValue(input.tool_output);
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const projectName = path.basename(projectDir) || getProjectName() || 'unknown';

  let filePath = '';
  let command = '';

  switch (toolName) {
    case 'Read':
    case 'Write':
    case 'Edit':
      filePath = toolInput.file_path || toolInput.path || '';
      break;
    case 'Bash':
      command = redactSecrets(String(toolInput.command || '')).slice(0, 200);
      break;
    case 'Grep':
    case 'Glob':
      filePath = toolInput.path || toolInput.pattern || '';
      break;
    default:
      break;
  }

  const tokensIn = enableTokens ? estimateTokens(toolInputText) : 0;
  const tokensOut = enableTokens ? estimateTokens(toolOutputText) : 0;
  const logEntry = {
    timestamp: new Date().toISOString(),
    session_id: sessionId,
    tool: toolName,
    project: projectName,
    tokens: {
      input: tokensIn,
      output: tokensOut,
      total: tokensIn + tokensOut
    }
  };

  if (filePath) {
    logEntry.file = filePath;
  }
  if (command) {
    logEntry.command = command;
  }

  const logFile = path.join(logDir, `activity-${getDateString()}.jsonl`);
  // mode 0o600: owner read/write only — prevents other users from reading log files
  // that may contain command snippets with sensitive context.
  fs.appendFileSync(logFile, `${JSON.stringify(logEntry)}\n`, { encoding: 'utf8', mode: 0o600 });
  // appendFileSync mode only applies at file creation; enforce 0600 on existing files too.
  try { fs.chmodSync(logFile, 0o600); } catch { /* best-effort: read-only fs or no ownership */ }
}

main().catch(error => {
  logHookError('session-logger', error);
  process.exit(0);
});
