#!/usr/bin/env node
/**
 * Validate skill directories have SKILL.md with required structure.
 *
 * Per Claude Code docs (docs/reference/plugins.md / docs/reference/plugin-reference.md):
 *   Skills are directories with SKILL.md files.
 *   SKILL.md should have YAML frontmatter with at least a 'description' field.
 *   Optional frontmatter: disable-model-invocation, hooks, context, etc.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../../resources/skills');

function extractFrontmatter(content) {
  const cleanContent = content.replace(/^\uFEFF/, '');
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // Handle YAML multiline scalars (indented continuation lines)
      if (!value) {
        const parts = [];
        while (i + 1 < lines.length && /^\s/.test(lines[i + 1])) {
          i++;
          parts.push(lines[i].trim());
        }
        value = parts.join(' ');
      }
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function validateSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('No skills directory found, skipping validation');
    process.exit(0);
  }

  // Two-level structure: skills/category/skill-name/SKILL.md
  const categories = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory());
  let hasErrors = false;
  let warnCount = 0;
  let validCount = 0;

  for (const category of categories) {
    const categoryPath = path.join(SKILLS_DIR, category.name);
    const skillDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(e => e.isDirectory());

    for (const skillDir of skillDirs) {
      const skillName = `${category.name}/${skillDir.name}`;
      const skillMd = path.join(categoryPath, skillDir.name, 'SKILL.md');
      if (!fs.existsSync(skillMd)) {
        console.error(`ERROR: ${skillName}/ - Missing SKILL.md`);
        hasErrors = true;
        continue;
      }

      let content;
      try {
        content = fs.readFileSync(skillMd, 'utf-8');
      } catch (err) {
        console.error(`ERROR: ${skillName}/SKILL.md - ${err.message}`);
        hasErrors = true;
        continue;
      }
      if (content.trim().length === 0) {
        console.error(`ERROR: ${skillName}/SKILL.md - Empty file`);
        hasErrors = true;
        continue;
      }

      // Validate frontmatter
      const frontmatter = extractFrontmatter(content);
      if (!frontmatter) {
        console.warn(`WARN: ${skillName}/SKILL.md - Missing frontmatter (should have at least 'description')`);
        warnCount++;
      } else if (!frontmatter.description || !frontmatter.description.trim()) {
        console.warn(`WARN: ${skillName}/SKILL.md - Missing 'description' in frontmatter`);
        warnCount++;
      }

      validCount++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  let msg = `Validated ${validCount} skill directories`;
  if (warnCount > 0) {
    msg += ` (${warnCount} warnings)`;
  }
  console.log(msg);
}

validateSkills();
