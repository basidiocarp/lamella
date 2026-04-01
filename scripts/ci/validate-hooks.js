#!/usr/bin/env node
/**
 * Validate hooks.json schema.
 *
 * Per Claude Code docs (docs/reference/hooks.md):
 *   Valid events: SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest,
 *     PostToolUse, PostToolUseFailure, Notification, SubagentStart, SubagentStop,
 *     Stop, TeammateIdle, TaskCompleted, InstructionsLoaded, ConfigChange,
 *     WorktreeCreate, WorktreeRemove, PreCompact, PostCompact,
 *     Elicitation, ElicitationResult, SessionEnd
 *   Hook types: command, http, prompt, agent
 *   Matcher: optional (omitted or "*" or "" matches everything)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { validateRequiresValue } = require('../lib/requires');

const HOOKS_ROOT = path.join(__dirname, '../../resources/hooks');
const HOOK_SCRIPTS_DIR = path.join(__dirname, '../../scripts/hooks');
const HOOK_CONFIG_FILENAMES = new Set(['hooks.json', 'settings.json', 'hooks-minimal.json']);
const VALID_EVENTS = [
  'SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PermissionRequest',
  'PostToolUse', 'PostToolUseFailure', 'Notification',
  'SubagentStart', 'SubagentStop', 'Stop',
  'TeammateIdle', 'TaskCompleted', 'InstructionsLoaded', 'ConfigChange',
  'WorktreeCreate', 'WorktreeRemove',
  'PreCompact', 'PostCompact',
  'Elicitation', 'ElicitationResult', 'SessionEnd',
];
const VALID_HOOK_TYPES = ['command', 'http', 'prompt', 'agent'];
let errors = 0;

function reportError(message) {
  console.error(message);
  errors++;
}

function collectCommands(node, commands = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectCommands(item, commands);
    return commands;
  }

  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'command' && typeof value === 'string') {
        commands.push(value);
      }
      collectCommands(value, commands);
    }
  }

  return commands;
}

function getCommandScriptCandidates(filePath, relativeScriptPath) {
  if (relativeScriptPath.startsWith('scripts/hooks/')) {
    return [path.join(HOOK_SCRIPTS_DIR, relativeScriptPath.slice('scripts/hooks/'.length))];
  }

  if (relativeScriptPath.startsWith('hooks/scripts/')) {
    const bundleDir = path.dirname(filePath);
    const scriptName = relativeScriptPath.slice('hooks/scripts/'.length);
    return [
      path.join(bundleDir, 'scripts', scriptName),
      path.join(bundleDir, scriptName),
    ];
  }

  if (relativeScriptPath.startsWith('project-scripts/')) {
    const bundleDir = path.dirname(filePath);
    const scriptName = relativeScriptPath.slice('project-scripts/'.length);
    return [path.join(bundleDir, 'project-scripts', scriptName)];
  }

  return [];
}

function validateReferencedScripts(commands, filePath, label) {
  const scriptPattern = /\$\{CLAUDE_PLUGIN_ROOT\}\/((?:scripts\/hooks|hooks\/scripts|project-scripts)\/[A-Za-z0-9._/-]+\.(?:js|sh|py))|\$HOME\/\.claude\/hooks\/(scripts\/[A-Za-z0-9._/-]+\.(?:js|sh|py))/g;

  for (const command of commands) {
    for (const match of command.matchAll(scriptPattern)) {
      const relativeScriptPath = match[1] || match[2];
      const normalizedPath = relativeScriptPath.startsWith('scripts/hooks/')
        ? relativeScriptPath
        : relativeScriptPath.replace(/^scripts\//, 'scripts/hooks/');
      const candidates = getCommandScriptCandidates(filePath, normalizedPath);
      if (!candidates.some(candidate => fs.existsSync(candidate))) {
        reportError(`ERROR: ${label} references missing hook script '${relativeScriptPath}'`);
      }
    }
  }
}

function findHookConfigFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHookConfigFiles(fullPath, files);
      continue;
    }

    if (HOOK_CONFIG_FILENAMES.has(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Validate a single hook entry has required fields based on its type.
 *
 * Hook types and their required fields:
 *   command: type, command
 *   http:    type, url
 *   prompt:  type, prompt
 *   agent:   type, prompt
 *
 * Common optional fields: timeout, statusMessage, once
 */
function validateHookEntry(hook, label) {
  let hasErrors = false;

  if (!hook.type || typeof hook.type !== 'string') {
    console.error(`ERROR: ${label} missing or invalid 'type' field`);
    hasErrors = true;
    return hasErrors;
  }

  if (!VALID_HOOK_TYPES.includes(hook.type)) {
    console.error(`ERROR: ${label} invalid type '${hook.type}'. Must be one of: ${VALID_HOOK_TYPES.join(', ')}`);
    hasErrors = true;
    return hasErrors;
  }

  // Validate optional common fields
  if ('async' in hook && typeof hook.async !== 'boolean') {
    console.error(`ERROR: ${label} 'async' must be a boolean`);
    hasErrors = true;
  }
  if ('timeout' in hook && (typeof hook.timeout !== 'number' || hook.timeout < 0)) {
    console.error(`ERROR: ${label} 'timeout' must be a non-negative number`);
    hasErrors = true;
  }
  if (!validateRequiresValue(label, hook.requires, (message) => console.error(`ERROR: ${message}`))) {
    hasErrors = true;
  }

  // Type-specific validation
  switch (hook.type) {
    case 'command': {
      if (!hook.command || (typeof hook.command !== 'string' && !Array.isArray(hook.command)) || (typeof hook.command === 'string' && !hook.command.trim()) || (Array.isArray(hook.command) && (hook.command.length === 0 || !hook.command.every(s => typeof s === 'string' && s.length > 0)))) {
        console.error(`ERROR: ${label} missing or invalid 'command' field`);
        hasErrors = true;
      } else if (typeof hook.command === 'string') {
        // Validate inline JS syntax in node -e commands
        const nodeEMatch = hook.command.match(/^node -e "(.*)"$/s);
        if (nodeEMatch) {
          try {
            new vm.Script(nodeEMatch[1].replace(/\\\\/g, '\\').replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t'));
          } catch (syntaxErr) {
            console.error(`ERROR: ${label} has invalid inline JS: ${syntaxErr.message}`);
            hasErrors = true;
          }
        }
      }
      break;
    }
    case 'http': {
      if (!hook.url || typeof hook.url !== 'string' || !hook.url.trim()) {
        console.error(`ERROR: ${label} missing or invalid 'url' field`);
        hasErrors = true;
      }
      break;
    }
    case 'prompt':
    case 'agent': {
      if (!hook.prompt || typeof hook.prompt !== 'string' || !hook.prompt.trim()) {
        console.error(`ERROR: ${label} missing or invalid 'prompt' field`);
        hasErrors = true;
      }
      break;
    }
  }

  return hasErrors;
}

function validateHookConfig(filePath, label) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Invalid JSON in ${label}: ${e.message}`);
    return { hasErrors: true, totalMatchers: 0 };
  }

  // Support both object format { hooks: {...} } and array format
  const hooks = data.hooks || data;
  let hasErrors = false;
  let totalMatchers = 0;
  const startingErrors = errors;

  if (typeof hooks === 'object' && !Array.isArray(hooks)) {
    // Object format: { EventType: [matchers] }
    for (const [eventType, matchers] of Object.entries(hooks)) {
      if (!VALID_EVENTS.includes(eventType)) {
        console.error(`ERROR: Invalid event type: ${eventType}`);
        hasErrors = true;
        continue;
      }

      if (!Array.isArray(matchers)) {
        console.error(`ERROR: ${eventType} must be an array`);
        hasErrors = true;
        continue;
      }

      for (let i = 0; i < matchers.length; i++) {
        const matcher = matchers[i];
        if (typeof matcher !== 'object' || matcher === null) {
          console.error(`ERROR: ${eventType}[${i}] is not an object`);
          hasErrors = true;
          continue;
        }
        // matcher field is optional — omitting it or using "*" or "" matches all
        if (!matcher.hooks || !Array.isArray(matcher.hooks)) {
          console.error(`ERROR: ${eventType}[${i}] missing 'hooks' array`);
          hasErrors = true;
        } else {
          // Validate each hook entry
          for (let j = 0; j < matcher.hooks.length; j++) {
            if (validateHookEntry(matcher.hooks[j], `${eventType}[${i}].hooks[${j}]`)) {
              hasErrors = true;
            }
          }
        }
        totalMatchers++;
      }
    }
  } else if (Array.isArray(hooks)) {
    // Array format (legacy)
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      if (!hook.matcher) {
        console.error(`ERROR: Hook ${i} missing 'matcher' field`);
        hasErrors = true;
      }
      if (!hook.hooks || !Array.isArray(hook.hooks)) {
        console.error(`ERROR: Hook ${i} missing 'hooks' array`);
        hasErrors = true;
      } else {
        // Validate each hook entry
        for (let j = 0; j < hook.hooks.length; j++) {
          if (validateHookEntry(hook.hooks[j], `Hook ${i}.hooks[${j}]`)) {
            hasErrors = true;
          }
        }
      }
      totalMatchers++;
    }
  } else {
    console.error(`ERROR: ${label} must be an object or array`);
    return { hasErrors: true, totalMatchers };
  }

  validateReferencedScripts(collectCommands(hooks), filePath, label);
  if (errors > startingErrors) {
    hasErrors = true;
  }

  return { hasErrors, totalMatchers };
}

function validateHooks() {
  const files = findHookConfigFiles(HOOKS_ROOT)
    .sort((a, b) => a.localeCompare(b))
    .map(filePath => [filePath, path.relative(path.join(__dirname, '../..'), filePath)]);

  let totalMatchers = 0;
  let hasErrors = false;

  for (const [filePath, label] of files) {
    if (!fs.existsSync(filePath)) {
      console.log(`No ${label} found, skipping`);
      continue;
    }

    const result = validateHookConfig(filePath, label);
    totalMatchers += result.totalMatchers;
    hasErrors = hasErrors || result.hasErrors;
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${totalMatchers} hook matchers`);
}

validateHooks();
