#!/usr/bin/env node
/**
 * Validate Lamella skill/package seams:
 * - skill frontmatter shape and directory alignment
 * - manifest skill references target valid skills
 * - checked-in Codex manifests stay aligned with Claude source manifests
 */

const {
  listSkillDirs,
  validateManifestAlignment,
  validateSkillFrontmatter,
} = require('../lib/skill-packages');

let errors = 0;
let warnings = 0;
let validatedSkills = 0;
let alignedManifests = 0;

function error(message) {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

function warn(message) {
  console.warn(`WARN: ${message}`);
  warnings += 1;
}

function main() {
  const skills = listSkillDirs();
  if (skills.length === 0) {
    console.log('No skills directory found, skipping package validation');
    process.exit(0);
  }

  const skillIndex = new Map();
  for (const skill of skills) {
    const result = validateSkillFrontmatter(skill, error, warn);
    const frontmatter = result?.frontmatter ?? null;
    skillIndex.set(skill.relPath, { ...skill, frontmatter });
    validatedSkills += 1;
  }

  alignedManifests = validateManifestAlignment(skillIndex, error, warn);

  if (errors > 0) {
    console.error(`\n${errors} error(s) found`);
    process.exit(1);
  }

  let summary = `Validated ${validatedSkills} Lamella skill packages and ${alignedManifests} manifest alignments`;
  if (warnings > 0) {
    summary += ` (${warnings} warnings)`;
  }
  console.log(summary);
}

main();
