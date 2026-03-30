#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const stateFile = path.join('.claude', 'ralph-loop.local.md');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { fields: {}, prompt: '' };
  }

  const fields = {};
  for (const line of match[1].split('\n')) {
    const fieldMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!fieldMatch) continue;
    let value = fieldMatch[2].trim();
    value = value.replace(/^"(.*)"$/, '$1');
    fields[fieldMatch[1]] = value;
  }

  return { fields, prompt: match[2] || '' };
}

function getLastAssistantMessage(payload) {
  if (typeof payload.last_assistant_message === 'string' && payload.last_assistant_message.trim()) {
    return payload.last_assistant_message;
  }

  const transcriptPath = payload.transcript_path || '';
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return null;
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
        const text = content
          .filter(block => block?.type === 'text' && typeof block.text === 'string')
          .map(block => block.text)
          .join('\n')
          .trim();
        if (text) return text;
      }
    } catch {
      // Ignore malformed lines
    }
  }

  return null;
}

function main() {
  if (!fs.existsSync(stateFile)) {
    process.exit(0);
  }

  let payload = {};
  try {
    payload = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {}

  const { fields, prompt } = parseFrontmatter(fs.readFileSync(stateFile, 'utf8'));
  const iteration = fields.iteration || '';
  const maxIterations = fields.max_iterations || '';
  const completionPromise = fields.completion_promise || '';

  if (!/^\d+$/.test(iteration) || !/^\d+$/.test(maxIterations)) {
    console.error('⚠️  Ralph loop: State file corrupted');
    fs.rmSync(stateFile, { force: true });
    process.exit(0);
  }

  if (Number(maxIterations) > 0 && Number(iteration) >= Number(maxIterations)) {
    console.error(`🛑 Ralph loop: Max iterations (${maxIterations}) reached.`);
    fs.rmSync(stateFile, { force: true });
    process.exit(0);
  }

  const lastOutput = getLastAssistantMessage(payload);
  if (!lastOutput) {
    console.error('⚠️  Ralph loop: No assistant text found, stopping loop');
    fs.rmSync(stateFile, { force: true });
    process.exit(0);
  }

  if (completionPromise) {
    const promiseMatch = lastOutput.match(/<promise>([\s\S]*?)<\/promise>/);
    const promiseText = promiseMatch ? promiseMatch[1].trim().replace(/\s+/g, ' ') : '';
    if (promiseText && promiseText === completionPromise) {
      console.error(`✅ Ralph loop: Detected <promise>${completionPromise}</promise>`);
      fs.rmSync(stateFile, { force: true });
      process.exit(0);
    }
  }

  if (!prompt.trim()) {
    console.error('⚠️  Ralph loop: State file corrupted or incomplete');
    fs.rmSync(stateFile, { force: true });
    process.exit(0);
  }

  const nextIteration = Number(iteration) + 1;
  const updated = fs
    .readFileSync(stateFile, 'utf8')
    .replace(/^iteration:\s*.*$/m, `iteration: ${nextIteration}`);
  fs.writeFileSync(stateFile, updated, 'utf8');

  const systemMessage = completionPromise
    ? `🔄 Ralph iteration ${nextIteration} | To stop: output <promise>${completionPromise}</promise> (only when true)`
    : `🔄 Ralph iteration ${nextIteration} | No completion promise set - loop runs infinitely`;

  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: prompt.trim(),
      systemMessage
    })
  );
}

main();
