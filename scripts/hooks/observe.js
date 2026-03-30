#!/usr/bin/env node
/**
 * Continuous-learning observation hook.
 *
 * Cross-platform replacement for observe.sh.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { readStdinJson, ensureDir, getHomeDir, isWindows, logHookError } = require('../lib/utils');

const MAX_FILE_SIZE_MB = 10;
const MAX_CAPTURE = 5000;
const SECRET_RE =
  /(api[_-]?key|token|secret|password|authorization|credentials?|auth)(["'\s:=]+)([A-Za-z]+\s+)?([A-Za-z0-9_\-/.+=]{8,})/giu;

function sha256Prefix(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function stripCredentials(remoteUrl) {
  return remoteUrl.replace(/:\/\/[^@]+@/, '://');
}

function runGit(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  });
  if (result.status !== 0) {
    return null;
  }
  return result.stdout.trim();
}

function detectProject(payload) {
  const homunculusDir = path.join(getHomeDir(), '.claude', 'homunculus');
  const projectsDir = path.join(homunculusDir, 'projects');
  const registryFile = path.join(homunculusDir, 'projects.json');

  let projectRoot = '';
  const stdinCwd = payload.cwd;
  const envCwd = process.env.CLAUDE_PROJECT_DIR;

  if (stdinCwd && fs.existsSync(stdinCwd) && fs.statSync(stdinCwd).isDirectory()) {
    projectRoot = stdinCwd;
  } else if (envCwd && fs.existsSync(envCwd) && fs.statSync(envCwd).isDirectory()) {
    projectRoot = envCwd;
  }

  if (!projectRoot) {
    const detected = runGit(['rev-parse', '--show-toplevel'], process.cwd());
    if (detected) {
      projectRoot = detected;
    }
  }

  if (!projectRoot) {
    ensureDir(homunculusDir);
    return {
      projectId: 'global',
      projectName: 'global',
      projectRoot: '',
      projectDir: homunculusDir,
      registryFile
    };
  }

  const projectName = path.basename(projectRoot);
  const remoteUrlRaw = runGit(['-C', projectRoot, 'remote', 'get-url', 'origin'], projectRoot) || '';
  const remoteUrl = remoteUrlRaw ? stripCredentials(remoteUrlRaw) : '';
  const hashInput = remoteUrl || projectRoot;
  const projectId = sha256Prefix(hashInput);
  const projectDir = path.join(projectsDir, projectId);

  ensureDir(path.join(projectDir, 'instincts', 'personal'));
  ensureDir(path.join(projectDir, 'instincts', 'inherited'));
  ensureDir(path.join(projectDir, 'observations.archive'));
  ensureDir(path.join(projectDir, 'evolved', 'skills'));
  ensureDir(path.join(projectDir, 'evolved', 'commands'));
  ensureDir(path.join(projectDir, 'evolved', 'agents'));

  let registry = {};
  try {
    registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'));
  } catch {}

  registry[projectId] = {
    name: projectName,
    root: projectRoot,
    remote: remoteUrl,
    last_seen: new Date().toISOString()
  };

  ensureDir(path.dirname(registryFile));
  fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2), 'utf8');

  return { projectId, projectName, projectRoot, projectDir, registryFile };
}

function scrubSecrets(value) {
  if (value == null) {
    return value;
  }
  return String(value).replace(SECRET_RE, (_match, key, separator, scheme = '') => {
    return `${key}${separator}${scheme}[REDACTED]`;
  });
}

function archiveIfLarge(filePath, archiveDir) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const sizeMb = fs.statSync(filePath).size / (1024 * 1024);
  if (sizeMb < MAX_FILE_SIZE_MB) {
    return;
  }

  ensureDir(archiveDir);
  const archiveFile = path.join(
    archiveDir,
    `observations-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}.jsonl`
  );
  fs.renameSync(filePath, archiveFile);
}

function purgeOldArchives(projectDir) {
  const purgeMarker = path.join(projectDir, '.last-purge');
  let shouldPurge = true;

  try {
    const ageMs = Date.now() - fs.statSync(purgeMarker).mtimeMs;
    shouldPurge = ageMs > 24 * 60 * 60 * 1000;
  } catch {}

  if (!shouldPurge) {
    return;
  }

  const archiveDir = path.join(projectDir, 'observations.archive');
  if (fs.existsSync(archiveDir)) {
    for (const entry of fs.readdirSync(archiveDir)) {
      const fullPath = path.join(archiveDir, entry);
      try {
        const ageMs = Date.now() - fs.statSync(fullPath).mtimeMs;
        if (ageMs > 30 * 24 * 60 * 60 * 1000) {
          fs.rmSync(fullPath, { force: true });
        }
      } catch {}
    }
  }

  fs.writeFileSync(purgeMarker, new Date().toISOString(), 'utf8');
}

function buildObservation(payload, hookPhase, projectInfo) {
  const event = hookPhase === 'pre' ? 'tool_start' : 'tool_complete';
  const toolName = payload.tool_name || payload.tool || 'unknown';
  const toolInput = payload.tool_input ?? payload.input ?? {};
  const toolOutput = payload.tool_output ?? payload.output ?? '';
  const toolInputText =
    typeof toolInput === 'string' ? toolInput : JSON.stringify(toolInput).slice(0, MAX_CAPTURE);
  const toolOutputText =
    typeof toolOutput === 'string' ? toolOutput : JSON.stringify(toolOutput).slice(0, MAX_CAPTURE);

  return {
    timestamp: new Date().toISOString(),
    event,
    tool: toolName,
    session: payload.session_id || 'unknown',
    project_id: projectInfo.projectId,
    project_name: projectInfo.projectName,
    ...(event === 'tool_start' ? { input: scrubSecrets(toolInputText) } : {}),
    ...(event === 'tool_complete' ? { output: scrubSecrets(toolOutputText) } : {})
  };
}

function signalObserver(projectDir) {
  if (isWindows) {
    return;
  }

  const pidFiles = [
    path.join(projectDir, '.observer.pid'),
    path.join(getHomeDir(), '.claude', 'homunculus', '.observer.pid')
  ];

  for (const pidFile of pidFiles) {
    try {
      const pid = Number(fs.readFileSync(pidFile, 'utf8').trim());
      if (Number.isFinite(pid) && pid > 0) {
        process.kill(pid, 'SIGUSR1');
      }
    } catch {}
  }
}

async function main() {
  const hookPhase = process.argv[2] || 'post';
  const payload = await readStdinJson({ timeoutMs: 5000, maxSize: 1024 * 1024 });
  if (!payload || Object.keys(payload).length === 0) {
    return;
  }

  const configDir = path.join(getHomeDir(), '.claude', 'homunculus');
  if (fs.existsSync(path.join(configDir, 'disabled'))) {
    return;
  }

  const projectInfo = detectProject(payload);
  const observationsFile = path.join(projectInfo.projectDir, 'observations.jsonl');

  purgeOldArchives(projectInfo.projectDir);
  archiveIfLarge(observationsFile, path.join(projectInfo.projectDir, 'observations.archive'));

  const observation = buildObservation(payload, hookPhase, projectInfo);
  ensureDir(path.dirname(observationsFile));
  fs.appendFileSync(observationsFile, `${JSON.stringify(observation)}\n`, 'utf8');
  signalObserver(projectInfo.projectDir);
}

main().catch(error => {
  logHookError('observe', error);
  process.exit(0);
});
