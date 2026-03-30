#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  addRelatedLink,
  checkVaultConfigured,
  fail,
  getDate,
  readNote,
  relativeVaultPath,
  resolveNote,
  stringifyTags,
  writeNote
} = require('./utils');

let notePath = '';
let newTitle = '';
let newDescription = '';
let addTags = '';
let addRelated = '';
let appendContent = '';
let showOnly = false;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--title' || arg === '-t') {
    newTitle = process.argv[++i] || '';
  } else if (arg === '--description' || arg === '-d') {
    newDescription = process.argv[++i] || '';
  } else if (arg === '--add-tags') {
    addTags = process.argv[++i] || '';
  } else if (arg === '--add-related' || arg === '-r') {
    addRelated = process.argv[++i] || '';
  } else if (arg === '--append') {
    appendContent = process.argv[++i] || '';
  } else if (arg === '--show') {
    showOnly = true;
  } else if (!notePath) {
    notePath = arg;
  }
}

const vaultPath = checkVaultConfigured();
if (!notePath) {
  fail('Note path or title required\nUsage: update-note.js <path-or-title> [--title "New Title"] [--description "New description"] [--add-tags "tag1,tag2"]');
}

const filePath = resolveNote(vaultPath, notePath);
if (!filePath) {
  console.error(`ERROR: Note not found: ${notePath}`);
  console.error('');
  console.error(`Try searching: /obsidian:search ${notePath}`);
  process.exit(1);
}

const relPath = relativeVaultPath(vaultPath, filePath);
console.log(`Found: ${relPath}`);
console.log('');

if (showOnly) {
  console.log('Current content:');
  console.log('----------------');
  process.stdout.write(fs.readFileSync(filePath, 'utf8'));
  process.exit(0);
}

const { data, body } = readNote(filePath);
let bodyText = body;
let changed = false;

if (newTitle) {
  data.title = newTitle;
  console.log(`Updated title: ${newTitle}`);
  changed = true;
}
if (newDescription) {
  data.description = newDescription;
  console.log(`Updated description: ${newDescription}`);
  changed = true;
}
if (addTags) {
  const current = Array.isArray(data.tags) ? data.tags : [];
  const incoming = addTags.split(',').map(tag => tag.trim()).filter(Boolean);
  const merged = [];
  const seen = new Set();
  for (const tag of [...current, ...incoming]) {
    if (seen.has(tag)) continue;
    seen.add(tag);
    merged.push(tag);
  }
  data.tags = merged;
  console.log(`Updated tags: ${stringifyTags(merged)}`);
  changed = true;
}
if (addRelated) {
  const related = new Set((data.related || []).map(item => String(item).replace(/^\[\[|\]\]$/g, '')));
  for (const rel of addRelated.split(',').map(item => item.trim()).filter(Boolean)) {
    related.add(rel);
    console.log(`Added related: [[${rel}]]`);
  }
  data.related = Array.from(related);
  changed = true;
}
if (appendContent) {
  bodyText = `${bodyText.replace(/\n?$/, '\n')}\n${appendContent}\n`;
  console.log('Appended content');
  changed = true;
}

if (!changed) {
  console.log('No changes specified. Use options to update:');
  console.log('  --title "New Title"');
  console.log('  --description "New description"');
  console.log('  --add-tags "tag1,tag2"');
  console.log('  --add-related "path/to/note"');
  console.log('  --append "Content to add"');
  console.log('  --show (view current content)');
  process.exit(0);
}

data.updated = getDate();
writeNote(filePath, data, bodyText);

console.log('');
console.log(`Updated: ${relPath}`);
console.log('');
console.log('Current frontmatter:');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
let markerCount = 0;
for (const line of lines) {
  console.log(line);
  if (line === '---') {
    markerCount += 1;
    if (markerCount === 2) break;
  }
}
