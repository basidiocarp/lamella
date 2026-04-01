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
const { loadMarkdownFrontmatter, validateRequiresValue } = require('../lib/requires');

const SKILLS_DIR = path.join(__dirname, '../../resources/skills');

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
      const frontmatter = loadMarkdownFrontmatter(skillMd);
      if (!frontmatter) {
        console.warn(`WARN: ${skillName}/SKILL.md - Missing frontmatter (should have at least 'description')`);
        warnCount++;
      } else {
        if (!frontmatter.description || !frontmatter.description.trim()) {
          console.warn(`WARN: ${skillName}/SKILL.md - Missing 'description' in frontmatter`);
          warnCount++;
        }
        validateRequiresValue(`${skillName}/SKILL.md`, frontmatter.requires, (message) => {
          console.error(`ERROR: ${message}`);
          hasErrors = true;
        });
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
