#!/usr/bin/env node
/**
 * Standalone Stop hook example that:
 * - blocks on TypeScript errors
 * - reports Go lint issues when golangci-lint is available
 * - prints a brief git diff summary
 */

const { execFileSync, spawnSync } = require('child_process');
const path = require('path');

function commandExists(name) {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(checker, [name], { stdio: 'ignore' });
  return result.status === 0;
}

function runGit(args, cwd, options = {}) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      ...options
    }).trim();
  } catch {
    return '';
  }
}

function getGitRoot() {
  return runGit(['rev-parse', '--show-toplevel'], process.cwd());
}

function hasHead(gitRoot) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: gitRoot,
    stdio: 'ignore'
  });
  return result.status === 0;
}

function changedFiles(gitRoot, args) {
  return runGit(args, gitRoot)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function findTsconfigDir(gitRoot) {
  const candidates = [
    gitRoot,
    path.join(gitRoot, 'src'),
    path.join(gitRoot, 'app'),
    path.join(gitRoot, 'packages')
  ];

  return candidates.find(candidate => {
    try {
      return require('fs').existsSync(path.join(candidate, 'tsconfig.json'));
    } catch {
      return false;
    }
  }) || '';
}

function runTypecheck(tsconfigDir) {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  try {
    execFileSync(npx, ['tsc', '--noEmit'], {
      cwd: tsconfigDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60000
    });
    return { ok: true, output: '' };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout || ''}${error.stderr || ''}`.trim()
    };
  }
}

function runGoLint(gitRoot, goFiles) {
  if (!commandExists('golangci-lint')) {
    return { available: false, output: '' };
  }

  const outputs = [];
  for (const file of goFiles) {
    try {
      const output = execFileSync('golangci-lint', ['run', file], {
        cwd: gitRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 60000
      }).trim();
      if (output) {
        outputs.push(output);
      }
    } catch (error) {
      const output = `${error.stdout || ''}${error.stderr || ''}`.trim();
      if (output) {
        outputs.push(output);
      }
    }
  }

  return { available: true, output: outputs.join('\n') };
}

function printSection(title) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(title);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
}

function printDiffPreview(gitRoot, files) {
  console.log('🔍 Change Preview (per file):');
  console.log('───────────────────────────────────────────────────────────────');

  for (const file of files) {
    const diff = runGit(['diff', 'HEAD', '--', file], gitRoot)
      .split('\n')
      .filter(line => (/^[+-]/).test(line) && !line.startsWith('+++') && !line.startsWith('---'));

    console.log('');
    console.log(`► ${file}`);
    console.log('  ─────────────────────────────────────────────────────────');
    for (const line of diff.slice(0, 8)) {
      console.log(`  ${line}`);
    }
    if (diff.length > 8) {
      console.log(`  ... (${diff.length - 8} more lines)`);
    }
  }
}

function main() {
  const gitRoot = getGitRoot();
  if (!gitRoot) {
    console.log('Not in a git repository, skipping change summary');
    process.exit(0);
  }

  if (!hasHead(gitRoot)) {
    console.log('No commits yet, skipping change summary');
    process.exit(0);
  }

  const diffBaseArgs = ['diff', '--name-only', 'HEAD'];
  const changed = changedFiles(gitRoot, diffBaseArgs);
  const tsFiles = changed.filter(file => /\.(ts|tsx)$/.test(file));
  const goFiles = changed.filter(file => /\.go$/.test(file));

  if (tsFiles.length > 0) {
    const tsconfigDir = findTsconfigDir(gitRoot);
    if (tsconfigDir) {
      printSection('                   TYPESCRIPT TYPE CHECK                        ');
      console.log('Checking types for modified TypeScript files...');
      console.log('');
      const result = runTypecheck(tsconfigDir);
      if (!result.ok) {
        console.log('❌ TypeScript errors found:');
        console.log('───────────────────────────────────────────────────────────────');
        console.log(result.output);
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('Please fix the TypeScript errors above before finishing.');
        console.log('═══════════════════════════════════════════════════════════════');
        process.exit(1);
      }
      console.log('✅ No TypeScript errors found');
      console.log('');
    }
  }

  if (goFiles.length > 0) {
    printSection('                      GO LINT CHECK                             ');
    const lintResult = runGoLint(gitRoot, goFiles);
    if (!lintResult.available) {
      console.log('⚠️  golangci-lint not found, skipping Go linting');
      console.log('   Install with: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest');
      console.log('');
    } else if (lintResult.output) {
      console.log('⚠️  Go linting issues found:');
      console.log('───────────────────────────────────────────────────────────────');
      console.log(lintResult.output);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
    } else {
      console.log('✅ No Go linting issues found');
      console.log('');
    }
  }

  const statOutput = runGit(['diff', '--stat', 'HEAD'], gitRoot) || runGit(['diff', '--stat'], gitRoot);
  const nameStatusOutput =
    runGit(['diff', '--name-status', 'HEAD'], gitRoot) || runGit(['diff', '--name-status'], gitRoot);
  const previewFiles =
    changedFiles(gitRoot, ['diff', '--name-only', 'HEAD']) || changedFiles(gitRoot, ['diff', '--name-only']);

  if (!statOutput && !nameStatusOutput) {
    console.log('No changes to summarize');
    process.exit(0);
  }

  printSection('                    SESSION CHANGE SUMMARY                      ');
  console.log('📊 Overall Statistics:');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(statOutput);
  console.log('');

  console.log('📁 Modified Files:');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(nameStatusOutput);
  console.log('');

  printDiffPreview(gitRoot, previewFiles);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  process.exit(0);
}

main();
