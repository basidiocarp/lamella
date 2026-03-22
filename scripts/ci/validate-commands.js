#!/usr/bin/env node
/**
 * Validate command markdown files are non-empty, readable,
 * and have valid cross-references to other commands, agents, and skills.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../..');
const COMMANDS_DIR = path.join(ROOT_DIR, 'resources', 'commands');
const AGENTS_DIR = path.join(ROOT_DIR, 'resources', 'agents');
const SKILLS_DIR = path.join(ROOT_DIR, 'resources', 'skills');

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

/** Recursively find all subdirectory names at leaf level */
// Collect all skill directory names at the skill level (depth 2: category/skill-name)
function findSkillDirs(dir) {
  const results = new Set();
  if (!fs.existsSync(dir)) return results;
  for (const category of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!category.isDirectory() || category.name.startsWith('.')) continue;
    const catPath = path.join(dir, category.name);
    for (const skill of fs.readdirSync(catPath, { withFileTypes: true })) {
      if (skill.isDirectory() && !skill.name.startsWith('.')) {
        results.add(skill.name);
      }
    }
  }
  return results;
}

// Built-in Claude Code commands and common HTTP endpoints that are NOT custom
// slash commands.  The validator should skip these when checking cross-references.
const ALLOWLISTED_REFS = new Set([
  // Built-in Claude Code commands
  'help', 'mcp', 'init', 'config', 'status', 'clear', 'compact', 'cost',
  'doctor', 'login', 'logout', 'memory', 'model', 'permissions', 'review',
  'terminal-setup', 'vim',
  // Common HTTP endpoints / routes (appear in examples & route-mapping tables)
  'api', 'health', 'ready', 'up', 'users', 'settings', 'dashboard',
  'checkout', 'login', 'logout',
]);

function validateCommands() {
  if (!fs.existsSync(COMMANDS_DIR)) {
    console.log('No commands directory found, skipping validation');
    process.exit(0);
  }

  const files = findMdFiles(COMMANDS_DIR);
  let hasErrors = false;
  let warnCount = 0;

  // Build set of valid command names (without .md extension)
  const validCommands = new Set(files.map(f => path.basename(f).replace(/\.md$/, '')));

  // Build set of valid agent names (without .md extension)
  const validAgents = new Set();
  for (const f of findMdFiles(AGENTS_DIR)) {
    validAgents.add(path.basename(f).replace(/\.md$/, ''));
  }

  // Build set of valid skill directory names (leaf-level)
  const validSkills = findSkillDirs(SKILLS_DIR);

  for (const filePath of files) {
    const relPath = path.relative(COMMANDS_DIR, filePath);
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.error(`ERROR: ${relPath} - ${err.message}`);
      hasErrors = true;
      continue;
    }

    // Validate the file is non-empty readable markdown
    if (content.trim().length === 0) {
      console.error(`ERROR: ${relPath} - Empty command file`);
      hasErrors = true;
      continue;
    }

    // Strip fenced code blocks before checking cross-references.
    // Examples/templates inside ``` blocks are not real references.
    const contentNoCodeBlocks = content.replace(/```[\s\S]*?```/g, '');

    // Check cross-references to other commands (e.g., `/build-fix`)
    // Skip lines that describe hypothetical output (e.g., "→ Creates: `/new-table`")
    // Process line-by-line so ALL command refs per line are captured
    // (previous anchored regex /^.*`\/...`.*$/gm only matched the last ref per line)
    for (const line of contentNoCodeBlocks.split('\n')) {
      if (/creates:|would create:/i.test(line)) continue;
      const lineRefs = line.matchAll(/`\/([a-z][-a-z0-9]*)`/g);
      for (const match of lineRefs) {
        const refName = match[1];
        if (!validCommands.has(refName) && !ALLOWLISTED_REFS.has(refName)) {
          console.error(`ERROR: ${relPath} - references non-existent command /${refName}`);
          hasErrors = true;
        }
      }
    }

    // Check agent references (e.g., "resources/agents/planner.md" or "`planner` agent")
    const agentPathRefs = contentNoCodeBlocks.matchAll(/resources\/agents\/([a-z][-a-z0-9]*)\.md/g);
    for (const match of agentPathRefs) {
      const refName = match[1];
      if (!validAgents.has(refName)) {
        console.error(`ERROR: ${relPath} - references non-existent agent resources/agents/${refName}.md`);
        hasErrors = true;
      }
    }

    // Check skill directory references (e.g., "resources/skills/category/skill-name/")
    const skillRefs = contentNoCodeBlocks.matchAll(/resources\/skills\/([a-z][-a-z0-9]*)\/([a-z][-a-z0-9]*)\//g);
    for (const match of skillRefs) {
      const refName = match[2];
      if (!validSkills.has(refName)) {
        console.warn(`WARN: ${relPath} - references skill directory resources/skills/${match[1]}/${refName}/ (not found locally)`);
        warnCount++;
      }
    }

    // Check agent name references in workflow diagrams (e.g., "planner -> tdd-guide")
    const workflowLines = contentNoCodeBlocks.matchAll(/^([a-z][-a-z0-9]*(?:\s*->\s*[a-z][-a-z0-9]*)+)$/gm);
    for (const match of workflowLines) {
      const agents = match[1].split(/\s*->\s*/);
      for (const agent of agents) {
        if (!validAgents.has(agent)) {
          console.error(`ERROR: ${relPath} - workflow references non-existent agent "${agent}"`);
          hasErrors = true;
        }
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  let msg = `Validated ${files.length} command files`;
  if (warnCount > 0) {
    msg += ` (${warnCount} warnings)`;
  }
  console.log(msg);
}

validateCommands();
