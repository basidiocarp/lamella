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

const HOOKS_FILE = path.join(__dirname, '../../hooks/hooks.json');
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

function validateHooks() {
  if (!fs.existsSync(HOOKS_FILE)) {
    console.log('No hooks.json found, skipping validation');
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(HOOKS_FILE, 'utf-8'));
  } catch (e) {
    console.error(`ERROR: Invalid JSON in hooks.json: ${e.message}`);
    process.exit(1);
  }

  // Support both object format { hooks: {...} } and array format
  const hooks = data.hooks || data;
  let hasErrors = false;
  let totalMatchers = 0;

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
    console.error('ERROR: hooks.json must be an object or array');
    process.exit(1);
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${totalMatchers} hook matchers`);
}

validateHooks();
