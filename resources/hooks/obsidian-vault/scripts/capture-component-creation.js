#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {
  checkVault,
  createFrontmatter,
  debugLog,
  ensureDir,
  getDate,
  getDatetime,
  getProjectName,
  getToolInput,
  isCaptureEnabled,
  readPayloadSync,
  slugify
} = require('./hook-utils');

const payload = readPayloadSync();
debugLog('capture-component-creation.js triggered');

if (!isCaptureEnabled('claudeCodeComponents')) process.exit(0);
const vaultPath = checkVault();
if (!vaultPath) process.exit(0);

const toolInput = getToolInput(payload);

function detectComponent(input) {
  if (/agents\/.*\.md|\/agents\//.test(input)) {
    const match = input.match(/[^ ]*agents\/[^ ]*\.md/);
    return { type: 'agent', componentPath: match ? match[0] : '' };
  }
  if (/hooks\.json|hooks\/.*\.(sh|js|py|ts)|\/hooks\//.test(input)) {
    const match = input.match(/[^ ]*hooks[^ ]*/);
    return { type: 'hook', componentPath: match ? match[0] : '' };
  }
  if (/skills\/.*SKILL\.md|\/skills\//.test(input)) {
    const match = input.match(/[^ ]*skills\/[^ ]*/);
    return { type: 'skill', componentPath: match ? match[0] : '' };
  }
  if (/\.mcp\.json|mcp-servers/.test(input)) {
    const match = input.match(/[^ ]*\.mcp\.json/);
    return { type: 'tool', componentPath: match ? match[0] : '' };
  }
  return { type: '', componentPath: '' };
}

const { type, componentPath } = detectComponent(toolInput);
if (!type) process.exit(0);

const componentName = (componentPath
  ? path.basename(componentPath).replace(/\.(md|json|sh|js|py|ts)$/i, '')
  : `unknown-${type}`);
const project = getProjectName();
const datetime = getDatetime();
const slug = slugify(componentName);
const componentDir = path.join(vaultPath, 'claude-code', `${type}s`);
const componentFile = path.join(componentDir, `${slug}.md`);
ensureDir(componentDir);

if (!fs.existsSync(componentFile)) {
  const descriptions = {
    agent: 'Claude Code agent for specialized tasks',
    hook: 'Claude Code hook for event handling',
    skill: 'Claude Code skill for domain expertise',
    tool: 'MCP server/tool integration'
  };

  const lines = [
    createFrontmatter(componentName, descriptions[type], `claude-code, ${type}, ${project}`, ''),
    '',
    `# ${componentName}`,
    '',
    `**Type:** ${type[0].toUpperCase()}${type.slice(1)}`,
    `**Created:** ${datetime}`,
    ...(componentPath ? [`**Location:** \`${componentPath}\``] : []),
    `**Project:** ${project}`,
    '',
    '## Purpose',
    '',
    `<!-- What does this ${type} do? -->`,
    '',
    '## Notes',
    '',
    '<!-- Additional context, gotchas, or tips -->',
    ''
  ];
  fs.writeFileSync(componentFile, `${lines.join('\n')}\n`, 'utf8');
}

const journalDir = path.join(vaultPath, 'journal', 'creations');
const journalFile = path.join(journalDir, `${getDate()}-${slug}.md`);
ensureDir(journalDir);
if (!fs.existsSync(journalFile)) {
  const related = `[[claude-code/${type}s/${slug}]]`;
  const lines = [
    createFrontmatter(`Created: ${componentName}`, `Created new ${type} in ${project}`, `creation, claude-code, ${type}`, related),
    '',
    `# Created: ${componentName}`,
    '',
    `**Date:** ${datetime}`,
    `**Type:** ${type[0].toUpperCase()}${type.slice(1)}`,
    `**Project:** ${project}`,
    '',
    `Created a new Claude Code ${type}.`,
    '',
    `See: ${related}`,
    ''
  ];
  fs.writeFileSync(journalFile, `${lines.join('\n')}\n`, 'utf8');
}

console.log(`OBSIDIAN_COMPONENT_NOTE_CREATED: ${componentFile}`);
