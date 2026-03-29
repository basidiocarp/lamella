#!/usr/bin/env node
/**
 * Validate agent (subagent) markdown files have required frontmatter.
 *
 * Per Claude Code docs (docs/reference/subagents.md):
 *   Required: name, description
 *   Optional: tools, disallowedTools, model, permissionMode, maxTurns,
 *             skills, mcpServers, hooks, memory, background, isolation
 *   Valid models: sonnet, opus, haiku, inherit, or full model IDs (e.g. claude-opus-4-6)
 *   Model defaults to 'inherit' if omitted.
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '../../resources/agents');
const REQUIRED_FIELDS = ['name', 'description'];
const MODEL_ALIASES = ['haiku', 'sonnet', 'opus', 'inherit'];
const VALID_PERMISSION_MODES = ['default', 'acceptEdits', 'dontAsk', 'bypassPermissions', 'plan'];

function extractFrontmatter(content) {
  // Strip BOM if present (UTF-8 BOM: \uFEFF)
  const cleanContent = content.replace(/^\uFEFF/, '');
  // Support both LF and CRLF line endings
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

/** Recursively find all .md files (excluding README.md) */
function findMdFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(fullPath));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(fullPath);
    }
  }
  return results;
}

function validateAgents() {
  if (!fs.existsSync(AGENTS_DIR)) {
    console.log('No agents directory found, skipping validation');
    process.exit(0);
  }

  const files = findMdFiles(AGENTS_DIR);
  let hasErrors = false;

  for (const filePath of files) {
    const relPath = path.relative(AGENTS_DIR, filePath);
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(`ERROR: ${relPath} - ${err.message}`);
      hasErrors = true;
      continue;
    }
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      // Files in underscore-prefixed directories are utility fragments, not full agents
      const dir = path.dirname(relPath);
      if (dir.startsWith('_')) {
        continue;
      }
      console.error(`ERROR: ${relPath} - Missing frontmatter`);
      hasErrors = true;
      continue;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field] || (typeof frontmatter[field] === 'string' && !frontmatter[field].trim())) {
        console.error(`ERROR: ${relPath} - Missing required field: ${field}`);
        hasErrors = true;
      }
    }

    // Validate model if present (optional — defaults to 'inherit')
    if (frontmatter.model) {
      const model = frontmatter.model;
      // Accept aliases (haiku, sonnet, opus, inherit) or full model IDs (claude-opus-4-6, etc.)
      const isAlias = MODEL_ALIASES.includes(model);
      const isFullId = /^claude-[a-z0-9-]+$/.test(model);
      if (!isAlias && !isFullId) {
        console.error(`ERROR: ${relPath} - Invalid model '${model}'. Must be one of: ${MODEL_ALIASES.join(', ')}, or a full model ID (e.g., claude-opus-4-6)`);
        hasErrors = true;
      }
    }

    // Validate permissionMode if present
    if (frontmatter.permissionMode && !VALID_PERMISSION_MODES.includes(frontmatter.permissionMode)) {
      console.error(`ERROR: ${relPath} - Invalid permissionMode '${frontmatter.permissionMode}'. Must be one of: ${VALID_PERMISSION_MODES.join(', ')}`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${files.length} agent files`);
}

validateAgents();
