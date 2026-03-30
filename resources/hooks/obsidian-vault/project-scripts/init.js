#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CONFIG_FILE, ensureDir, getDate, getVaultPath } = require('./utils');

const DEFAULT_VAULT_PATH = path.join(os.homedir(), 'guerra_vault');
const FOLDERS = [
  'projects',
  'technologies',
  'claude-code/agents',
  'claude-code/hooks',
  'claude-code/skills',
  'claude-code/tools',
  'ideas',
  'personal',
  'todo',
  'references',
  'journal/commits',
  'journal/tasks',
  'journal/creations',
  '_archive'
];

let vaultPath = '';
let checkOnly = false;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--vault') {
    vaultPath = process.argv[i + 1] || '';
    i += 1;
  } else if (arg === '--check') {
    checkOnly = true;
  } else if (!vaultPath) {
    vaultPath = arg;
  }
}

vaultPath = (vaultPath || DEFAULT_VAULT_PATH).replace(/^~(?=$|\/|\\)/, os.homedir());

console.log('Obsidian Vault Initialization');
console.log('==============================');
console.log('');
console.log(`Vault path: ${vaultPath}`);
console.log('');

if (checkOnly) {
  console.log('CHECK MODE - No changes will be made');
  console.log('');
  if (fs.existsSync(CONFIG_FILE)) {
    console.log(`[OK] Config file exists: ${CONFIG_FILE}`);
    console.log(`     Current vault: ${getVaultPath()}`);
  } else {
    console.log(`[MISSING] Config file: ${CONFIG_FILE}`);
  }
  console.log('');
  if (fs.existsSync(vaultPath) && fs.statSync(vaultPath).isDirectory()) {
    console.log('[OK] Vault directory exists');
  } else {
    console.log(`[MISSING] Vault directory: ${vaultPath}`);
  }
  console.log('');
  console.log('Folder Status:');
  for (const folder of FOLDERS) {
    const folderPath = path.join(vaultPath, folder);
    console.log(`  ${fs.existsSync(folderPath) ? '[OK]' : '[MISSING]'} ${folder}`);
  }
  process.exit(0);
}

console.log('Creating configuration...');
ensureDir(path.dirname(CONFIG_FILE));
fs.writeFileSync(CONFIG_FILE, JSON.stringify({
  vaultPath,
  autoCapture: {
    commits: true,
    tasks: true,
    sessionSummaries: true,
    claudeCodeComponents: true
  },
  defaultTags: ['claude-generated'],
  categories: {
    projects: 'Project-specific documentation',
    technologies: 'Technology knowledge and tutorials',
    'claude-code': 'Claude Code components (agents, hooks, skills, tools)',
    ideas: 'Feature ideas and experiments',
    personal: 'Career and learning goals',
    todo: 'Tasks and checklists',
    references: 'Bookmarks, snippets, and cheatsheets'
  }
}, null, 2) + '\n', 'utf8');
console.log(`  Created: ${CONFIG_FILE}`);

if (!fs.existsSync(vaultPath)) {
  fs.mkdirSync(vaultPath, { recursive: true });
  console.log(`  Created vault directory: ${vaultPath}`);
} else {
  console.log(`  Vault directory exists: ${vaultPath}`);
}

console.log('');
console.log('Creating folder structure...');
for (const folder of FOLDERS) {
  const folderPath = path.join(vaultPath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`  Created: ${folder}`);
  } else {
    console.log(`  Exists:  ${folder}`);
  }
  const gitkeepPath = path.join(folderPath, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '', 'utf8');
  }
}

const readmePath = path.join(vaultPath, 'README.md');
if (!fs.existsSync(readmePath)) {
  const today = getDate();
  fs.writeFileSync(readmePath, `---
title: "Development Knowledge Base"
description: "Personal Obsidian vault for developer documentation, project notes, and work journal"
tags: ["index", "vault", "documentation"]
related: []
created: ${today}
updated: ${today}
---

# Development Knowledge Base

Welcome to your development knowledge base powered by the Obsidian Vault plugin for Claude Code.

## Structure

- **[[projects/]]** - Project-specific documentation
- **[[technologies/]]** - Technology knowledge (Laravel, React, etc.)
- **[[claude-code/]]** - Claude Code components (agents, hooks, skills, tools)
- **[[ideas/]]** - Feature ideas and experiments
- **[[personal/]]** - Career and learning goals
- **[[todo/]]** - Tasks and checklists
- **[[references/]]** - Bookmarks, snippets, and cheatsheets
- **[[journal/]]** - Automatic work journal
  - \`commits/\` - Git commit documentation
  - \`tasks/\` - Completed task summaries
  - \`creations/\` - New components created

## Auto-Captured Content

This vault automatically captures:
- Git commits with context and reasoning
- Task completions with summaries
- Claude Code component creation (agents, hooks, skills, tools)
- Session summaries

## Commands

Use these Claude Code commands to manage your vault:

| Command | Description |
|---------|-------------|
| \`/obsidian:init\` | Initialize or check vault setup |
| \`/obsidian:add\` | Add a new note |
| \`/obsidian:search\` | Search notes |
| \`/obsidian:update\` | Edit a note |
| \`/obsidian:import\` | Import external files |
| \`/obsidian:list\` | List notes by category |
| \`/obsidian:tags\` | View all tags |
| \`/obsidian:link\` | Link related notes |
| \`/obsidian:archive\` | Archive a note |
`, 'utf8');
  console.log('');
  console.log('  Created: README.md');
}

console.log('');
console.log('Initialization complete!');
