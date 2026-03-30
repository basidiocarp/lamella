#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');

let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  data += chunk;
});

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(data || '{}');
    const sessionId = payload.session_id || '';
    if (!sessionId || !/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
      if (sessionId) {
        console.error('gh-cli: invalid session_id format, skipping cleanup');
      }
      process.exit(0);
    }

    const cloneDir = path.join(os.tmpdir(), `gh-clones-${sessionId}`);
    if (fs.existsSync(cloneDir)) {
      fs.rmSync(cloneDir, { recursive: true, force: true });
    }
  } catch {
    // Ignore malformed input
  }
  process.exit(0);
});
