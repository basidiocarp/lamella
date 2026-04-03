#!/usr/bin/env node
/**
 * Validate preset TOML files in resources/presets/.
 *
 * Checks:
 *   - All .toml files parse correctly (basic structure validation)
 *   - [preset].name matches the filename (without .toml)
 *   - [preset].requires contains only valid tool names
 *   - [skills].activate entries reference skills that exist in resources/skills/
 *   - [agents] entries have valid structure
 */

const fs = require('fs');
const path = require('path');
const { VALID_REQUIRED_TOOLS_SET, VALID_REQUIRED_TOOLS } = require('../lib/requires');
const { CONTENT_ROOT } = require('../lib/content-root');

const PRESETS_DIR = path.join(CONTENT_ROOT, 'presets');
const SKILLS_DIR = path.join(CONTENT_ROOT, 'skills');

let hasErrors = false;

function reportError(msg) {
  console.error(`ERROR: ${msg}`);
  hasErrors = true;
}

function reportWarn(msg) {
  console.warn(`WARN: ${msg}`);
}

/**
 * Minimal TOML parser that handles the subset used by preset files:
 *   - [section] headers
 *   - key = "string"
 *   - key = ["array", "of", "strings"]
 *   - key = true/false
 *   - Multi-line arrays with trailing commas
 *   - Inline tables: key = { k1 = "v1", k2 = "v2" }
 */
function parsePresetToml(content, filePath) {
  const result = {};
  let currentSection = null;
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].replace(/#.*$/, '').trim();
    i++;

    if (!line) continue;

    // Section header
    const sectionMatch = line.match(/^\[([a-zA-Z_][a-zA-Z0-9_]*)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      if (!result[currentSection]) {
        result[currentSection] = {};
      }
      continue;
    }

    if (!currentSection) continue;

    // Key = value
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);
    if (!kvMatch) continue;

    const [, key, rawValue] = kvMatch;
    const value = rawValue.trim();

    // Boolean
    if (value === 'true' || value === 'false') {
      result[currentSection][key] = value === 'true';
      continue;
    }

    // Quoted string
    if (value.startsWith('"') && value.endsWith('"')) {
      result[currentSection][key] = value.slice(1, -1);
      continue;
    }

    // Inline table
    if (value.startsWith('{') && value.endsWith('}')) {
      const tableContent = value.slice(1, -1).trim();
      const entries = {};
      for (const pair of tableContent.split(',')) {
        const pairMatch = pair.trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*"?([^"]*)"?$/);
        if (pairMatch) {
          entries[pairMatch[1]] = pairMatch[2];
        }
      }
      result[currentSection][key] = entries;
      continue;
    }

    // Inline array on one line
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      if (!inner) {
        result[currentSection][key] = [];
      } else {
        result[currentSection][key] = inner
          .split(',')
          .map(s => s.trim().replace(/^"|"$/g, ''))
          .filter(s => s.length > 0);
      }
      continue;
    }

    // Multi-line array
    if (value === '[' || (value.startsWith('[') && !value.endsWith(']'))) {
      const items = [];
      // Collect items from current line if any
      if (value.length > 1) {
        const partial = value.slice(1).trim();
        if (partial) {
          for (const item of partial.split(',')) {
            const cleaned = item.trim().replace(/^"|"$/g, '').replace(/,$/, '');
            if (cleaned) items.push(cleaned);
          }
        }
      }
      // Read subsequent lines until closing bracket
      while (i < lines.length) {
        const arrayLine = lines[i].replace(/#.*$/, '').trim();
        i++;
        if (arrayLine === ']' || arrayLine === '],') break;
        if (!arrayLine) continue;
        for (const item of arrayLine.split(',')) {
          const cleaned = item.trim().replace(/^"|"$/g, '').replace(/,$/, '');
          if (cleaned && cleaned !== ']') items.push(cleaned);
        }
      }
      result[currentSection][key] = items;
      continue;
    }

    // Unquoted string
    result[currentSection][key] = value;
  }

  return result;
}

/**
 * Build a set of all skill directory names across all categories.
 */
function collectSkillNames() {
  const names = new Set();
  if (!fs.existsSync(SKILLS_DIR)) return names;

  const categories = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const category of categories) {
    const categoryPath = path.join(SKILLS_DIR, category.name);
    const skills = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(e => e.isDirectory());
    for (const skill of skills) {
      names.add(skill.name);
    }
  }

  return names;
}

function validatePresets() {
  if (!fs.existsSync(PRESETS_DIR)) {
    console.log('No presets directory found, skipping validation');
    process.exit(0);
  }

  const presetFiles = fs.readdirSync(PRESETS_DIR)
    .filter(f => f.endsWith('.toml'));

  if (presetFiles.length === 0) {
    console.log('No preset files found, skipping validation');
    process.exit(0);
  }

  const skillNames = collectSkillNames();
  let validCount = 0;

  for (const file of presetFiles) {
    const filePath = path.join(PRESETS_DIR, file);
    const expectedName = file.replace(/\.toml$/, '');

    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      reportError(`${file} - Failed to read: ${err.message}`);
      continue;
    }

    if (content.trim().length === 0) {
      reportError(`${file} - Empty preset file`);
      continue;
    }

    // Parse TOML
    let parsed;
    try {
      parsed = parsePresetToml(content, filePath);
    } catch (err) {
      reportError(`${file} - Failed to parse TOML: ${err.message}`);
      continue;
    }

    // Validate [preset] section exists
    if (!parsed.preset) {
      reportError(`${file} - Missing [preset] section`);
      continue;
    }

    // Validate name matches filename
    if (!parsed.preset.name) {
      reportError(`${file} - Missing [preset].name`);
    } else if (parsed.preset.name !== expectedName) {
      reportError(`${file} - [preset].name "${parsed.preset.name}" does not match filename "${expectedName}"`);
    }

    // Validate description exists
    if (!parsed.preset.description) {
      reportError(`${file} - Missing [preset].description`);
    }

    // Validate requires contains only valid tool names
    const requires = parsed.preset.requires;
    if (requires !== undefined) {
      if (!Array.isArray(requires)) {
        reportError(`${file} - [preset].requires must be an array`);
      } else {
        const seen = new Set();
        for (const tool of requires) {
          if (typeof tool !== 'string' || tool.trim() === '') {
            reportError(`${file} - [preset].requires entries must be non-empty strings`);
          } else if (!VALID_REQUIRED_TOOLS_SET.has(tool)) {
            reportError(`${file} - [preset].requires entry '${tool}' must be one of: ${VALID_REQUIRED_TOOLS.join(', ')}`);
          } else if (seen.has(tool)) {
            reportError(`${file} - [preset].requires has duplicate entry '${tool}'`);
          }
          seen.add(tool);
        }
      }
    }

    // Validate skills.activate references existing skills
    if (parsed.skills && parsed.skills.activate) {
      const activate = parsed.skills.activate;
      if (!Array.isArray(activate)) {
        reportError(`${file} - [skills].activate must be an array`);
      } else {
        for (const skill of activate) {
          if (!skillNames.has(skill)) {
            reportError(`${file} - [skills].activate references unknown skill '${skill}' (not found in resources/skills/)`);
          }
        }
      }
    }

    // Validate agents have subagent_type and model
    if (parsed.agents) {
      for (const [agentKey, agentValue] of Object.entries(parsed.agents)) {
        if (typeof agentValue !== 'object' || agentValue === null) {
          reportError(`${file} - [agents].${agentKey} must be an inline table`);
          continue;
        }
        if (!agentValue.subagent_type) {
          reportWarn(`${file} - [agents].${agentKey} missing subagent_type`);
        }
        if (!agentValue.model) {
          reportWarn(`${file} - [agents].${agentKey} missing model`);
        }
      }
    }

    validCount++;
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${validCount} preset files`);
}

validatePresets();
