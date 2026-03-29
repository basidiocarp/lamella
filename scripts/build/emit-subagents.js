#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  ROOT_DIR,
  findSubagentFiles,
  loadSubagent,
  normalizeDistributionTargets,
  toClaudeMarkdown,
  toCodexToml,
} = require('../lib/subagents');

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function usage() {
  console.error('Usage: emit-subagents.js <claude|codex> [output-dir]');
  process.exit(1);
}

function main() {
  const target = process.argv[2];
  if (!target || !['claude', 'codex'].includes(target)) {
    usage();
  }

  const defaultOutput = target === 'claude'
    ? path.join(ROOT_DIR, 'dist', 'generated', 'claude-subagents')
    : path.join(ROOT_DIR, 'dist', 'generated', 'codex-agents');
  const outputDir = process.argv[3] ? path.resolve(process.argv[3]) : defaultOutput;

  ensureCleanDir(outputDir);

  let count = 0;
  for (const filePath of findSubagentFiles()) {
    const subagent = loadSubagent(filePath);
    const baseName = subagent.data.name;
    const rendered = target === 'claude' ? toClaudeMarkdown(subagent) : toCodexToml(subagent);
    const distribution = subagent.data.distribution || {};

    if (target === 'claude') {
      const pluginNames = normalizeDistributionTargets(distribution.claude_plugin);
      for (const pluginName of pluginNames) {
        const targetPath = path.join(outputDir, 'plugins', pluginName, 'agents', `${baseName}.md`);
        ensureDir(path.dirname(targetPath));
        fs.writeFileSync(targetPath, rendered, 'utf-8');
        count += 1;
      }
    } else {
      const profileNames = normalizeDistributionTargets(distribution.codex_profile);
      for (const profileName of profileNames) {
        const targetPath = path.join(outputDir, 'profiles', profileName, 'agents', `${baseName}.toml`);
        ensureDir(path.dirname(targetPath));
        fs.writeFileSync(targetPath, rendered, 'utf-8');
        count += 1;
      }
    }
  }

  console.log(`Emitted ${count} ${target} subagent artifacts to ${outputDir}`);
}

main();
