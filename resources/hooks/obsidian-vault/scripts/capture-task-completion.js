#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVault,
  createFrontmatter,
  debugLog,
  ensureDir,
  getDate,
  getDatetime,
  getGitBranch,
  getProjectName,
  isCaptureEnabled,
  readPayloadSync,
  slugify
} = require('./hook-utils');

const payload = readPayloadSync();
debugLog('capture-task-completion.js triggered');

if (!isCaptureEnabled('tasks')) process.exit(0);
const vaultPath = checkVault();
if (!vaultPath) process.exit(0);

const taskSummary = process.env.CLAUDE_SUBAGENT_SUMMARY || payload.last_assistant_message || '';
const taskType = process.env.CLAUDE_SUBAGENT_TYPE || payload.agent_type || '';
if (!taskSummary || taskSummary.length < 20) process.exit(0);

const project = getProjectName();
const branch = getGitBranch();
const title = taskSummary.split('\n')[0]?.slice(0, 80).trim() || `${taskType || 'Task'} Completion`;
const date = getDate();
const filePath = path.join(vaultPath, 'journal', 'tasks', `${date}-${slugify(title)}.md`);
ensureDir(path.dirname(filePath));
if (fs.existsSync(filePath)) process.exit(0);

const projectNote = path.join(vaultPath, 'projects', project, 'README.md');
const related = fs.existsSync(projectNote) ? `[[projects/${project}/README]]` : '';
const tags = [ 'task', 'completed', project, taskType ].filter(Boolean).join(', ');

const lines = [
  createFrontmatter(title, `Task completed in ${project}`, tags, related),
  '',
  `# ${title}`,
  '',
  `**Completed:** ${getDatetime()}`,
  `**Project:** ${project}`,
  ...(branch ? [`**Branch:** ${branch}`] : []),
  ...(taskType ? [`**Agent Type:** ${taskType}`] : []),
  '',
  '## Summary',
  '',
  taskSummary,
  '',
  '## What Was Done',
  '',
  '<!-- Detailed breakdown of completed work -->',
  '',
  '## Decisions Made',
  '',
  '<!-- Key decisions and their rationale -->',
  ''
];

fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
console.log(`OBSIDIAN_TASK_NOTE_CREATED: ${filePath}`);
