#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  findSubagentFiles,
  loadSubagent,
  toClaudeMarkdown,
  toCodexToml,
  normalizeDistributionTargets,
} = require('../lib/subagents');

function usage() {
  console.error('Usage: copy-shared-subagents.js <claude|codex> <distribution-name> <output-root>');
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const target = process.argv[2];
  const distributionName = process.argv[3];
  const outputRoot = process.argv[4];

  if (!target || !distributionName || !outputRoot || !['claude', 'codex'].includes(target)) {
    usage();
  }

  const resolvedRoot = path.resolve(outputRoot);
  let emitted = 0;

  for (const filePath of findSubagentFiles()) {
    const subagent = loadSubagent(filePath);
    const distribution = subagent.data.distribution || {};
    const owners = normalizeDistributionTargets(
      target === 'claude' ? distribution.claude_plugin : distribution.codex_profile,
    );
    if (!owners.includes(distributionName)) continue;

    if (target === 'claude') {
      const targetPath = path.join(resolvedRoot, 'agents', `${subagent.data.name}.md`);
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, toClaudeMarkdown(subagent), 'utf-8');
    } else {
      const targetPath = path.join(resolvedRoot, 'agents', `${subagent.data.name}.toml`);
      ensureDir(path.dirname(targetPath));
      fs.writeFileSync(targetPath, toCodexToml(subagent), 'utf-8');
    }
    emitted += 1;
  }

  console.log(`Emitted ${emitted} shared ${target} subagents for ${distributionName}`);
}

main();
