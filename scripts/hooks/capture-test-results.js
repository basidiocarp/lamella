#!/usr/bin/env node
/**
 * Legacy PostToolUse helper: capture test results in Hyphae
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * This script is not wired into the shipped Lamella hook catalog.
 * Cortina now owns the primary shared lifecycle runtime for PostToolUse.
 *
 * Kept as a reference or fallback implementation for older local setups.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { log, commandExists, getProjectName } = require('../lib/utils');

const MAX_STDIN = 1024 * 1024;
let data = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (data.length < MAX_STDIN) {
    const remaining = MAX_STDIN - data.length;
    data += chunk.substring(0, remaining);
  }
});

process.stdin.on('end', () => {
  try {
    processToolUse();
  } catch {
    // Hook must never fail
  }
  process.stdout.write(data);
  process.exit(0);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test command detection
// ─────────────────────────────────────────────────────────────────────────────

const TEST_COMMANDS = [
  /\bcargo\s+test\b/,
  /\bnpm\s+test\b/,
  /\bvitest\b/,
  /\bpytest\b/,
  /\bgo\s+test\b/,
  /\bjest\b/,
  /\bplaywright\b/,
  /\bnpx\s+vitest\b/,
  /\bnpx\s+jest\b/,
  /\bpnpm\s+test\b/,
  /\byarn\s+test\b/,
  /\bbun\s+test\b/
];

// ─────────────────────────────────────────────────────────────────────────────
// Test output parsers by framework
// ─────────────────────────────────────────────────────────────────────────────

function parseCargoTest(output) {
  const failures = [];
  const lines = output.split('\n');
  for (const line of lines) {
    const match = line.match(/^test\s+(\S+)\s+\.\.\.\s+FAILED/);
    if (match) {
      failures.push(match[1]);
    }
  }
  return failures;
}

function parseJestVitest(output) {
  const failures = [];
  const lines = output.split('\n');
  for (const line of lines) {
    // Jest/Vitest: "FAIL src/foo.test.ts" or "✕ test name" or "× test name"
    const failLine = line.match(/^\s*FAIL\s+(.+)/);
    if (failLine) {
      failures.push(failLine[1].trim());
      continue;
    }
    const testLine = line.match(/^\s*[✕×✗]\s+(.+)/);
    if (testLine) {
      failures.push(testLine[1].trim());
    }
  }
  return failures;
}

function parsePytest(output) {
  const failures = [];
  const lines = output.split('\n');
  for (const line of lines) {
    // pytest: "FAILED tests/test_foo.py::test_bar" or "FAILED test_bar"
    const match = line.match(/FAILED\s+(\S+)/);
    if (match) {
      failures.push(match[1]);
    }
  }
  return failures;
}

function parseGoTest(output) {
  const failures = [];
  const lines = output.split('\n');
  for (const line of lines) {
    // go test: "--- FAIL: TestFoo (0.00s)"
    const match = line.match(/---\s+FAIL:\s+(\S+)/);
    if (match) {
      failures.push(match[1]);
    }
  }
  return failures;
}

function extractFailedTests(command, output) {
  if (/\bcargo\s+test\b/.test(command)) return parseCargoTest(output);
  if (/\bpytest\b/.test(command)) return parsePytest(output);
  if (/\bgo\s+test\b/.test(command)) return parseGoTest(output);
  // Jest, Vitest, Playwright all use similar output
  return parseJestVitest(output);
}

// ─────────────────────────────────────────────────────────────────────────────
// Core logic
// ─────────────────────────────────────────────────────────────────────────────

function processToolUse() {
  let input;
  try {
    input = JSON.parse(data);
  } catch {
    return;
  }

  const command = input.tool_input?.command || '';
  const output = input.tool_output?.output || '';
  const exitCode = input.tool_output?.exit_code;

  if (!command) return;
  if (!TEST_COMMANDS.some(p => p.test(command))) return;

  const hyphaeAvailable = commandExists('hyphae');
  const cwdHash = crypto.createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12);
  const trackFile = path.join('/tmp', `hyphae-test-failures-${cwdHash}.json`);
  const isFailure = exitCode !== undefined && exitCode !== null && exitCode !== 0;

  if (isFailure) {
    const failedTests = extractFailedTests(command, output);
    trackFailure(command, failedTests, output, trackFile);
    if (hyphaeAvailable) {
      storeFailureInHyphae(command, failedTests, output);
    }
  } else {
    resolveFailures(command, trackFile, hyphaeAvailable);
  }
}

function loadTrackFile(trackFile) {
  try {
    if (fs.existsSync(trackFile)) {
      return JSON.parse(fs.readFileSync(trackFile, 'utf8'));
    }
  } catch {
    // Corrupt file — start fresh
  }
  return {};
}

function saveTrackFile(trackFile, entries) {
  try {
    fs.writeFileSync(trackFile, JSON.stringify(entries, null, 2), 'utf8');
  } catch {
    // Non-critical
  }
}

function normalizeCommand(cmd) {
  const parts = cmd.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
  return parts[0] || cmd;
}

function trackFailure(command, failedTests, output, trackFile) {
  const entries = loadTrackFile(trackFile);
  const cmdKey = normalizeCommand(command);
  entries[cmdKey] = {
    command: command.slice(0, 500),
    failedTests: failedTests.slice(0, 20),
    error: output.slice(0, 500),
    timestamp: Date.now(),
    date: new Date().toISOString().slice(0, 10)
  };
  saveTrackFile(trackFile, entries);
}

function storeFailureInHyphae(command, failedTests, output) {
  try {
    const project = getProjectName();
    const testList = failedTests.length > 0
      ? failedTests.slice(0, 10).join(', ')
      : 'unknown tests';
    const content = `${command.slice(0, 200)}: ${testList} — ${output.slice(0, 300)}`;
    const keywords = ['test', 'failed', ...failedTests.slice(0, 5)].join(',');
    const args = [
      'store', '--topic', 'tests/failed',
      '--content', content,
      '--importance', 'medium',
      '--keywords', keywords
    ];
    if (project) args.push('-P', project);
    spawnSync('hyphae', args, {
      encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3000
    });
  } catch {
    // Non-critical
  }
}

function resolveFailures(command, trackFile, hyphaeAvailable) {
  const entries = loadTrackFile(trackFile);
  const cmdKey = normalizeCommand(command);
  if (!entries[cmdKey]) return;

  const previous = entries[cmdKey];
  delete entries[cmdKey];
  saveTrackFile(trackFile, entries);

  if (hyphaeAvailable) {
    try {
      const project = getProjectName();
      const failedList = (previous.failedTests || []).slice(0, 10).join(', ') || 'unknown tests';
      const sinceDate = previous.date || 'unknown';
      const content = `Fixed: ${failedList} (was failing since ${sinceDate})`;
      const keywords = ['test', 'resolved', 'fix', ...(previous.failedTests || []).slice(0, 5)].join(',');
      const args = [
        'store', '--topic', 'tests/resolved',
        '--content', content,
        '--importance', 'high',
        '--keywords', keywords
      ];
      if (project) args.push('-P', project);
      spawnSync('hyphae', args, {
        encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3000
      });
      log('[capture-test-results] Stored test resolution in hyphae');
    } catch {
      // Non-critical
    }
  }
}
