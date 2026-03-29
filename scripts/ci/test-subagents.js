#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const {
  SUBAGENTS_DIR,
  extractFrontmatterAndBody,
  findSubagentFiles,
  loadSubagent,
  normalizeDistributionTargets,
  parseFrontmatter,
  toClaudeMarkdown,
  toCodexToml,
} = require('../lib/subagents');

function main() {
  const tempCategoryDir = fs.mkdtempSync(path.join(SUBAGENTS_DIR, 'test-fixture-'));
  try {
    const categoryName = path.basename(tempCategoryDir);
    const subagentDir = path.join(tempCategoryDir, 'evidence-bot');
    fs.mkdirSync(subagentDir, { recursive: true });

    const source = `---
name: evidence-bot
description: Produces an evidence-backed summary. Use when a task needs a short factual brief.
category: analysis
capability_profile: review
execution_profile: read-only
reasoning_profile: balanced
delegation_style: report-only

distribution:
  claude_plugin:
    - tools
    - meta
  codex_profile: tools

claude:
  model: inherit
  color: cyan
  tools:
    - Read
    - Grep
  skills:
    - docs-style
  mcpServers:
    local: enabled
  hooks:
    Stop:
      matcher: evidence-bot
  background: true

codex:
  model: gpt-5.4-mini
  model_reasoning_effort: medium
  sandbox_mode: read-only
  nickname_candidates:
    - evidence
    - summary-bot
---

# Evidence Bot

Summarize facts without inventing supporting detail.

## Scope

Use for short, sourced summaries and evidence-backed notes.

## Workflow

1. Identify the requested evidence.
2. Gather the smallest useful supporting context.
3. Write a concise factual summary.

## Boundaries

- Do: stay grounded in what was actually observed.
- Ask first: expand into recommendations or decisions.
- Never: fill gaps with invented details.

## Output Format

- Evidence summary
- Key facts
- Open gaps
`;

    const filePath = path.join(subagentDir, 'SUBAGENT.md');
    fs.writeFileSync(filePath, source);

    const extracted = extractFrontmatterAndBody(source);
    assert.ok(extracted, 'frontmatter should parse');
    assert.match(extracted.body, /^# Evidence Bot/m);

    const parsed = parseFrontmatter(extracted.frontmatterText);
    assert.equal(parsed.name, 'evidence-bot');
    assert.deepEqual(parsed.distribution.claude_plugin, ['tools', 'meta']);
    assert.equal(parsed.codex.model, 'gpt-5.4-mini');

    const files = findSubagentFiles(tempCategoryDir);
    assert.deepEqual(files, [filePath]);

    const subagent = loadSubagent(filePath);
    assert.equal(subagent.categoryDir, categoryName);
    assert.equal(subagent.subagentDir, 'evidence-bot');
    assert.deepEqual(normalizeDistributionTargets('tools'), ['tools']);
    assert.deepEqual(normalizeDistributionTargets(['tools', 'meta']), ['tools', 'meta']);

    const claudeMarkdown = toClaudeMarkdown(subagent);
    assert.match(claudeMarkdown, /^name: evidence-bot$/m);
    assert.match(claudeMarkdown, /^skills:$/m);
    assert.match(claudeMarkdown, /^  - docs-style$/m);
    assert.match(claudeMarkdown, /^mcpServers:$/m);
    assert.match(claudeMarkdown, /^  local: enabled$/m);
    assert.match(claudeMarkdown, /^hooks:$/m);
    assert.match(claudeMarkdown, /^  Stop:$/m);
    assert.match(claudeMarkdown, /^    matcher: evidence-bot$/m);
    assert.match(claudeMarkdown, /^background: true$/m);
    assert.match(claudeMarkdown, /^# Evidence Bot$/m);

    const codexToml = toCodexToml(subagent);
    assert.match(codexToml, /^name = "evidence-bot"$/m);
    assert.match(codexToml, /^model = "gpt-5.4-mini"$/m);
    assert.match(codexToml, /^nickname_candidates = \["evidence", "summary-bot"\]$/m);
    assert.match(codexToml, /^developer_instructions = """$/m);
    assert.match(codexToml, /^## Workflow$/m);

    console.log('Subagent parser and emitters passed');
  } finally {
    fs.rmSync(tempCategoryDir, { recursive: true, force: true });
  }
}

main();
