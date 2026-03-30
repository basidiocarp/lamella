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
  isCaptureEnabled
} = require('./hook-utils');

debugLog('capture-session-summary.js triggered');
if (!isCaptureEnabled('sessionSummaries')) process.exit(0);
const vaultPath = checkVault();
if (!vaultPath) process.exit(0);

const summary = process.env.CLAUDE_STOP_SUMMARY || '';
if (!summary || summary.length < 50) process.exit(0);

const project = getProjectName();
const branch = getGitBranch();
const date = getDate();
const timestamp = new Date().toTimeString().slice(0, 5).replace(':', '');
const firstLine = summary.split('\n')[0]?.slice(0, 60).trim() || 'Session Summary';
const slug = firstLine
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 50);

const tasksDir = path.join(vaultPath, 'journal', 'tasks');
ensureDir(tasksDir);
const filePath = path.join(tasksDir, `${date}-${timestamp}-${slug}.md`);

let related = '';
const projectNote = path.join(vaultPath, 'projects', project, 'README.md');
if (fs.existsSync(projectNote)) {
  related = `[[projects/${project}/README]]`;
}

const commitsDir = path.join(vaultPath, 'journal', 'commits');
if (fs.existsSync(commitsDir)) {
  const commitLinks = fs.readdirSync(commitsDir)
    .filter(entry => entry.startsWith(date) && entry.endsWith('.md'))
    .slice(0, 5)
    .map(entry => `[[journal/commits/${entry.replace(/\.md$/, '')}]]`);
  if (commitLinks.length > 0) {
    related = [related, ...commitLinks].filter(Boolean).join(', ');
  }
}

const lines = [
  createFrontmatter(firstLine, `Claude Code session in ${project}`, `session, summary, ${project}`, related),
  '',
  `# ${firstLine}`,
  '',
  `**Date:** ${getDatetime()}`,
  `**Project:** ${project}`,
  ...(branch ? [`**Branch:** ${branch}`] : []),
  '',
  '## Session Summary',
  '',
  summary,
  '',
  '## Key Outcomes',
  '',
  '<!-- Main accomplishments from this session -->',
  '',
  '## Next Steps',
  '',
  '<!-- What should be done in future sessions -->',
  ''
];

fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
console.log(`OBSIDIAN_SESSION_NOTE_CREATED: ${filePath}`);
