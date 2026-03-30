#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function commandExists(cmd) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(checker, [cmd], { stdio: 'ignore' }).status === 0;
}

const eventName = process.argv[2];
if (!eventName || !commandExists('bun')) {
  process.exit(0);
}

const scriptPath = path.join(__dirname, 'src', 'index.ts');
let stdin = '';
try {
  stdin = fs.readFileSync(0, 'utf8');
} catch {}

const result = spawnSync('bun', [scriptPath, eventName], {
  input: stdin,
  stdio: ['pipe', 'inherit', 'inherit']
});

process.exit(result.status ?? 0);
