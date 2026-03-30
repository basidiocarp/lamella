#!/usr/bin/env node
const { spawnSync } = require('child_process');

function ghInstalled() {
  const checker = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(checker, ['gh'], { stdio: 'ignore' }).status === 0;
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `${reason}. The gh CLI uses your authenticated GitHub token and works with private repos.`
      }
    })
  );
}

function repoCloneSuggestion(owner, repo) {
  return `Use \`gh repo clone ${owner}/${repo} "\${TMPDIR:-/tmp}/gh-clones-\${CLAUDE_SESSION_ID}/${repo}" -- --depth 1\`, then use the Explore agent on the clone`;
}

let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  data += chunk;
});

process.stdin.on('end', () => {
  if (!ghInstalled()) {
    process.exit(0);
  }

  try {
    const payload = JSON.parse(data || '{}');
    const rawUrl = payload.tool_input?.url || '';
    if (!rawUrl) {
      process.exit(0);
    }

    const url = new URL(rawUrl);
    const host = url.hostname;
    const requestPath = url.pathname.replace(/^\/+/, '');
    let suggestion = '';

    switch (host) {
      case 'api.github.com':
        if (/^repos\/([^/]+)\/([^/]+)\/pulls/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^repos\/([^/]+)\/([^/]+)\/pulls/);
          suggestion = `Use \`gh pr list --repo ${owner}/${repo}\` or \`gh pr view\` instead`;
        } else if (/^repos\/([^/]+)\/([^/]+)\/issues/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^repos\/([^/]+)\/([^/]+)\/issues/);
          suggestion = `Use \`gh issue list --repo ${owner}/${repo}\` or \`gh issue view\` instead`;
        } else if (/^repos\/([^/]+)\/([^/]+)\/releases/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^repos\/([^/]+)\/([^/]+)\/releases/);
          suggestion = `Use \`gh release list --repo ${owner}/${repo}\` or \`gh api ${requestPath}\` instead`;
        } else if (/^repos\/([^/]+)\/([^/]+)\/actions/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^repos\/([^/]+)\/([^/]+)\/actions/);
          suggestion = `Use \`gh run list --repo ${owner}/${repo}\` or \`gh api ${requestPath}\` instead`;
        } else {
          suggestion = `Use \`gh api ${requestPath}\` instead`;
        }
        break;
      case 'raw.githubusercontent.com':
        if (/^([^/]+)\/([^/]+)\/[^/]+\/(.+)/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^([^/]+)\/([^/]+)\/[^/]+\/(.+)/);
          suggestion = repoCloneSuggestion(owner, repo);
        } else {
          suggestion = 'Use `gh repo clone` to a temp directory, then use the Explore agent on the clone';
        }
        break;
      case 'gist.github.com':
        suggestion = 'Use `gh gist view` instead';
        break;
      case 'github.com':
        if (!requestPath.includes('/')) {
          process.exit(0);
        }
        if (/^([^/]+)\/([^/]+)\/pull\/([0-9]+)/.test(requestPath)) {
          const [, owner, repo, pr] = requestPath.match(/^([^/]+)\/([^/]+)\/pull\/([0-9]+)/);
          suggestion = `Use \`gh pr view ${pr} --repo ${owner}/${repo}\` instead`;
        } else if (/^([^/]+)\/([^/]+)\/issues\/([0-9]+)/.test(requestPath)) {
          const [, owner, repo, issue] = requestPath.match(/^([^/]+)\/([^/]+)\/issues\/([0-9]+)/);
          suggestion = `Use \`gh issue view ${issue} --repo ${owner}/${repo}\` instead`;
        } else if (/^([^/]+)\/([^/]+)\/releases\/download\//.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^([^/]+)\/([^/]+)\/releases\/download\//);
          suggestion = `Use \`gh release download --repo ${owner}/${repo}\` instead`;
        } else if (/^([^/]+)\/([^/]+)\/(?:blob|tree)\//.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^([^/]+)\/([^/]+)\/(?:blob|tree)\//);
          suggestion = repoCloneSuggestion(owner, repo);
        } else if (/^([^/]+)\/([^/]+)/.test(requestPath)) {
          const [, owner, repo] = requestPath.match(/^([^/]+)\/([^/]+)/);
          suggestion = `Use \`gh repo view ${owner}/${repo}\` instead`;
        }
        break;
      default:
        process.exit(0);
    }

    if (suggestion) {
      deny(suggestion);
    }
  } catch {
    // Ignore malformed input
  }

  process.exit(0);
});
