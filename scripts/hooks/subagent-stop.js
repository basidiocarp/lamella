#!/usr/bin/env node
/**
 * SubagentStop hook: log completions and warn on failures or slow runs.
 */

const fs = require('fs');
const path = require('path');
const { readStdinJson, ensureDir, getHomeDir, getDateString, output, logHookError } = require('../lib/utils');

async function main() {
  const input = await readStdinJson();
  const agentName = input.agent_name || 'unknown';
  const sessionId = input.session_id || 'unknown';
  const exitCode = Number.isFinite(input.exit_code) ? input.exit_code : Number(input.exit_code || 0);
  const durationMs = Number.isFinite(input.duration_ms) ? input.duration_ms : Number(input.duration_ms || 0);

  const logDir = path.join(getHomeDir(), '.claude', 'logs');
  ensureDir(logDir);

  const logEntry = {
    timestamp: new Date().toISOString(),
    agent: agentName,
    session: sessionId,
    exit_code: exitCode,
    duration_ms: durationMs
  };
  fs.appendFileSync(
    path.join(logDir, `subagents-${getDateString()}.jsonl`),
    `${JSON.stringify(logEntry)}\n`,
    'utf8'
  );

  const messages = [];
  let additionalContext = null;
  if (durationMs > 30000) {
    const durationSec = (durationMs / 1000).toFixed(2);
    messages.push(`⏱️ Subagent '${agentName}' took ${durationSec}s to complete. Consider splitting the task.`);
    additionalContext = `Subagent performance: ${agentName} completed in ${durationSec}s`;
  }

  if (exitCode !== 0) {
    messages.push(`❌ Subagent '${agentName}' failed with exit code ${exitCode}. Review task output for errors.`);
  }

  if (messages.length > 0) {
    output({
      systemMessage: messages.join('\n'),
      ...(additionalContext
        ? { hookSpecificOutput: { additionalContext } }
        : {})
    });
  }
}

main().catch(error => {
  logHookError('subagent-stop', error);
  process.exit(0);
});
