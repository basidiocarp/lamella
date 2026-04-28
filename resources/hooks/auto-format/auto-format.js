#!/usr/bin/env node
/**
 * Standalone PostToolUse formatter example.
 *
 * Supports:
 * - Python via ruff format / ruff check --fix
 * - Go via goimports
 * - JS/TS/JSON/CSS/HTML/Markdown/YAML via prettier
 *
 * Always exits 0 so formatting issues do not block Claude.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const MAX_STDIN = 1024 * 1024;
let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (data.length < MAX_STDIN) {
    data += chunk.slice(0, MAX_STDIN - data.length);
  }
});

function commandName(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name;
}

function findProjectRoot(startDir) {
  let dir = startDir;
  const root = path.parse(dir).root;
  while (dir && dir !== root) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

/**
 * Return a copy of process.env with secret-bearing variables removed.
 * Formatter toolchains (ruff, goimports, prettier) do not need API keys or
 * tokens, and executable configs such as prettier.config.js could read them.
 */
function scrubEnv() {
  const SECRET_SUFFIXES = ['_API_KEY', '_SECRET_KEY', '_SECRET', '_TOKEN', '_PASSWORD', '_CREDENTIAL'];
  const SECRET_EXACT = new Set(['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 'GITHUB_TOKEN', 'GITLAB_TOKEN', 'BEARER_TOKEN']);
  const env = Object.assign({}, process.env);
  for (const key of Object.keys(env)) {
    const upper = key.toUpperCase();
    if (SECRET_EXACT.has(upper) || SECRET_SUFFIXES.some(suf => upper.endsWith(suf))) {
      delete env[key];
    }
  }
  return env;
}

function run(bin, args, cwd) {
  try {
    execFileSync(bin, args, {
      cwd,
      env: scrubEnv(),
      stdio: 'ignore',
      timeout: 30000
    });
  } catch {
    // Non-blocking example: ignore formatter failures
  }
}

function formatFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    return;
  }

  const extension = path.extname(resolvedPath).toLowerCase();
  if (extension === '.py') {
    run('ruff', ['format', resolvedPath], path.dirname(resolvedPath));
    run('ruff', ['check', '--fix', '--unfixable', 'F401', resolvedPath], path.dirname(resolvedPath));
    return;
  }

  if (extension === '.go') {
    run('goimports', ['-w', resolvedPath], path.dirname(resolvedPath));
    return;
  }

  const prettierEligible = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.html', '.md', '.yaml', '.yml'
  ]);
  if (prettierEligible.has(extension)) {
    const projectRoot = findProjectRoot(path.dirname(resolvedPath));
    run(commandName('npx'), ['prettier', '--write', resolvedPath], projectRoot);
  }
}

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const filePath = input.tool_input?.file_path || '';
    if (filePath) {
      formatFile(filePath);
    }
  } catch {
    // Ignore malformed input in standalone example
  }

  process.stdout.write(data);
  process.exit(0);
});
