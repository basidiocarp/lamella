#!/usr/bin/env node
/**
 * SessionStart hook: scan CLAUDE.md files for prompt-injection patterns.
 */

const fs = require('fs');
const path = require('path');
const { output, logHookError } = require('../lib/utils');

const SUSPICIOUS_PATTERNS = [
  /ignore.*previous.*instruction/i,
  /ignore.*all.*instruction/i,
  /disregard.*instruction/i,
  /forget.*instruction/i,
  /new.*instruction.*follow/i,
  /curl.*\|.*bash/i,
  /curl.*\|.*sh/i,
  /wget.*\|.*bash/i,
  /wget.*\|.*sh/i,
  /eval\s*\(/i,
  /base64.*decode/i,
  /\$\(.*curl/i,
  /\$\(.*wget/i,
  /<!--.*ignore/i,
  /<!--.*instruction/i
];

function getScanTargets() {
  const targets = ['CLAUDE.md', path.join('.claude', 'CLAUDE.md')];
  const claudeDir = path.join(process.cwd(), '.claude');

  if (fs.existsSync(claudeDir) && fs.statSync(claudeDir).isDirectory()) {
    for (const entry of fs.readdirSync(claudeDir)) {
      if (entry.endsWith('.md')) {
        targets.push(path.join('.claude', entry));
      }
    }
  }

  return [...new Set(targets)];
}

function scanFile(filePath, warnings) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push(`Suspicious pattern in ${filePath}: matches '${pattern.source}'`);
    }
  }

  if (content.split(/\r?\n/).some(line => line.length > 500)) {
    warnings.push(`Warning: ${filePath} contains very long lines (potential obfuscation)`);
  }

  for (const line of content.split(/\r?\n/)) {
    if (/[^\x20-\x7E]/.test(line) && /\b(instruction|ignore|run|execute)\b/i.test(line)) {
      warnings.push(`Warning: ${filePath} contains non-ASCII characters near sensitive keywords`);
      break;
    }
  }
}

function main() {
  const warnings = [];

  for (const target of getScanTargets()) {
    scanFile(target, warnings);
  }

  if (warnings.length === 0) {
    return;
  }

  const message = [
    'SECURITY WARNING - Suspicious content detected:',
    ...warnings.map(warning => `- ${warning}`),
    '',
    'Review these files before proceeding.'
  ].join('\n');

  output({ systemMessage: message });
}

try {
  main();
} catch (error) {
  logHookError('claudemd-scanner', error);
  process.exit(0);
}
