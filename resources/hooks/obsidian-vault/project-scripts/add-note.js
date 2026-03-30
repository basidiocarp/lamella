#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVaultConfigured,
  createFrontmatter,
  ensureDir,
  fail,
  getDate,
  slugify
} = require('./utils');

const VALID_CATEGORIES = new Set([
  'projects',
  'technologies',
  'claude-code',
  'ideas',
  'personal',
  'todo',
  'references',
  'claude-code/agents',
  'claude-code/hooks',
  'claude-code/skills',
  'claude-code/tools'
]);

let category = '';
let title = '';
let description = '';
let tags = '';
let related = '';
let content = '';

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--category' || arg === '-c') {
    category = process.argv[++i] || '';
  } else if (arg === '--title' || arg === '-t') {
    title = process.argv[++i] || '';
  } else if (arg === '--description' || arg === '-d') {
    description = process.argv[++i] || '';
  } else if (arg === '--tags') {
    tags = process.argv[++i] || '';
  } else if (arg === '--related' || arg === '-r') {
    related = process.argv[++i] || '';
  } else if (arg === '--content') {
    content = process.argv[++i] || '';
  } else if (!category) {
    category = arg;
  } else if (!title) {
    title = arg;
  } else {
    title = `${title} ${arg}`;
  }
}

const vaultPath = checkVaultConfigured();

if (!category) {
  console.error('ERROR: Category required');
  console.error('');
  console.error('Available categories:');
  for (const item of ['projects', 'technologies', 'claude-code', 'ideas', 'personal', 'todo', 'references']) {
    console.error(`  - ${item}`);
  }
  console.error('');
  console.error('Usage: add-note.js <category> <title> [--description "..."] [--tags "tag1,tag2"]');
  process.exit(1);
}

if (!title) {
  fail('Title required\nUsage: add-note.js <category> <title> [--description "..."] [--tags "tag1,tag2"]');
}

if (!VALID_CATEGORIES.has(category)) {
  fail(`Invalid category: ${category}\n\nValid categories: projects technologies claude-code ideas personal todo references\nValid subcategories: claude-code/agents, claude-code/hooks, claude-code/skills, claude-code/tools`);
}

const filename = `${slugify(title)}.md`;
const filePath = path.join(vaultPath, category, filename);

if (fs.existsSync(filePath)) {
  fail(`Note already exists: ${filePath}\nUse /obsidian:update to modify existing notes`);
}

description = description || title;
tags = tags ? `${tags}, ${category}` : category;

ensureDir(path.dirname(filePath));
fs.writeFileSync(filePath, `${createFrontmatter(title, description, tags, related, getDate())}\n\n# ${title}\n\n${content || '<!-- Add your content here -->'}\n`, 'utf8');

console.log(`Created: ${filePath}`);
console.log('');
console.log('Frontmatter:');
console.log(fs.readFileSync(filePath, 'utf8').split('\n').slice(0, 10).join('\n'));
