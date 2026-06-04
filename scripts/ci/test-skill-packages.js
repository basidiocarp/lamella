#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { validateManifestAlignment, validateSkillFrontmatter, detectHardcodedHomePaths } = require('../lib/skill-packages');

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
    const result = validateManifestAlignment(
      new Map([['meta/create-handoff', { name: 'create-handoff', frontmatter: { name: 'create-handoff' } }]]),
      (message) => errors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir },
    );

    assert.equal(result.aligned, 0);
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
    const result = validateManifestAlignment(
      new Map([['tools/mcp-integration', { name: 'mcp-integration', frontmatter: { name: 'mcp-integration' } }]]),
      (message) => errors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir },
    );

    assert.equal(result.aligned, 1);
    assert.ok(errors.some((message) => message.includes('skills drift from manifests/claude/tools.json')));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testDetectHardcodedHomePathsFindsRealPaths() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-hardcoded-paths-real-'));
  try {
    const skill = writeSkillFile(
      tempRoot,
      'test',
      'hardcoded-real',
      `---
name: hardcoded-real
description: Test skill with real hardcoded paths
---

# Test Skill

Build script at /Users/alice/projects/build.sh
`,
    );

    const { warnings, errors } = captureValidation(skill);
    assert.equal(errors.length, 0, `unexpected errors: ${errors.join('; ')}`);
    assert.ok(warnings.some((msg) => msg.includes('hardcoded user-home path found') && msg.includes('/Users/alice')), 'should warn about /Users/alice path');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testDetectHardcodedHomePathsIgnoresPlaceholders() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-hardcoded-paths-placeholder-'));
  try {
    const skill = writeSkillFile(
      tempRoot,
      'test',
      'hardcoded-placeholder',
      `---
name: hardcoded-placeholder
description: Test skill with placeholder paths
---

# Test Skill

Template path: /Users/you/projects/example
Or: /home/username/build.sh
Environment: \${HOME}/scripts/run.sh
`,
    );

    const { warnings, errors } = captureValidation(skill);
    assert.equal(errors.length, 0, `unexpected errors: ${errors.join('; ')}`);
    const pathWarnings = warnings.filter((msg) => msg.includes('hardcoded user-home path found'));
    assert.equal(pathWarnings.length, 0, `should not warn about placeholder paths; got: ${pathWarnings.join('; ')}`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testDetectHardcodedHomePathsScansScriptFiles() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-hardcoded-paths-scripts-'));
  try {
    // Create a skill with a script file
    const skillDir = path.join(tempRoot, 'skills', 'test', 'hardcoded-script');
    fs.mkdirSync(skillDir, { recursive: true });

    const skillMd = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(
      skillMd,
      `---
name: hardcoded-script
description: Test skill with hardcoded paths in scripts
---

# Test Skill
`,
    );

    // Create a build script with a hardcoded path
    const buildScript = path.join(skillDir, 'build.sh');
    fs.writeFileSync(
      buildScript,
      `#!/bin/bash
# Build script
cd /Users/bob/projects/myapp
npm run build
`,
    );

    const skill = {
      relPath: 'test/hardcoded-script',
      name: 'hardcoded-script',
      skillMd,
    };

    const { warnings, errors } = captureValidation(skill);
    assert.equal(errors.length, 0, `unexpected errors: ${errors.join('; ')}`);
    assert.ok(warnings.some((msg) => msg.includes('hardcoded user-home path found') && msg.includes('/Users/bob')), 'should warn about path in script file');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

// Regression guard for shared global-flag regex state: two files in one walk,
// each holding a distinct real path. If the detector reused a stateful regex
// object across files (carrying lastIndex), the second file's hit could be
// skipped. Both must surface — and as warnings, never errors, so a green
// `make validate` stays green on legitimately path-bearing bundled content.
function testDetectHardcodedHomePathsScansMultipleFiles() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-hardcoded-paths-multi-'));
  try {
    const skillDir = path.join(tempRoot, 'skills', 'test', 'hardcoded-multi');
    fs.mkdirSync(skillDir, { recursive: true });

    const skillMd = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(
      skillMd,
      `---
name: hardcoded-multi
description: Test skill with paths across multiple files
---

# Test Skill

See /Users/carol/projects for details.
`,
    );

    fs.writeFileSync(
      path.join(skillDir, 'setup.sh'),
      `#!/bin/bash
cd /Users/dave/work
`,
    );

    const skill = { relPath: 'test/hardcoded-multi', name: 'hardcoded-multi', skillMd };
    const { warnings, errors } = captureValidation(skill);
    assert.equal(errors.length, 0, `unexpected errors: ${errors.join('; ')}`);
    assert.ok(warnings.some((msg) => msg.includes('/Users/carol')), 'should warn about path in markdown body');
    assert.ok(warnings.some((msg) => msg.includes('/Users/dave')), 'should warn about path in second (script) file');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function testManifestAlignmentWriteModeRepairsAndIsIdempotent() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lamella-manifest-write-'));
  try {
    const claudeDir = path.join(tempRoot, 'claude');
    const codexDir = path.join(tempRoot, 'codex');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.mkdirSync(codexDir, { recursive: true });

    // Same fixture shape as testManifestAlignmentRejectsPortableResourceDrift:
    // a codex manifest whose skills list is stale (empty) while the claude
    // manifest lists one skill.
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

    const skillMap = new Map([
      ['tools/mcp-integration', { name: 'mcp-integration', frontmatter: { name: 'mcp-integration' } }],
    ]);

    // (a) Write mode: drift must be repaired, not errored.
    const writeErrors = [];
    const writeResult = validateManifestAlignment(
      skillMap,
      (message) => writeErrors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir, writeEnabled: true },
    );

    assert.equal(writeErrors.length, 0, `write mode should not report errors; got: ${writeErrors.join('; ')}`);
    assert.ok(writeResult.written >= 1, `write mode should report at least one written manifest; got ${writeResult.written}`);

    // (b) Idempotency: a subsequent detect-only run must report zero drift errors.
    const detectErrors = [];
    validateManifestAlignment(
      skillMap,
      (message) => detectErrors.push(message),
      () => {},
      { claudeManifestsDir: claudeDir, codexManifestsDir: codexDir },
    );

    assert.equal(detectErrors.length, 0, `detect run after write should find zero drift; got: ${detectErrors.join('; ')}`);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function main() {
  testValidationRejectsStaleSkillMetadata();
  testScaffoldCreatesValidatorCompatibleSkill();
  testManifestAlignmentRejectsMissingCodexManifest();
  testManifestAlignmentRejectsPortableResourceDrift();
  testManifestAlignmentWriteModeRepairsAndIsIdempotent();
  testDetectHardcodedHomePathsFindsRealPaths();
  testDetectHardcodedHomePathsIgnoresPlaceholders();
  testDetectHardcodedHomePathsScansScriptFiles();
  testDetectHardcodedHomePathsScansMultipleFiles();
  console.log('Skill package validator and scaffold checks passed');
}

main();
