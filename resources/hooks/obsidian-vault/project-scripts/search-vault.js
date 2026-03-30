#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVaultConfigured,
  fail,
  getFrontmatterValue,
  relativeVaultPath,
  walkMarkdownFiles
} = require('./utils');

let query = '';
let searchType = 'all';
let category = '';
let limit = 20;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--title' || arg === '-t') {
    searchType = 'title';
  } else if (arg === '--content' || arg === '-c') {
    searchType = 'content';
  } else if (arg === '--tag') {
    searchType = 'tag';
  } else if (arg === '--category') {
    category = process.argv[++i] || '';
  } else if (arg === '--limit' || arg === '-n') {
    limit = Number(process.argv[++i] || 20);
  } else {
    query = query ? `${query} ${arg}` : arg;
  }
}

const vaultPath = checkVaultConfigured();
if (!query) {
  fail('Search query required\nUsage: search-vault.js <query> [--title|--content|--tag] [--category <cat>]');
}

const searchPath = category ? path.join(vaultPath, category) : vaultPath;
if (category && !fs.existsSync(searchPath)) {
  fail(`Category not found: ${category}`);
}

const lowerQuery = query.toLowerCase();
const files = walkMarkdownFiles(searchPath);

function render(file, extraLines = []) {
  const title = getFrontmatterValue(file, 'title') || path.basename(file, '.md');
  const description = getFrontmatterValue(file, 'description') || '';
  const tags = getFrontmatterValue(file, 'tags') || [];
  console.log(`[${title}]`);
  console.log(`  Path: ${relativeVaultPath(vaultPath, file)}`);
  if (description) console.log(`  Desc: ${description}`);
  if (tags.length) console.log(`  Tags: [${tags.map(tag => JSON.stringify(tag)).join(', ')}]`);
  for (const line of extraLines) console.log(line);
  console.log('');
}

console.log(`Searching for: ${query}`);
console.log(`Search type: ${searchType}`);
if (category) console.log(`Category: ${category}`);
console.log('');
console.log('Results:');
console.log('--------');

if (searchType === 'title') {
  let count = 0;
  for (const file of files) {
    if (count >= limit) break;
    const title = String(getFrontmatterValue(file, 'title') || '');
    if (!title.toLowerCase().includes(lowerQuery)) continue;
    render(file);
    count += 1;
  }
} else if (searchType === 'content') {
  let count = 0;
  for (const file of files) {
    if (count >= limit) break;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const matches = lines
      .map((line, index) => ({ line, index: index + 1 }))
      .filter(item => item.line.toLowerCase().includes(lowerQuery))
      .slice(0, 3);
    if (!matches.length) continue;
    render(file, ['  Matches:', ...matches.map(item => `    ${item.index}:${item.line}`)]);
    count += 1;
  }
} else if (searchType === 'tag') {
  let count = 0;
  for (const file of files) {
    if (count >= limit) break;
    const tags = (getFrontmatterValue(file, 'tags') || []).map(tag => String(tag).toLowerCase());
    if (!tags.includes(lowerQuery)) continue;
    render(file);
    count += 1;
  }
} else {
  const matched = new Map();
  for (const file of files) {
    const title = String(getFrontmatterValue(file, 'title') || '');
    const tags = (getFrontmatterValue(file, 'tags') || []).map(tag => String(tag));
    const content = fs.readFileSync(file, 'utf8');
    if (
      title.toLowerCase().includes(lowerQuery)
      || tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      || content.toLowerCase().includes(lowerQuery)
    ) {
      matched.set(file, true);
    }
    if (matched.size >= limit) break;
  }
  for (const file of Array.from(matched.keys())) {
    render(file);
  }
}

console.log('--------');
console.log('Tip: Use --title, --content, or --tag to narrow search');
