#!/usr/bin/env node
/**
 * Validates that hook paths installed in ~/.claude/settings.json are stale or valid.
 * Reads hook configurations from ~/.claude/settings.json and checks:
 * - File exists
 * - File is executable
 *
 * Exits with code 1 if any stale paths are found, 0 if all valid or no hooks configured.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

function validateHooks() {
  // If settings file doesn't exist, that's OK (hooks not configured yet)
  if (!fs.existsSync(settingsPath)) {
    console.log('[OK]    No hook configuration found in ~/.claude/settings.json');
    process.exit(0);
  }

  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (err) {
    console.error(`[ERROR] Failed to parse ~/.claude/settings.json: ${err.message}`);
    process.exit(1);
  }

  const hooks = settings.hooks ?? {};
  let staleCount = 0;
  let okCount = 0;

  for (const [event, entries] of Object.entries(hooks)) {
    // Handle both array and single-entry formats
    const entryList = Array.isArray(entries) ? entries : [entries];

    for (const entry of entryList) {
      let hookCommands = [];

      if (typeof entry === 'string') {
        // Legacy format: plain command string
        hookCommands.push(entry);
      } else if (typeof entry === 'object' && entry !== null) {
        // New nested format: entry has a "hooks" array with {type, command} objects
        if (Array.isArray(entry.hooks)) {
          for (const innerHook of entry.hooks) {
            if (innerHook.command && typeof innerHook.command === 'string') {
              hookCommands.push(innerHook.command);
            }
          }
        }
        // Backward compatibility: also check entry.command directly
        if (entry.command && typeof entry.command === 'string') {
          hookCommands.push(entry.command);
        }
      }

      // Process each command found
      for (const cmd of hookCommands) {
        // Extract the first part (the executable path)
        const hookPath = cmd.split(' ')[0];

        // Only validate absolute paths (skip bare executable names like 'cortina')
        if (!hookPath.startsWith('/')) {
          continue;
        }

        // Check existence and executability
        if (!fs.existsSync(hookPath)) {
          console.error(`[STALE] ${event} → ${hookPath} (not found)`);
          staleCount++;
        } else {
          const stats = fs.statSync(hookPath);
          const executable = (stats.mode & 0o111) !== 0;
          if (!executable) {
            console.error(`[STALE] ${event} → ${hookPath} (not executable)`);
            staleCount++;
          } else {
            console.log(`[OK]    ${event} → ${hookPath}`);
            okCount++;
          }
        }
      }
    }
  }

  // Exit with error code if any stale hooks found
  if (staleCount > 0) {
    process.exit(1);
  }

  // Success: all checked paths are valid (or no absolute paths to check)
  if (okCount === 0 && staleCount === 0) {
    console.log('[OK]    No absolute hook paths configured to validate');
  }
  process.exit(0);
}

validateHooks();
