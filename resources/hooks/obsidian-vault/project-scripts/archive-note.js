#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVaultConfigured,
  ensureDir,
  fail,
  getFrontmatterValue,
  readNote,
  resolveNote,
  updateFrontmatterDate,
  writeNote
} = require('./utils');

let note = '';
let restore = false;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--restore' || arg === '-r') {
    restore = true;
  } else if (!note) {
    note = arg;
  }
}

const vaultPath = checkVaultConfigured();
const archiveDir = path.join(vaultPath, '_archive');
ensureDir(archiveDir);

if (!note) {
  fail('Note path or title required\nUsage: archive-note.js <note> [--restore]');
}

if (restore) {
  const file = resolveNote(archiveDir, note);
  if (!file || !fs.existsSync(file)) {
    console.error(`ERROR: Note not found in archive: ${note}`);
    console.error('');
    console.error('Archived notes:');
    for (const entry of fs.readdirSync(archiveDir).filter(name => name.endsWith('.md')).sort()) {
      const fullPath = path.join(archiveDir, entry);
      const title = getFrontmatterValue(fullPath, 'title') || entry;
      console.error(`  - ${title} (${entry})`);
    }
    process.exit(1);
  }

  const originalCategory = String(getFrontmatterValue(file, 'archived_from') || 'references');
  const targetDir = path.join(vaultPath, originalCategory);
  ensureDir(targetDir);
  const target = path.join(targetDir, path.basename(file));
  fs.renameSync(file, target);
  const { data, body } = readNote(target);
  delete data.archived_from;
  writeNote(target, data, body);
  updateFrontmatterDate(target);
  console.log(`Restored: ${path.basename(target)}`);
  console.log(`Location: ${originalCategory}/${path.basename(target)}`);
  process.exit(0);
}

const file = resolveNote(vaultPath, note);
if (!file || !fs.existsSync(file)) {
  fail(`Note not found: ${note}`);
}
if (file.includes(`${path.sep}_archive${path.sep}`)) {
  fail('Note is already archived');
}

const relPath = path.relative(vaultPath, file).split(path.sep).join('/');
const originalCategory = path.dirname(relPath);
const filename = path.basename(file);
const target = path.join(archiveDir, filename);
const { data, body } = readNote(file);
data.archived_from = originalCategory;
writeNote(file, data, body);
fs.renameSync(file, target);
updateFrontmatterDate(target);

console.log(`Archived: ${relPath}`);
console.log(`Location: _archive/${filename}`);
console.log('');
console.log(`To restore: /obsidian:archive --restore "${note}"`);
