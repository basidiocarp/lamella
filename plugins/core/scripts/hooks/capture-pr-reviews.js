#!/usr/bin/env node
/**
 * PostToolUse Hook: Capture PR review feedback in hyphae
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Detects PR review commands (gh pr view, gh pr checks, gh api pulls reviews)
 * and stores reviewer comments, file references, and approval status in hyphae
 * for cross-session recall.
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
// PR command detection
// ─────────────────────────────────────────────────────────────────────────────

const PR_COMMANDS = [
  /\bgh\s+pr\s+view\b/,
  /\bgh\s+pr\s+checks\b/,
  /\bgh\s+api\s+.*\/pulls\/\d+\/reviews\b/,
  /\bgh\s+api\s+.*\/pulls\/\d+\/comments\b/
];

// ─────────────────────────────────────────────────────────────────────────────
// PR number extraction
// ─────────────────────────────────────────────────────────────────────────────

function extractPrNumber(command, output) {
  // From command: gh pr view 42, gh pr checks 42
  const cmdMatch = command.match(/\bgh\s+pr\s+(?:view|checks)\s+(\d+)/);
  if (cmdMatch) return cmdMatch[1];

  // From API path: /pulls/42/reviews
  const apiMatch = command.match(/\/pulls\/(\d+)\//);
  if (apiMatch) return apiMatch[1];

  // From output: #42 in title or URL
  const urlMatch = output.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
  if (urlMatch) return urlMatch[1];

  const hashMatch = output.match(/#(\d+)/);
  if (hashMatch) return hashMatch[1];

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Review parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseReviewStatus(output) {
  if (/\bAPPROVED\b/i.test(output)) return 'approved';
  if (/\bCHANGES[_ ]REQUESTED\b/i.test(output)) return 'changes_requested';
  if (/\bCOMMENTED\b/i.test(output)) return 'commented';
  return null;
}

function parseReviewerComments(output) {
  const comments = [];
  const lines = output.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Pattern: "@reviewer (APPROVED|CHANGES_REQUESTED|COMMENTED)"
    const reviewerMatch = line.match(/@(\w+)\s*[:(]\s*(APPROVED|CHANGES[_ ]REQUESTED|COMMENTED)/i);
    if (reviewerMatch) {
      comments.push({
        reviewer: reviewerMatch[1],
        status: reviewerMatch[2].toLowerCase().replace(/\s+/g, '_'),
        text: line.trim()
      });
      continue;
    }

    // Pattern: "Review by @reviewer: STATUS"
    const reviewByMatch = line.match(/Review\s+by\s+@(\w+):\s*(\S+)/i);
    if (reviewByMatch) {
      comments.push({
        reviewer: reviewByMatch[1],
        status: reviewByMatch[2].toLowerCase().replace(/\s+/g, '_'),
        text: line.trim()
      });
      continue;
    }

    // Pattern: "Comment on src/file.rs line 15:"
    const fileCommentMatch = line.match(/Comment\s+on\s+(\S+)\s+line\s+(\d+):/i);
    if (fileCommentMatch) {
      const commentText = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
      comments.push({
        file: fileCommentMatch[1],
        line: parseInt(fileCommentMatch[2], 10),
        text: commentText || line.trim()
      });
    }
  }

  return comments;
}

function extractFileReferences(output) {
  const files = new Set();
  const lines = output.split('\n');
  for (const line of lines) {
    // Match file paths in review context
    const fileMatch = line.match(/(?:^|\s)([\w/.-]+\.[a-zA-Z]{1,6})(?::(\d+))?/);
    if (fileMatch && fileMatch[1].includes('/')) {
      files.add(fileMatch[1]);
    }
  }
  return [...files];
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

  if (!command) return;
  if (!PR_COMMANDS.some(p => p.test(command))) return;

  const hyphaeAvailable = commandExists('hyphae');
  if (!hyphaeAvailable) return;

  const prNumber = extractPrNumber(command, output);
  if (!prNumber) return;

  const cwdHash = crypto.createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12);
  const trackFile = path.join('/tmp', `hyphae-pr-reviews-${cwdHash}.json`);

  const status = parseReviewStatus(output);
  const comments = parseReviewerComments(output);
  const files = extractFileReferences(output);

  // Generate a content hash to avoid re-storing identical reviews
  const contentHash = crypto.createHash('sha256')
    .update(`${prNumber}:${status}:${comments.length}:${output.slice(0, 200)}`)
    .digest('hex')
    .slice(0, 16);

  if (isAlreadySeen(trackFile, prNumber, contentHash)) return;

  storeReviewInHyphae(prNumber, status, comments, files, output);
  markAsSeen(trackFile, prNumber, contentHash);
}

function isAlreadySeen(trackFile, prNumber, contentHash) {
  const seen = loadTrackFile(trackFile);
  const prSeen = seen[prNumber] || [];
  return prSeen.includes(contentHash);
}

function markAsSeen(trackFile, prNumber, contentHash) {
  const seen = loadTrackFile(trackFile);
  const prSeen = seen[prNumber] || [];
  seen[prNumber] = [...prSeen.slice(-50), contentHash];
  saveTrackFile(trackFile, seen);
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

function storeReviewInHyphae(prNumber, status, comments, files, rawOutput) {
  try {
    const project = getProjectName();
    const parts = [];

    if (status) {
      parts.push(`PR #${prNumber}: ${status}`);
    }

    for (const comment of comments.slice(0, 5)) {
      if (comment.reviewer) {
        parts.push(`${comment.reviewer}: ${comment.text.slice(0, 200)}`);
      }
      if (comment.file) {
        parts.push(`${comment.file}:${comment.line}: ${comment.text.slice(0, 200)}`);
      }
    }

    if (parts.length === 0) {
      // Fallback: store raw summary
      parts.push(`PR #${prNumber} review: ${rawOutput.slice(0, 400)}`);
    }

    const content = parts.join('\n');
    const fileKeywords = files.slice(0, 5).map(f => f.replace(/\//g, '_'));
    const keywords = ['review', 'pr', prNumber, ...fileKeywords].join(',');

    const args = [
      'store', '--topic', `reviews/${prNumber}`,
      '--content', content,
      '--importance', 'high',
      '--keywords', keywords
    ];
    if (project) args.push('-P', project);

    spawnSync('hyphae', args, {
      encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 3000
    });
    log(`[capture-pr-reviews] Stored PR #${prNumber} review in hyphae`);
  } catch {
    // Non-critical
  }
}
