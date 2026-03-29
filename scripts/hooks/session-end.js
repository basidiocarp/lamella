#!/usr/bin/env node
/**
 * SessionEnd wrapper - delegate to Cortina when available, otherwise fall back locally
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Lamella keeps this script as wrapper glue for the shared hook catalog.
 * Cortina owns the primary SessionEnd runtime semantics when it is installed.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const {
  getSessionsDir,
  getDateString,
  getTimeString,
  getSessionIdShort,
  ensureDir,
  readFile,
  writeFile,
  replaceInFile,
  log
} = require('../lib/utils');

/**
 * Extract a meaningful summary from the session transcript.
 * Reads the JSONL transcript and pulls out key information:
 * - User messages (tasks requested)
 * - Tools used
 * - Files modified
 */
function extractSessionSummary(transcriptPath) {
  const content = readFile(transcriptPath);
  if (!content) return null;

  const lines = content.split('\n').filter(Boolean);
  const userMessages = [];
  const toolsUsed = new Set();
  const filesModified = new Set();
  let parseErrors = 0;

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);

      // Collect user messages (first 200 chars each)
      if (entry.type === 'user' || entry.role === 'user' || entry.message?.role === 'user') {
        // Support both direct content and nested message.content (Claude Code JSONL format)
        const rawContent = entry.message?.content ?? entry.content;
        const text = typeof rawContent === 'string'
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent.map(c => (c && c.text) || '').join(' ')
            : '';
        if (text.trim()) {
          userMessages.push(text.trim().slice(0, 200));
        }
      }

      // Collect tool names and modified files (direct tool_use entries)
      if (entry.type === 'tool_use' || entry.tool_name) {
        const toolName = entry.tool_name || entry.name || '';
        if (toolName) toolsUsed.add(toolName);

        const filePath = entry.tool_input?.file_path || entry.input?.file_path || '';
        if (filePath && (toolName === 'Edit' || toolName === 'Write')) {
          filesModified.add(filePath);
        }
      }

      // Extract tool uses from assistant message content blocks (Claude Code JSONL format)
      if (entry.type === 'assistant' && Array.isArray(entry.message?.content)) {
        for (const block of entry.message.content) {
          if (block.type === 'tool_use') {
            const toolName = block.name || '';
            if (toolName) toolsUsed.add(toolName);

            const filePath = block.input?.file_path || '';
            if (filePath && (toolName === 'Edit' || toolName === 'Write')) {
              filesModified.add(filePath);
            }
          }
        }
      }
    } catch {
      parseErrors++;
    }
  }

  if (parseErrors > 0) {
    log(`[SessionEnd] Skipped ${parseErrors}/${lines.length} unparseable transcript lines`);
  }

  if (userMessages.length === 0) return null;

  return {
    userMessages: userMessages.slice(-10), // Last 10 user messages
    toolsUsed: Array.from(toolsUsed).slice(0, 20),
    filesModified: Array.from(filesModified).slice(0, 30),
    totalMessages: userMessages.length
  };
}

// Read hook input from stdin (Claude Code provides transcript_path via stdin JSON)
const MAX_STDIN = 1024 * 1024;
let stdinData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (stdinData.length < MAX_STDIN) {
    const remaining = MAX_STDIN - stdinData.length;
    stdinData += chunk.substring(0, remaining);
  }
});

process.stdin.on('end', () => {
  runMain();
});

function runMain() {
  main().catch(err => {
    console.error('[SessionEnd] Error:', err.message);
    process.exit(0);
  });
}

async function main() {
  const input = parseHookInput(stdinData);

  if (runCortinaSessionEnd(input, stdinData)) {
    process.exit(0);
  }

  // Parse stdin JSON to get transcript_path
  const transcriptPath = input?.transcript_path || process.env.CLAUDE_TRANSCRIPT_PATH || null;

  const sessionsDir = getSessionsDir();
  const today = getDateString();
  const shortId = getSessionIdShort();
  const sessionFile = path.join(sessionsDir, `${today}-${shortId}-session.tmp`);

  ensureDir(sessionsDir);

  const currentTime = getTimeString();

  // Try to extract summary from transcript
  let summary = null;

  if (transcriptPath) {
    if (fs.existsSync(transcriptPath)) {
      summary = extractSessionSummary(transcriptPath);
    } else {
      log(`[SessionEnd] Transcript not found: ${transcriptPath}`);
    }
  }

  if (fs.existsSync(sessionFile)) {
    // Update existing session file
    const updated = replaceInFile(
      sessionFile,
      /\*\*Last Updated:\*\*.*/,
      `**Last Updated:** ${currentTime}`
    );
    if (!updated) {
      log(`[SessionEnd] Failed to update timestamp in ${sessionFile}`);
    }

    // If we have a new summary, update the session file content
    if (summary) {
      const existing = readFile(sessionFile);
      if (existing) {
        // Use a flexible regex that matches both "## Session Summary" and "## Current State"
        // Match to end-of-string to avoid duplicate ### Stats sections
        const updatedContent = existing.replace(
          /## (?:Session Summary|Current State)[\s\S]*?$/ ,
          buildSummarySection(summary).trim() + '\n'
        );
        writeFile(sessionFile, updatedContent);
      }
    }

    log(`[SessionEnd] Updated session file: ${sessionFile}`);
  } else {
    // Create new session file
    const summarySection = summary
      ? buildSummarySection(summary)
      : `## Current State\n\n[Session context goes here]\n\n### Completed\n- [ ]\n\n### In Progress\n- [ ]\n\n### Notes for Next Session\n-\n\n### Context to Load\n\`\`\`\n[relevant files]\n\`\`\``;

    const template = `# Session: ${today}
**Date:** ${today}
**Started:** ${currentTime}
**Last Updated:** ${currentTime}

---

${summarySection}
`;

    writeFile(sessionFile, template);
    log(`[SessionEnd] Created session file: ${sessionFile}`);
  }

  process.exit(0);
}

function parseHookInput(rawInput) {
  try {
    return JSON.parse(rawInput);
  } catch {
    return null;
  }
}

function runCortinaSessionEnd(parsedInput, rawInput) {
  if (!parsedInput || typeof parsedInput.cwd !== 'string' || !parsedInput.cwd.trim()) {
    return false;
  }

  const result = spawnSync(
    'cortina',
    ['adapter', 'claude-code', 'session-end'],
    {
      input: rawInput,
      encoding: 'utf8',
      stdio: ['pipe', 'inherit', 'inherit']
    }
  );

  if (!result.error && result.status === 0) {
    return true;
  }

  if (result.error && result.error.code !== 'ENOENT') {
    log(`[SessionEnd] Cortina handoff failed: ${result.error.message}`);
  } else if (typeof result.status === 'number' && result.status !== 0) {
    log(`[SessionEnd] Cortina handoff exited ${result.status}; falling back to legacy summary writer`);
  }

  return false;
}

function buildSummarySection(summary) {
  let section = '## Session Summary\n\n';

  // Tasks (from user messages — collapse newlines and escape backticks to prevent markdown breaks)
  section += '### Tasks\n';
  for (const msg of summary.userMessages) {
    section += `- ${msg.replace(/\n/g, ' ').replace(/`/g, '\\`')}\n`;
  }
  section += '\n';

  // Files modified
  if (summary.filesModified.length > 0) {
    section += '### Files Modified\n';
    for (const f of summary.filesModified) {
      section += `- ${f}\n`;
    }
    section += '\n';
  }

  // Tools used
  if (summary.toolsUsed.length > 0) {
    section += `### Tools Used\n${summary.toolsUsed.join(', ')}\n\n`;
  }

  section += `### Stats\n- Total user messages: ${summary.totalMessages}\n`;

  return section;
}
