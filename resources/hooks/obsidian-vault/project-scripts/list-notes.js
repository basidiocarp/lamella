#!/usr/bin/env node
const path = require('path');
const {
  checkVaultConfigured,
  fail,
  getFrontmatterValue,
  listRootCategories,
  relativeVaultPath,
  walkMarkdownFiles
} = require('./utils');

let category = '';
let sortBy = 'updated';
let limit = 50;
let showStats = false;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--sort' || arg === '-s') {
    sortBy = process.argv[++i] || 'updated';
  } else if (arg === '--limit' || arg === '-n') {
    limit = Number(process.argv[++i] || 50);
  } else if (arg === '--stats') {
    showStats = true;
  } else if (!category) {
    category = arg;
  }
}

const vaultPath = checkVaultConfigured();
const searchPath = category ? path.join(vaultPath, category) : vaultPath;

if (category && !require('fs').existsSync(searchPath)) {
  console.error(`ERROR: Category not found: ${category}`);
  console.error('');
  console.error('Available categories:');
  for (const name of listRootCategories(vaultPath)) console.error(`  ${name}`);
  process.exit(1);
}

console.log(category ? `Notes in: ${category}` : 'All notes in vault');
console.log('');

const files = walkMarkdownFiles(searchPath).filter(file => {
  const rel = relativeVaultPath(vaultPath, file);
  return !rel.startsWith('_archive/');
});

if (showStats) {
  console.log('Statistics:');
  console.log(`  Total notes: ${files.length}`);
  if (!category) {
    console.log('  By category:');
    for (const name of listRootCategories(vaultPath)) {
      const categoryCount = walkMarkdownFiles(path.join(vaultPath, name)).length;
      if (categoryCount > 0) {
        console.log(`    ${name.padEnd(20)} ${categoryCount}`);
      }
    }
  }
  console.log('');
}

console.log(`Notes (sorted by ${sortBy}):`);
console.log('----------------------------');

const rows = files.map(file => {
  const title = getFrontmatterValue(file, 'title') || path.basename(file, '.md');
  const updated = getFrontmatterValue(file, 'updated') || '';
  const created = getFrontmatterValue(file, 'created') || '';
  const tags = getFrontmatterValue(file, 'tags') || [];
  let key = updated || '0000-00-00';
  if (sortBy === 'created') key = created || '0000-00-00';
  if (sortBy === 'title') key = title;
  return { file, title, updated, tags, key };
}).sort((a, b) => String(b.key).localeCompare(String(a.key)));

for (const row of rows.slice(0, limit)) {
  console.log(`[${row.title}]`);
  console.log(`  Path: ${relativeVaultPath(vaultPath, row.file)}`);
  if (row.updated) console.log(`  Updated: ${row.updated}`);
  if (row.tags.length) console.log(`  Tags: [${row.tags.map(tag => JSON.stringify(tag)).join(', ')}]`);
  console.log('');
}

console.log('----------------------------');
console.log(`Showing ${Math.min(rows.length, limit)} of ${rows.length} notes`);
if (rows.length > limit) console.log('Use --limit to show more');
