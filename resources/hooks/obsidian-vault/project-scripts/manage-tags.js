#!/usr/bin/env node
const {
  checkVaultConfigured,
  fail,
  getFrontmatterValue,
  relativeVaultPath,
  walkMarkdownFiles
} = require('./utils');

let action = 'list';
let tag = '';
let limit = 50;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--stats' || arg === '-s') {
    action = 'stats';
  } else if (arg === '--find' || arg === '-f') {
    action = 'find';
    tag = process.argv[++i] || '';
  } else if (arg === '--limit' || arg === '-n') {
    limit = Number(process.argv[++i] || 50);
  } else if (!tag) {
    tag = arg;
  }
}

const vaultPath = checkVaultConfigured();
const files = walkMarkdownFiles(vaultPath);
const tagCounts = new Map();
for (const file of files) {
  for (const value of getFrontmatterValue(file, 'tags') || []) {
    tagCounts.set(value, (tagCounts.get(value) || 0) + 1);
  }
}

if (action === 'list') {
  console.log('All Tags in Vault');
  console.log('=================');
  console.log('');
  for (const value of Array.from(tagCounts.keys()).sort().slice(0, limit)) {
    console.log(`  ${value}`);
  }
  console.log('');
  console.log(`Total unique tags: ${tagCounts.size}`);
  process.exit(0);
}

if (action === 'stats') {
  console.log('Tag Usage Statistics');
  console.log('====================');
  console.log('');
  console.log(`${'TAG'.padEnd(30)} COUNT`);
  console.log(`${'---'.padEnd(30)} -----`);
  for (const [value, count] of Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit)) {
    console.log(`${value.padEnd(30)} ${count}`);
  }
  console.log('');
  process.exit(0);
}

if (!tag) {
  fail('Tag required for --find\nUsage: manage-tags.js --find <tag>');
}

console.log(`Notes tagged with: ${tag}`);
console.log('========================');
console.log('');
for (const file of files) {
  const tags = getFrontmatterValue(file, 'tags') || [];
  if (!tags.includes(tag)) continue;
  const title = getFrontmatterValue(file, 'title') || require('path').basename(file, '.md');
  console.log(`[${title}]`);
  console.log(`  Path: ${relativeVaultPath(vaultPath, file)}`);
  console.log('');
}
