#!/usr/bin/env node
/**
 * Standalone PreCompact hook example that injects a compaction strategy file.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const strategyFile = path.join(os.homedir(), '.claude', 'compaction-strategy.md');

if (fs.existsSync(strategyFile)) {
  process.stdout.write(fs.readFileSync(strategyFile, 'utf8'));
}
