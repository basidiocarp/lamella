#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVaultConfigured,
  createFrontmatter,
  ensureDir,
  fail,
  firstHeading,
  getDate,
  parseFrontmatter,
  updateFrontmatterDate
} = require('./utils');

let source = '';
let targetCategory = '';
let addFrontmatter = true;
let recursive = false;

for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg === '--to' || arg === '-t') {
    targetCategory = process.argv[++i] || '';
  } else if (arg === '--no-frontmatter') {
    addFrontmatter = false;
  } else if (arg === '--recursive' || arg === '-r') {
    recursive = true;
  } else if (!source) {
    source = arg;
  }
}

const vaultPath = checkVaultConfigured();

if (!source) {
  fail('Source file or folder required\nUsage: import-files.js <source> --to <category> [--recursive] [--no-frontmatter]');
}

source = path.resolve(process.cwd(), source);
if (!fs.existsSync(source)) {
  fail(`Source not found: ${source}`);
}

if (!targetCategory) {
  if (fs.statSync(source).isFile()) {
    const base = path.basename(source);
    if (/^readme\.md$/i.test(base)) targetCategory = 'projects';
    else targetCategory = 'references';
  } else {
    targetCategory = 'references';
  }
  console.log(`Auto-detected category: ${targetCategory}`);
}

const targetDir = path.join(vaultPath, targetCategory);
ensureDir(targetDir);

function importMarkdown(sourceFile, outputDir) {
  const filename = path.basename(sourceFile);
  const targetFile = path.join(outputDir, filename);
  const content = fs.readFileSync(sourceFile, 'utf8');
  const parsed = parseFrontmatter(content);
  if (parsed.data && Object.keys(parsed.data).length > 0) {
    fs.copyFileSync(sourceFile, targetFile);
    updateFrontmatterDate(targetFile);
    console.log(`Imported (existing frontmatter): ${path.basename(targetFile)}`);
    return;
  }

  const title = firstHeading(content)
    || path.basename(sourceFile, '.md').replace(/[-_]+/g, ' ');
  const sourceDir = path.basename(path.dirname(sourceFile));
  const tags = sourceDir && sourceDir !== '.' ? `imported, ${sourceDir}` : 'imported';
  fs.writeFileSync(targetFile, `${createFrontmatter(title, title, tags, '', getDate())}\n\n${content}`, 'utf8');
  console.log(`Imported (added frontmatter): ${path.basename(targetFile)}`);
}

function importFile(sourceFile, outputDir) {
  const filename = path.basename(sourceFile);
  const targetFile = path.join(outputDir, filename);
  if (!filename.endsWith('.md')) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Copied (non-markdown): ${filename}`);
    return;
  }
  if (addFrontmatter) {
    importMarkdown(sourceFile, outputDir);
  } else {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`Copied: ${filename}`);
  }
}

console.log(`Importing to: ${targetCategory}`);
console.log('');

if (fs.statSync(source).isFile()) {
  importFile(source, targetDir);
} else if (recursive) {
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relPath = path.relative(source, fullPath);
        const outputDir = path.join(targetDir, path.dirname(relPath));
        ensureDir(outputDir);
        importFile(fullPath, outputDir);
      }
    }
  };
  walk(source);
} else {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      importFile(path.join(source, entry.name), targetDir);
    }
  }
}

console.log('');
console.log('Import complete!');
console.log(`Files are in: ${targetDir}`);
