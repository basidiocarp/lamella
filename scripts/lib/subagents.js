const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const SUBAGENTS_DIR = path.join(ROOT_DIR, 'resources', 'subagents');

function stripBom(content) {
  return content.replace(/^\uFEFF/, '');
}

function extractFrontmatterAndBody(content) {
  const clean = stripBom(content);
  const match = clean.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return null;
  }
  return { frontmatterText: match[1], body: match[2].trim() };
}

function countIndent(line) {
  const match = line.match(/^ */);
  return match ? match[0].length : 0;
}

function parseScalar(raw) {
  const value = raw.trim();
  if (value === '') return '';
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+$/.test(value)) return Number.parseInt(value, 10);
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((item) => parseScalar(item.trim()));
  }
  return value;
}

function parseList(lines, start, indent) {
  const items = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const lineIndent = countIndent(line);
    if (lineIndent < indent) break;
    if (lineIndent !== indent || !line.trimStart().startsWith('- ')) break;

    const raw = line.trimStart().slice(2);
    items.push(parseScalar(raw));
    index += 1;
  }

  return { value: items, nextIndex: index };
}

function parseMap(lines, start, indent) {
  const out = {};
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const lineIndent = countIndent(line);
    if (lineIndent < indent) break;
    if (lineIndent !== indent) {
      throw new Error(`Unexpected indentation at line ${index + 1}`);
    }

    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex <= 0) {
      throw new Error(`Invalid frontmatter entry at line ${index + 1}`);
    }

    const key = trimmed.slice(0, colonIndex).trim();
    const rawValue = trimmed.slice(colonIndex + 1).trim();

    if (rawValue) {
      out[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    let lookahead = index + 1;
    while (lookahead < lines.length && !lines[lookahead].trim()) {
      lookahead += 1;
    }

    if (lookahead >= lines.length) {
      out[key] = {};
      index = lookahead;
      continue;
    }

    const nextLine = lines[lookahead];
    const nextIndent = countIndent(nextLine);

    if (nextIndent <= indent) {
      out[key] = {};
      index = lookahead;
      continue;
    }

    if (nextLine.trimStart().startsWith('- ')) {
      const parsed = parseList(lines, lookahead, nextIndent);
      out[key] = parsed.value;
      index = parsed.nextIndex;
      continue;
    }

    const parsed = parseMap(lines, lookahead, nextIndent);
    out[key] = parsed.value;
    index = parsed.nextIndex;
  }

  return { value: out, nextIndex: index };
}

function parseFrontmatter(frontmatterText) {
  const lines = frontmatterText.replace(/\r/g, '').split('\n');
  return parseMap(lines, 0, 0).value;
}

function findSubagentFiles(rootDir = SUBAGENTS_DIR) {
  const results = [];
  if (!fs.existsSync(rootDir)) return results;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === 'SUBAGENT.md') {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results.sort();
}

function loadSubagent(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const extracted = extractFrontmatterAndBody(raw);
  if (!extracted) {
    throw new Error(`Missing valid frontmatter in ${filePath}`);
  }

  const data = parseFrontmatter(extracted.frontmatterText);
  const relPath = path.relative(SUBAGENTS_DIR, filePath);
  const parts = relPath.split(path.sep);
  if (parts.length < 3) {
    throw new Error(`Unexpected subagent path: ${relPath}`);
  }

  return {
    filePath,
    relPath,
    categoryDir: parts[0],
    subagentDir: parts[1],
    data,
    body: extracted.body,
  };
}

function normalizeDistributionTargets(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return [value];
  }
  return [];
}

function formatYamlScalar(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  const stringValue = String(value);
  if (/^[A-Za-z0-9_.-]+$/.test(stringValue)) {
    return stringValue;
  }
  return `"${stringValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function appendYamlField(lines, key, value, indent = 0) {
  const pad = ' '.repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push(`${pad}${key}: []`);
      return;
    }

    lines.push(`${pad}${key}:`);
    for (const item of value) {
      if (Array.isArray(item) || (typeof item === 'object' && item !== null)) {
        throw new Error(`Unsupported nested array/object item for YAML field '${key}'`);
      }
      lines.push(`${pad}  - ${formatYamlScalar(item)}`);
    }
    return;
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      lines.push(`${pad}${key}: {}`);
      return;
    }

    lines.push(`${pad}${key}:`);
    for (const [childKey, childValue] of entries) {
      appendYamlField(lines, childKey, childValue, indent + 2);
    }
    return;
  }

  lines.push(`${pad}${key}: ${formatYamlScalar(value)}`);
}

function toClaudeMarkdown(subagent) {
  const { data, body } = subagent;
  const claude = data.claude || {};
  const frontmatter = ['---'];

  appendYamlField(frontmatter, 'name', data.name);
  appendYamlField(frontmatter, 'description', data.description);
  if (Array.isArray(data.requires) && data.requires.length > 0) {
    appendYamlField(frontmatter, 'requires', data.requires);
  }
  if (claude.model) appendYamlField(frontmatter, 'model', claude.model);
  if (claude.color) appendYamlField(frontmatter, 'color', claude.color);
  if (Array.isArray(claude.tools) && claude.tools.length > 0) {
    appendYamlField(frontmatter, 'tools', claude.tools);
  }

  const orderedExtras = ['disallowedTools', 'permissionMode', 'maxTurns', 'skills', 'mcpServers', 'hooks', 'memory', 'background', 'isolation'];
  for (const key of orderedExtras) {
    if (claude[key] === undefined) continue;
    appendYamlField(frontmatter, key, claude[key]);
  }

  frontmatter.push('---', '', body.trim(), '');
  return frontmatter.join('\n');
}

function toTomlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function toCodexToml(subagent) {
  const { data, body } = subagent;
  const codex = data.codex || {};
  const lines = [
    `name = ${toTomlString(data.name)}`,
    `description = ${toTomlString(data.description)}`,
  ];

  const scalarKeys = ['model', 'model_reasoning_effort', 'sandbox_mode'];
  for (const key of scalarKeys) {
    if (codex[key]) {
      lines.push(`${key} = ${toTomlString(codex[key])}`);
    }
  }

  if (Array.isArray(codex.nickname_candidates) && codex.nickname_candidates.length > 0) {
    const items = codex.nickname_candidates.map((item) => toTomlString(item)).join(', ');
    lines.push(`nickname_candidates = [${items}]`);
  }

  lines.push('developer_instructions = """');
  lines.push(body.trim());
  lines.push('"""');
  lines.push('');

  return lines.join('\n');
}

module.exports = {
  ROOT_DIR,
  SUBAGENTS_DIR,
  extractFrontmatterAndBody,
  findSubagentFiles,
  loadSubagent,
  parseFrontmatter,
  toClaudeMarkdown,
  toCodexToml,
  normalizeDistributionTargets,
};
