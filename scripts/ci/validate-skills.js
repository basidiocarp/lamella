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
const { listSkillDirs, validateSkillFrontmatter } = require('../lib/skill-packages');

function validateSkills() {
  const skillDirs = listSkillDirs();
  if (skillDirs.length === 0) {
    console.log('No skills directory found, skipping validation');
    process.exit(0);
  }

  let hasErrors = false;
  let warnCount = 0;
  let validCount = 0;

  for (const skill of skillDirs) {
    validateSkillFrontmatter(
      skill,
      (message) => {
        console.error(`ERROR: ${message}`);
        hasErrors = true;
      },
      (message) => {
        console.warn(`WARN: ${message}`);
        warnCount += 1;
      },
    );
    validCount += 1;
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
