#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

const CONFIG_FILE = path.join(os.homedir(), '.claude', 'obsidian-vault.json');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function getVaultPath() {
  return readConfig()?.vaultPath || '';
}

function checkVaultConfigured() {
  const vaultPath = getVaultPath();
  if (!vaultPath) {
    fail('Vault not configured. Run /obsidian:init first.');
  }
  if (!fs.existsSync(vaultPath) || !fs.statSync(vaultPath).isDirectory()) {
    fail(`Vault path does not exist: ${vaultPath}`);
  }
  return vaultPath;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function getDate() {
  return new Date().toISOString().slice(0, 10);
}

function quoteYamlString(value) {
  return JSON.stringify(String(value));
}

function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);
}

function formatInlineList(items) {
  return `[${items.join(', ')}]`;
}

function formatTags(tags) {
  return formatInlineList(splitCsv(tags).map(tag => JSON.stringify(tag)));
}

function formatRelated(related) {
  return formatInlineList(splitCsv(related).map(link => `[[${link}]]`));
}

function createFrontmatter(title, description, tags, related, created = getDate()) {
  return [
    '---',
    `title: ${quoteYamlString(title)}`,
    `description: ${quoteYamlString(description)}`,
    `tags: ${formatTags(tags)}`,
    `related: ${formatRelated(related)}`,
    `created: ${created}`,
    `updated: ${getDate()}`,
    '---'
  ].join('\n');
}

function hasFrontmatter(content) {
  return content.startsWith('---\n');
}

function parseInlineList(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return [];
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => item.replace(/^"(.*)"$/, '$1'));
}

function parseFrontmatter(content) {
  if (!hasFrontmatter(content)) {
    return { data: {}, body: content };
  }
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) {
    return { data: {}, body: content };
  }
  const frontmatterBlock = content.slice(4, end);
  const body = content.slice(end + 5);
  const data = {};
  for (const line of frontmatterBlock.split('\n')) {
    const index = line.indexOf(':');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key === 'tags') {
      data[key] = parseInlineList(value);
    } else if (key === 'related') {
      data[key] = parseInlineList(value).map(item => item.replace(/^\[\[|\]\]$/g, ''));
    } else if (value.startsWith('"') && value.endsWith('"')) {
      data[key] = JSON.parse(value);
    } else {
      data[key] = value;
    }
  }
  return { data, body };
}

function serializeFrontmatter(data) {
  const lines = ['---'];
  if (data.title !== undefined) lines.push(`title: ${quoteYamlString(data.title)}`);
  if (data.description !== undefined) lines.push(`description: ${quoteYamlString(data.description)}`);
  if (data.tags !== undefined) {
    lines.push(`tags: ${formatInlineList((data.tags || []).map(tag => JSON.stringify(tag)))}`);
  }
  if (data.related !== undefined) {
    lines.push(`related: ${formatInlineList((data.related || []).map(link => `[[${String(link).replace(/^\[\[|\]\]$/g, '')}]]`))}`);
  }
  if (data.created !== undefined) lines.push(`created: ${data.created}`);
  if (data.updated !== undefined) lines.push(`updated: ${data.updated}`);
  if (data.archived_from !== undefined) lines.push(`archived_from: ${data.archived_from}`);
  lines.push('---');
  return `${lines.join('\n')}\n`;
}

function readNote(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseFrontmatter(content);
}

function writeNote(filePath, data, body) {
  const normalizedBody = body.startsWith('\n') ? body : `\n${body}`;
  fs.writeFileSync(filePath, `${serializeFrontmatter(data)}${normalizedBody}`, 'utf8');
}

function updateFrontmatterDate(filePath) {
  const { data, body } = readNote(filePath);
  data.updated = getDate();
  writeNote(filePath, data, body);
}

function getFrontmatterValue(filePath, key) {
  return readNote(filePath).data[key];
}

function addRelatedLink(filePath, link) {
  const { data, body } = readNote(filePath);
  const related = new Set((data.related || []).map(item => item.replace(/^\[\[|\]\]$/g, '')));
  if (related.has(link)) return;
  related.add(link);
  data.related = Array.from(related);
  data.updated = getDate();
  writeNote(filePath, data, body);
}

function walkMarkdownFiles(rootDir) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function relativeVaultPath(vaultPath, filePath) {
  return path.relative(vaultPath, filePath).split(path.sep).join('/');
}

function resolveNote(searchPath, note) {
  const direct = path.join(searchPath, note);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const directMd = `${direct}.md`;
  if (fs.existsSync(directMd) && fs.statSync(directMd).isFile()) return directMd;

  const files = walkMarkdownFiles(searchPath);
  const exact = files.find(file => {
    const title = String(getFrontmatterValue(file, 'title') || '');
    return title.localeCompare(note, undefined, { sensitivity: 'accent' }) === 0;
  });
  if (exact) return exact;

  const lower = note.toLowerCase();
  return files.find(file => {
    const title = String(getFrontmatterValue(file, 'title') || '');
    return title.toLowerCase().includes(lower);
  }) || '';
}

function listRootCategories(vaultPath) {
  return fs.readdirSync(vaultPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
    .map(entry => entry.name)
    .sort();
}

function stringifyTags(tags) {
  return `[${(tags || []).map(tag => JSON.stringify(tag)).join(', ')}]`;
}

function firstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

function normalizeTags(tags) {
  const seen = new Set();
  const values = [];
  for (const tag of tags) {
    const normalized = String(tag).trim().replace(/^"(.*)"$/, '$1');
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    values.push(normalized);
  }
  return values;
}

module.exports = {
  CONFIG_FILE,
  addRelatedLink,
  checkVaultConfigured,
  createFrontmatter,
  ensureDir,
  fail,
  firstHeading,
  formatTags,
  getDate,
  getFrontmatterValue,
  getVaultPath,
  hasFrontmatter,
  listRootCategories,
  normalizeTags,
  parseFrontmatter,
  readConfig,
  readNote,
  relativeVaultPath,
  resolveNote,
  slugify,
  stringifyTags,
  updateFrontmatterDate,
  walkMarkdownFiles,
  writeNote
};
