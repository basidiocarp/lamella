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
      command = String(toolInput.command || '').slice(0, 200);
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
  fs.appendFileSync(logFile, `${JSON.stringify(logEntry)}\n`, 'utf8');
}

main().catch(error => {
  logHookError('session-logger', error);
  process.exit(0);
});
