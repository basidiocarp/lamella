#!/usr/bin/env node
/**
 * SessionStart hook: save RTK gain baseline for later delta tracking.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getTempDir, commandExists, logHookError } = require('../lib/utils');

function main() {
  let enabled = process.env.SESSION_SUMMARY_RTK || 'auto';

  if (enabled === 'auto') {
    enabled = commandExists('rtk') ? '1' : '0';
  }

  if (enabled !== '1') {
    return;
  }

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const baselineKey = projectDir.replace(/[\\/]/g, '-');
  const baselineFile = path.join(getTempDir(), `rtk-baseline${baselineKey}.txt`);

  const result = spawnSync('rtk', ['gain'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  if (result.status === 0 && typeof result.stdout === 'string') {
    fs.writeFileSync(baselineFile, result.stdout, 'utf8');
  }
}

try {
  main();
} catch (error) {
  logHookError('rtk-baseline', error);
  process.exit(0);
}
