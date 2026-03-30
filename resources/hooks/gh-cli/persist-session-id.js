#!/usr/bin/env node
const fs = require('fs');

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
        console.error('gh-cli: invalid session_id format, skipping');
      }
      process.exit(0);
    }

    const envFile = process.env.CLAUDE_ENV_FILE || '';
    if (!envFile) {
      console.error('gh-cli: CLAUDE_ENV_FILE not set; session-scoped clones will not work');
      process.exit(0);
    }

    fs.appendFileSync(envFile, `export CLAUDE_SESSION_ID="${sessionId}"\n`, 'utf8');
  } catch {
    // Ignore malformed input
  }
  process.exit(0);
});
