#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { validateManifestAlignment, validateSkillFrontmatter } = require('../lib/skill-packages');

function captureValidation(skill) {
  const errors = [];
  const warnings = [];
  const result = validateSkillFrontmatter(
    skill,
    (message) => errors.push(message),
    (message) => warnings.push(message),
  );
  return { errors, warnings, result };
}

function writeSkillFile(rootDir, category, name, contents) {
  const skillDir = path.join(rootDir, 'skills', category, name);
  fs.mkdirSync(skillDir, { recursive: true });
  const skillMd = path.join(skillDir, 'SKILL.md');
  fs.writeFileSync(skillMd, contents);
  return {
    relPath: `${category}/${name}`,
    name,
    skillMd,
  };
}

function testValidationRejectsStaleSkillMetadata() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-skill-validation-'));
  try {
    const skill = writeSkillFile(
      tempRoot,
      'meta',
      'bad-skill',
      `---
name: claude-helper
description: ""
allowed-tools:
  - ""
compatibility: ${'x'.repeat(501)}
---

# Bad Skill
`,
    );

    const { errors } = captureValidation(skill);
    assert.ok(errors.some((message) => message.includes("must match directory 'bad-skill'")));
    assert.ok(errors.some((message) => message.includes("must not include reserved token 'claude'")));
    assert.ok(errors.some((message) => message.includes("missing required 'description'")));
    assert.ok(errors.some((message) => message.includes('allowed-tools entries must be non-empty strings')));
    assert.ok(errors.some((message) => message.includes('compatibility must be 500 characters or fewer')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testScaffoldCreatesValidatorCompatibleSkill() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-skill-scaffold-'));
  try {
    const scriptPath = path.resolve(__dirname, '../scaffold/create-skill.sh');
    execFileSync(
      'bash',
      [
        scriptPath,
        'meta/new-skill-surface',
        '--description',
        'Guides validation and packaging checks for a new skill surface.',
      ],
      {
        cwd: path.resolve(__dirname, '..', '..'),
        env: {
          ...process.env,
          LAMELLA_CONTENT_ROOT: tempRoot,
        },
        stdio: 'pipe',
      },
    );

    const skill = {
      relPath: 'meta/new-skill-surface',
      name: 'new-skill-surface',
      skillMd: path.join(tempRoot, 'skills', 'meta', 'new-skill-surface', 'SKILL.md'),
    };
    const { errors, warnings, result } = captureValidation(skill);

    assert.equal(errors.length, 0, `unexpected errors: ${errors.join('; ')}`);
    assert.ok(result?.frontmatter, 'scaffolded skill should parse frontmatter');
    assert.equal(result.frontmatter.name, 'new-skill-surface');
    assert.equal(
      result.frontmatter.description,
      'Guides validation and packaging checks for a new skill surface.',
    );
    assert.equal(warnings.length, 0, `unexpected warnings: ${warnings.join('; ')}`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testManifestAlignmentRejectsMissingCodexManifest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-manifest-alignment-'));
  try {
    const claudeDir = path.join(tempRoot, 'claude');
    const codexDir = path.join(tempRoot, 'codex');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(codexDir, { recursive: true });

    fs.writeFileSync(
      path.join(claudeDir, 'meta.json'),
      JSON.stringify({
        name: 'meta',
        description: 'Meta package',
        dependencies: ['core'],
        resources: {
          skills: ['meta/create-handoff'],
          workflows: [],
          templates: [],
          commands: ['meta/create-skill.md'],
          agents: [],
        },
      }, null, 2),
    );

    const errors = [];
    const aligned = validateManifestAlignment(
      new Map([['meta/create-handoff', { name: 'create-handoff', frontmatter: { name: 'create-handoff' } }]]),
      (message) => errors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir },
    );

    assert.equal(aligned, 0);
    assert.ok(errors.some((message) => message.includes('missing paired Codex manifest meta.yaml')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testManifestAlignmentRejectsPortableResourceDrift() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-manifest-drift-'));
  try {
    const claudeDir = path.join(tempRoot, 'claude');
    const codexDir = path.join(tempRoot, 'codex');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(codexDir, { recursive: true });

    fs.writeFileSync(
      path.join(claudeDir, 'tools.json'),
      JSON.stringify({
        name: 'tools',
        description: 'Tools package',
        dependencies: [],
        resources: {
          skills: ['tools/mcp-integration'],
          workflows: ['workflow/tooling.md'],
          templates: ['docs/SKILL-MD-TEMPLATE.md'],
          commands: ['tools/cli.md'],
          agents: [],
        },
      }, null, 2),
    );

    fs.writeFileSync(
      path.join(codexDir, 'tools.yaml'),
      JSON.stringify({
        name: 'tools',
        description: 'Tools package',
        source_plugin: 'tools',
        dependencies: [],
        resources: {
          skills: [],
          workflows: ['workflow/tooling.md'],
          templates: ['docs/SKILL-MD-TEMPLATE.md'],
          scripts: [],
        },
        options: {
          include_workflow_wrappers: true,
          include_template_wrappers: true,
        },
      }, null, 2),
    );

    const errors = [];
    const aligned = validateManifestAlignment(
      new Map([['tools/mcp-integration', { name: 'mcp-integration', frontmatter: { name: 'mcp-integration' } }]]),
      (message) => errors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir },
    );

    assert.equal(aligned, 1);
    assert.ok(errors.some((message) => message.includes('skills drift from manifests/claude/tools.json')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function main() {
  testValidationRejectsStaleSkillMetadata();
  testScaffoldCreatesValidatorCompatibleSkill();
  testManifestAlignmentRejectsMissingCodexManifest();
  testManifestAlignmentRejectsPortableResourceDrift();
  console.log('Skill package validator and scaffold checks passed');
}

main();
