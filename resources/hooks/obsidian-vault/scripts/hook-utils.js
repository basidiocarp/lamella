#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const CONFIG_FILE = path.join(os.homedir(), '.claude', 'obsidian-vault.json');

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

function isCaptureEnabled(type) {
  const config = readConfig();
  if (!config) return false;
  const value = config.autoCapture?.[type];
  return value !== false;
}

function checkVault() {
  const vaultPath = getVaultPath();
  if (!vaultPath) return '';
  try {
    return fs.statSync(vaultPath).isDirectory() ? vaultPath : '';
  } catch {
    return '';
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
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

function getDatetime() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function formatTags(tags) {
  const tagList = String(tags || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => JSON.stringify(tag));
  return `[${tagList.join(', ')}]`;
}

function formatRelated(related) {
  const relatedList = String(related || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  return `[${relatedList.join(', ')}]`;
}

function createFrontmatter(title, description, tags, related, created = getDate()) {
  return [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `tags: ${formatTags(tags)}`,
    `related: ${formatRelated(related)}`,
    `created: ${created}`,
    `updated: ${getDate()}`,
    '---'
  ].join('\n');
}

function runGit(args, cwd = process.cwd()) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

function getProjectName(dir = process.cwd()) {
  const remote = runGit(['-C', dir, 'remote', 'get-url', 'origin'], dir);
  if (remote) {
    return path.basename(remote, '.git');
  }
  return path.basename(dir);
}

function getGitBranch(dir = process.cwd()) {
  return runGit(['rev-parse', '--abbrev-ref', 'HEAD'], dir);
}

function commitNoteExists(vaultPath, commitShort) {
  const commitsDir = path.join(vaultPath, 'journal', 'commits');
  if (!fs.existsSync(commitsDir)) return '';
  const entries = fs.readdirSync(commitsDir).filter(entry => entry.endsWith('.md'));
  for (const entry of entries) {
    const fullPath = path.join(commitsDir, entry);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(`**Commit:** ${commitShort}`)) {
      return fullPath;
    }
  }
  return '';
}

function debugLog(message) {
  if (process.env.OBSIDIAN_DEBUG !== 'true') return;
  const debugFile = path.join(os.homedir(), '.claude', 'obsidian-vault-debug.log');
  fs.appendFileSync(debugFile, `[${new Date().toISOString()}] ${message}\n`, 'utf8');
}

function readPayloadSync() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

function getToolInput(payload) {
  if (!payload) return '';
  const toolInput = payload.tool_input ?? {};
  if (typeof toolInput === 'string') return toolInput;
  if (toolInput.command) return toolInput.command;
  if (toolInput.file_path) return toolInput.file_path;
  try {
    return JSON.stringify(toolInput);
  } catch {
    return '';
  }
}

function getToolOutput(payload) {
  if (!payload) return '';
  const toolOutput = payload.tool_output ?? '';
  if (typeof toolOutput === 'string') return toolOutput;
  try {
    return JSON.stringify(toolOutput);
  } catch {
    return '';
  }
}

function commandExists(name) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(checker, [name], { stdio: 'ignore' }).status === 0;
}

module.exports = {
  checkVault,
  commandExists,
  commitNoteExists,
  createFrontmatter,
  debugLog,
  ensureDir,
  getDate,
  getDatetime,
  getGitBranch,
  getProjectName,
  getToolInput,
  getToolOutput,
  isCaptureEnabled,
  readPayloadSync,
  runGit,
  slugify
};
