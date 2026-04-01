#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const {
  ROOT_DIR,
  SUBAGENTS_DIR,
  findSubagentFiles,
  loadSubagent,
  normalizeDistributionTargets,
} = require('../lib/subagents');
const { validateRequiresValue } = require('../lib/requires');

const CLAUDE_MODELS = new Set(['inherit', 'haiku', 'sonnet', 'opus']);
const CLAUDE_COLORS = new Set(['blue', 'cyan', 'green', 'yellow', 'magenta', 'red']);
const CLAUDE_PERMISSION_MODES = new Set(['default', 'acceptEdits', 'dontAsk', 'bypassPermissions', 'plan']);
const CLAUDE_MEMORY_SCOPES = new Set(['user', 'project', 'local']);
const CLAUDE_ISOLATION = new Set(['worktree']);
const CAPABILITY_PROFILES = new Set(['review', 'explore', 'plan', 'implement', 'docs', 'verify', 'orchestrate']);
const EXECUTION_PROFILES = new Set(['read-only', 'edit-code', 'edit-docs', 'run-commands']);
const REASONING_PROFILES = new Set(['fast', 'balanced', 'deep']);
const DELEGATION_STYLES = new Set(['report-only', 'execute', 'orchestrate']);
const CODEX_REASONING = new Set(['low', 'medium', 'high', 'xhigh']);
const CODEX_SANDBOX = new Set(['read-only', 'workspace-write', 'danger-full-access']);
const TOP_LEVEL_FIELDS = new Set([
  'name',
  'description',
  'requires',
  'category',
  'capability_profile',
  'execution_profile',
  'reasoning_profile',
  'delegation_style',
  'distribution',
  'claude',
  'codex',
]);
const DISTRIBUTION_FIELDS = new Set(['claude_plugin', 'codex_profile']);
const CLAUDE_FIELDS = new Set([
  'model',
  'color',
  'tools',
  'disallowedTools',
  'permissionMode',
  'maxTurns',
  'skills',
  'mcpServers',
  'hooks',
  'memory',
  'background',
  'isolation',
]);
const CODEX_FIELDS = new Set([
  'model',
  'model_reasoning_effort',
  'sandbox_mode',
  'nickname_candidates',
]);
const CLAUDE_MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests', 'claude');
const CODEX_MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests', 'codex');

let errors = 0;

function reportError(message) {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateStringArray(relPath, fieldName, value, { allowEmpty = false } = {}) {
  if (!Array.isArray(value)) {
    reportError(`${relPath} - ${fieldName} must be an array`);
    return false;
  }
  if (!allowEmpty && value.length === 0) {
    reportError(`${relPath} - ${fieldName} must not be empty`);
    return false;
  }

  let ok = true;
  for (const item of value) {
    if (typeof item !== 'string' || item.trim() === '') {
      reportError(`${relPath} - ${fieldName} entries must be non-empty strings`);
      ok = false;
      break;
    }
  }
  return ok;
}

function validateDistributionTargetList(relPath, fieldName, value, manifestsDir, extension) {
  const targets = normalizeDistributionTargets(value);
  if (targets.length === 0) {
    reportError(`${relPath} - ${fieldName} must be a non-empty string or array`);
    return;
  }

  const seen = new Set();
  for (const target of targets) {
    if (typeof target !== 'string' || target.trim() === '') {
      reportError(`${relPath} - ${fieldName} entries must be non-empty strings`);
      continue;
    }
    if (seen.has(target)) {
      reportError(`${relPath} - ${fieldName} entries must be unique`);
      continue;
    }
    seen.add(target);
    if (!fs.existsSync(path.join(manifestsDir, `${target}.${extension}`))) {
      reportError(`${relPath} - ${fieldName} '${target}' does not match an existing manifest`);
    }
  }
}

function validateBody(relPath, body) {
  const checks = [
    { label: 'title', pattern: /^# /m },
    { label: 'scope', pattern: /^## Scope$/m },
    { label: 'workflow', pattern: /^## Workflow$/m },
    { label: 'boundaries', pattern: /^## Boundaries$/m },
    { label: 'output format', pattern: /^## Output Format$/m },
  ];

  for (const check of checks) {
    if (!check.pattern.test(body)) {
      reportError(`${relPath} - Missing body section: ${check.label}`);
    }
  }
}

function validateSubagent(subagent) {
  const { relPath, categoryDir, subagentDir, data, body } = subagent;

  for (const key of Object.keys(data)) {
    if (!TOP_LEVEL_FIELDS.has(key)) {
      reportError(`${relPath} - Unknown top-level field: ${key}`);
    }
  }

  const requiredFields = [
    'name',
    'description',
    'category',
    'capability_profile',
    'execution_profile',
    'reasoning_profile',
    'delegation_style',
    'distribution',
    'claude',
    'codex',
  ];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      reportError(`${relPath} - Missing required field: ${field}`);
    }
  }

  if (data.name && data.name !== subagentDir) {
    reportError(`${relPath} - name must match containing directory (${subagentDir})`);
  }

  if (data.category && data.category !== categoryDir) {
    reportError(`${relPath} - category must match containing category directory (${categoryDir})`);
  }

  if (typeof data.description === 'string' && data.description.length > 1024) {
    reportError(`${relPath} - description exceeds 1024 characters`);
  }

  validateRequiresValue(relPath, data.requires, reportError);

  if (data.capability_profile && !CAPABILITY_PROFILES.has(data.capability_profile)) {
    reportError(`${relPath} - Invalid capability_profile '${data.capability_profile}'`);
  }
  if (data.execution_profile && !EXECUTION_PROFILES.has(data.execution_profile)) {
    reportError(`${relPath} - Invalid execution_profile '${data.execution_profile}'`);
  }
  if (data.reasoning_profile && !REASONING_PROFILES.has(data.reasoning_profile)) {
    reportError(`${relPath} - Invalid reasoning_profile '${data.reasoning_profile}'`);
  }
  if (data.delegation_style && !DELEGATION_STYLES.has(data.delegation_style)) {
    reportError(`${relPath} - Invalid delegation_style '${data.delegation_style}'`);
  }

  const distribution = data.distribution || {};
  if (!isPlainObject(distribution)) {
    reportError(`${relPath} - distribution must be a map`);
  }
  for (const key of Object.keys(distribution)) {
    if (!DISTRIBUTION_FIELDS.has(key)) {
      reportError(`${relPath} - Unknown distribution field: ${key}`);
    }
  }
  validateDistributionTargetList(relPath, 'distribution.claude_plugin', distribution.claude_plugin, CLAUDE_MANIFESTS_DIR, 'json');
  validateDistributionTargetList(relPath, 'distribution.codex_profile', distribution.codex_profile, CODEX_MANIFESTS_DIR, 'yaml');

  const claude = data.claude || {};
  if (!isPlainObject(claude)) {
    reportError(`${relPath} - claude must be a map`);
  }
  for (const key of Object.keys(claude)) {
    if (!CLAUDE_FIELDS.has(key)) {
      reportError(`${relPath} - Unknown claude field: ${key}`);
    }
  }
  if (!claude.model || !(CLAUDE_MODELS.has(claude.model) || /^claude-[a-z0-9-]+$/.test(claude.model))) {
    reportError(`${relPath} - claude.model must be a Claude alias or full model id`);
  }
  if (!claude.color || !CLAUDE_COLORS.has(claude.color)) {
    reportError(`${relPath} - claude.color must be one of ${Array.from(CLAUDE_COLORS).join(', ')}`);
  }
  validateStringArray(relPath, 'claude.tools', claude.tools);
  if (claude.disallowedTools !== undefined) {
    validateStringArray(relPath, 'claude.disallowedTools', claude.disallowedTools);
  }
  if (claude.permissionMode !== undefined && !CLAUDE_PERMISSION_MODES.has(claude.permissionMode)) {
    reportError(`${relPath} - claude.permissionMode must be one of ${Array.from(CLAUDE_PERMISSION_MODES).join(', ')}`);
  }
  if (claude.maxTurns !== undefined && (!Number.isInteger(claude.maxTurns) || claude.maxTurns <= 0)) {
    reportError(`${relPath} - claude.maxTurns must be a positive integer`);
  }
  if (claude.skills !== undefined) {
    validateStringArray(relPath, 'claude.skills', claude.skills);
  }
  if (claude.mcpServers !== undefined) {
    const validType = typeof claude.mcpServers === 'string'
      || Array.isArray(claude.mcpServers)
      || isPlainObject(claude.mcpServers);
    if (!validType) {
      reportError(`${relPath} - claude.mcpServers must be a string, array, or map`);
    }
    if (Array.isArray(claude.mcpServers)) {
      validateStringArray(relPath, 'claude.mcpServers', claude.mcpServers);
    }
  }
  if (claude.hooks !== undefined && !isPlainObject(claude.hooks)) {
    reportError(`${relPath} - claude.hooks must be a map`);
  }
  if (claude.memory !== undefined && !CLAUDE_MEMORY_SCOPES.has(claude.memory)) {
    reportError(`${relPath} - claude.memory must be one of ${Array.from(CLAUDE_MEMORY_SCOPES).join(', ')}`);
  }
  if (claude.background !== undefined && typeof claude.background !== 'boolean') {
    reportError(`${relPath} - claude.background must be a boolean`);
  }
  if (claude.isolation !== undefined && !CLAUDE_ISOLATION.has(claude.isolation)) {
    reportError(`${relPath} - claude.isolation must be one of ${Array.from(CLAUDE_ISOLATION).join(', ')}`);
  }

  const codex = data.codex || {};
  if (!isPlainObject(codex)) {
    reportError(`${relPath} - codex must be a map`);
  }
  for (const key of Object.keys(codex)) {
    if (!CODEX_FIELDS.has(key)) {
      reportError(`${relPath} - Unknown codex field: ${key}`);
    }
  }
  if (!codex.model || typeof codex.model !== 'string') {
    reportError(`${relPath} - codex.model must be a non-empty string`);
  }
  if (!codex.model_reasoning_effort || !CODEX_REASONING.has(codex.model_reasoning_effort)) {
    reportError(`${relPath} - codex.model_reasoning_effort must be one of ${Array.from(CODEX_REASONING).join(', ')}`);
  }
  if (!codex.sandbox_mode || !CODEX_SANDBOX.has(codex.sandbox_mode)) {
    reportError(`${relPath} - codex.sandbox_mode must be one of ${Array.from(CODEX_SANDBOX).join(', ')}`);
  }
  if (codex.nickname_candidates !== undefined) {
    if (validateStringArray(relPath, 'codex.nickname_candidates', codex.nickname_candidates)) {
      const seen = new Set();
      for (const nickname of codex.nickname_candidates) {
        if (!/^[A-Za-z0-9 _-]+$/.test(nickname)) {
          reportError(`${relPath} - codex.nickname_candidates entries may use only ASCII letters, digits, spaces, hyphens, and underscores`);
          break;
        }
        if (seen.has(nickname)) {
          reportError(`${relPath} - codex.nickname_candidates entries must be unique`);
          break;
        }
        seen.add(nickname);
      }
    }
  }

  validateBody(relPath, body);
}

function main() {
  if (!fs.existsSync(SUBAGENTS_DIR)) {
    console.log('No subagents directory found, skipping validation');
    process.exit(0);
  }

  const files = findSubagentFiles();
  for (const filePath of files) {
    try {
      validateSubagent(loadSubagent(filePath));
    } catch (error) {
      reportError(`${path.relative(SUBAGENTS_DIR, filePath)} - ${error.message}`);
    }
  }

  if (errors > 0) {
    process.exit(1);
  }

  console.log(`Validated ${files.length} shared subagent files`);
}

main();
