const fs = require('fs');
const path = require('path');
const { extractFrontmatterAndBody } = require('./subagents');

const VALID_REQUIRED_TOOLS = [
  'mycelium',
  'hyphae',
  'rhizome',
  'cortina',
  'canopy',
  'spore',
  'stipe',
];

const VALID_REQUIRED_TOOLS_SET = new Set(VALID_REQUIRED_TOOLS);

function loadMarkdownFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const extracted = extractFrontmatterAndBody(content);
  if (!extracted) {
    return null;
  }

  const out = {};
  const lines = extracted.frontmatterText.replace(/\r/g, '').split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || /^\s/.test(line)) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      const inner = rawValue.slice(1, -1).trim();
      out[key] = inner ? inner.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')) : [];
      continue;
    }

    if (rawValue !== '') {
      out[key] = rawValue.replace(/^['"]|['"]$/g, '');
      continue;
    }

    const values = [];
    let lookahead = index + 1;
    while (lookahead < lines.length) {
      const nextLine = lines[lookahead];
      if (!nextLine.trim()) {
        lookahead += 1;
        continue;
      }
      if (!/^\s+/.test(nextLine)) {
        break;
      }

      const listMatch = nextLine.match(/^\s*-\s*(.+?)\s*$/);
      if (!listMatch) {
        break;
      }

      values.push(listMatch[1].replace(/^['"]|['"]$/g, ''));
      lookahead += 1;
    }

    if (values.length > 0) {
      out[key] = values;
      index = lookahead - 1;
      continue;
    }

    out[key] = '';
  }

  return out;
}

function normalizeRequires(value) {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  return value;
}

function validateRequiresValue(relPath, value, reportError, fieldName = 'requires') {
  const normalized = normalizeRequires(value);
  if (normalized === null) {
    reportError(`${relPath} - ${fieldName} must be an array of tool names`);
    return false;
  }

  const seen = new Set();
  let ok = true;

  for (const item of normalized) {
    if (typeof item !== 'string' || item.trim() === '') {
      reportError(`${relPath} - ${fieldName} entries must be non-empty strings`);
      ok = false;
      continue;
    }

    if (!VALID_REQUIRED_TOOLS_SET.has(item)) {
      reportError(`${relPath} - ${fieldName} entry '${item}' must be one of ${VALID_REQUIRED_TOOLS.join(', ')}`);
      ok = false;
      continue;
    }

    if (seen.has(item)) {
      reportError(`${relPath} - ${fieldName} entries must be unique`);
      ok = false;
      continue;
    }

    seen.add(item);
  }

  return ok;
}

function requirementsSatisfied(requires, detectedTools, ignoreRequires = false) {
  if (ignoreRequires) {
    return true;
  }

  const normalized = normalizeRequires(requires);
  if (!normalized || normalized.length === 0) {
    return true;
  }

  for (const requiredTool of normalized) {
    if (!detectedTools.has(requiredTool)) {
      return false;
    }
  }

  return true;
}

function describeRequires(requires) {
  const normalized = normalizeRequires(requires);
  if (!normalized || normalized.length === 0) {
    return '';
  }

  return normalized.join(', ');
}

function pathLabel(baseDir, filePath) {
  return path.relative(baseDir, filePath).split(path.sep).join('/');
}

module.exports = {
  VALID_REQUIRED_TOOLS,
  VALID_REQUIRED_TOOLS_SET,
  loadMarkdownFrontmatter,
  normalizeRequires,
  validateRequiresValue,
  requirementsSatisfied,
  describeRequires,
  pathLabel,
};
