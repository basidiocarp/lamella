#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVault,
  commitNoteExists,
  createFrontmatter,
  debugLog,
  ensureDir,
  getDate,
  getGitBranch,
  getProjectName,
  getToolInput,
  isCaptureEnabled,
  readPayloadSync,
  runGit,
  slugify
} = require('./hook-utils');

const payload = readPayloadSync();
debugLog('capture-commit.js triggered');

if (!isCaptureEnabled('commits')) process.exit(0);
const vaultPath = checkVault();
if (!vaultPath) process.exit(0);

const toolInput = getToolInput(payload);
if (!/\bgit commit\b/.test(toolInput)) process.exit(0);

const commitHash = runGit(['log', '-1', '--format=%H']);
const commitShort = runGit(['log', '-1', '--format=%h']);
const commitMsg = runGit(['log', '-1', '--format=%s']);
const commitBody = runGit(['log', '-1', '--format=%b']);
const commitDate = runGit(['log', '-1', '--format=%ci']).split(' ').slice(0, 2).join(' ');

if (!commitHash || !commitShort || !commitMsg) process.exit(0);
if (commitNoteExists(vaultPath, commitShort)) process.exit(0);

const project = getProjectName();
const branch = getGitBranch();
const filesChanged = runGit(['diff-tree', '--no-commit-id', '--name-status', '-r', commitHash])
  .split('\n')
  .filter(Boolean)
  .slice(0, 20)
  .join('\n');

const date = getDate();
const filename = `${date}-${slugify(commitMsg)}.md`;
const commitsDir = path.join(vaultPath, 'journal', 'commits');
const filePath = path.join(commitsDir, filename);
ensureDir(commitsDir);

const projectNote = path.join(vaultPath, 'projects', project, 'README.md');
const related = fs.existsSync(projectNote) ? `[[projects/${project}/README]]` : '';

const lines = [
  createFrontmatter(commitMsg, `Git commit in ${project} on branch ${branch}`, `commit, ${project}, ${branch}`, related),
  '',
  `# ${commitMsg}`,
  '',
  `**Date:** ${commitDate}`,
  `**Project:** ${project}`,
  `**Branch:** ${branch}`,
  `**Commit:** ${commitShort}`,
  '',
  ...(commitBody ? ['## Description', '', commitBody, ''] : []),
  '## What',
  '',
  '<!-- Describe what was changed -->',
  '',
  '## Why',
  '',
  '<!-- Explain the reasoning behind this change -->',
  '',
  '## Files Changed',
  '',
  '```',
  filesChanged,
  '```',
  ''
];

fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
console.log(`OBSIDIAN_COMMIT_NOTE_CREATED: ${filePath}`);
