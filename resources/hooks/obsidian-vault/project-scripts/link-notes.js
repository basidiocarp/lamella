#!/usr/bin/env node
const {
  addRelatedLink,
  checkVaultConfigured,
  fail,
  relativeVaultPath,
  resolveNote
} = require('./utils');

let note1 = '';
let note2 = '';
let bidirectional = true;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--one-way') {
    bidirectional = false;
  } else if (!note1) {
    note1 = arg;
  } else if (!note2) {
    note2 = arg;
  }
}

const vaultPath = checkVaultConfigured();

if (!note1 || !note2) {
  fail('Two notes required\nUsage: link-notes.js <note1> <note2> [--one-way]');
}

const file1 = resolveNote(vaultPath, note1);
const file2 = resolveNote(vaultPath, note2);
if (!file1) fail(`Note not found: ${note1}`);
if (!file2) fail(`Note not found: ${note2}`);

const rel1 = relativeVaultPath(vaultPath, file1);
const rel2 = relativeVaultPath(vaultPath, file2);
const link1 = rel1.replace(/\.md$/, '');
const link2 = rel2.replace(/\.md$/, '');

console.log('Linking notes:');
console.log(`  1: ${rel1}`);
console.log(`  2: ${rel2}`);
console.log('');

addRelatedLink(file1, link2);
console.log(`Added [[${link2}]] to ${rel1}`);
if (bidirectional) {
  addRelatedLink(file2, link1);
  console.log(`Added [[${link1}]] to ${rel2}`);
}
console.log('');
console.log('Links created successfully!');
