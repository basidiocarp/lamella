#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const stateDir = '.claude';

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const fields = {};

  if (match) {
    for (const line of match[1].split('\n')) {
      const fieldMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (!fieldMatch) continue;
      fields[fieldMatch[1]] = fieldMatch[2].trim().replace(/^"(.*)"$/, '$1');
    }
  }

  return fields;
}

function extractSessionId(filePath) {
  const base = path.basename(filePath);
  const match = base.match(/^skill-improver\.(.*)\.local\.md$/);
  return match ? match[1] : '';
}

function getLastAssistantMessage(payload) {
  if (typeof payload.last_assistant_message === 'string') {
    return payload.last_assistant_message;
  }

  const transcriptPath = payload.transcript_path || '';
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return '';
  }

  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    try {
      const entry = JSON.parse(lines[index]);
      const role = entry.role || entry.message?.role;
      if (role !== 'assistant') continue;
      const content = entry.message?.content ?? entry.content;
      if (typeof content === 'string' && content.trim()) {
        return content;
      }
      if (Array.isArray(content)) {
        return content
          .filter(block => block?.type === 'text' && typeof block.text === 'string')
          .map(block => block.text)
          .join('\n');
      }
    } catch {
      // Ignore malformed transcript lines
    }
  }

  return '';
}

function findMatchingSession(transcriptPath, sessions) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return '';
  }
  const transcript = fs.readFileSync(transcriptPath, 'utf8');
  for (const sessionFile of sessions) {
    const sessionId = extractSessionId(sessionFile);
    if (sessionId && transcript.includes(`Session ID: ${sessionId}`)) {
      return sessionFile;
    }
  }
  return '';
}

function removeState(filePath) {
  fs.rmSync(filePath, { force: true });
}

function main() {
  const payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  const activeSessions = fs.existsSync(stateDir)
    ? fs.readdirSync(stateDir)
        .filter(name => /^skill-improver\..*\.local\.md$/.test(name))
        .map(name => path.join(stateDir, name))
    : [];

  if (activeSessions.length === 0) {
    process.exit(0);
  }

  const transcriptPath = payload.transcript_path || '';
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    console.error('Warning: Transcript not found');
    process.exit(0);
  }

  const stateFile = findMatchingSession(transcriptPath, activeSessions);
  if (!stateFile) {
    process.exit(0);
  }

  const fields = parseFrontmatter(stateFile);
  const sessionId = fields.session_id || '';
  const iteration = fields.iteration || '';
  const maxIterations = fields.max_iterations || '';
  const skillPath = fields.skill_path || '';
  const skillName = fields.skill_name || '';

  if (!/^\d+$/.test(iteration) || !/^\d+$/.test(maxIterations)) {
    console.error('Warning: State file corrupted');
    removeState(stateFile);
    process.exit(0);
  }

  if (payload.stop_hook_active === true) {
    console.error(`Note: stop_hook_active=true, iteration=${iteration}`);
  }

  if (Number(iteration) >= Number(maxIterations)) {
    console.error(`Skill improver: Max iterations (${maxIterations}) reached.`);
    console.error(`   Session: ${sessionId}`);
    console.error(`   Skill: ${skillName}`);
    console.error(`   Total iterations: ${iteration}`);
    removeState(stateFile);
    process.exit(0);
  }

  const lastOutput = getLastAssistantMessage(payload);
  if (/^<skill-improvement-complete>$/m.test(lastOutput)) {
    console.error('Skill improver: Improvement complete!');
    console.error(`   Session: ${sessionId}`);
    console.error(`   Skill: ${skillName}`);
    console.error(`   Total iterations: ${iteration}`);
    removeState(stateFile);
    process.exit(0);
  }

  if (/subagent.*(not found|unavailable)|skill-reviewer.*(not found|unavailable)|plugin-dev.*(not installed|not found|missing)/i.test(lastOutput)) {
    console.error('Skill improver: skill-reviewer agent not available.');
    console.error(`   Session: ${sessionId}`);
    console.error('   Install the plugin-dev plugin and retry.');
    removeState(stateFile);
    process.exit(0);
  }

  const nextIteration = Number(iteration) + 1;
  const updated = fs
    .readFileSync(stateFile, 'utf8')
    .replace(/^iteration:\s*.*$/m, `iteration: ${nextIteration}`);
  fs.writeFileSync(stateFile, updated, 'utf8');

  const prompt = `Continue improving the skill at: ${skillPath}

Iteration ${nextIteration} / ${maxIterations} (Session: ${sessionId})

Follow the skill-improver methodology. Fix critical/major issues, evaluate minor issues. Output <skill-improvement-complete> on its own line when done.

The skill-reviewer agent is available via the Task tool with subagent_type='plugin-dev:skill-reviewer'`;

  const systemMessage = `Skill Improver iteration ${nextIteration}/${maxIterations} | Session: ${sessionId} | Target: ${skillName}`;

  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: prompt,
      systemMessage
    })
  );
}

main();
