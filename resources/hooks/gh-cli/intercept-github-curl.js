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
    const cmd = payload.tool_input?.command || '';
    if (!cmd) {
      process.exit(0);
    }
    if (/(?:^|[\s;|&])gh\s/.test(cmd) || /(?:^|[\s;|&])git\s/.test(cmd)) {
      process.exit(0);
    }
    if (!/(?:^|[\s;|&])(curl|wget)\s/.test(cmd)) {
      process.exit(0);
    }
    if (!/https?:\/\/(github\.com|api\.github\.com|raw\.githubusercontent\.com|gist\.github\.com)\//.test(cmd)) {
      process.exit(0);
    }

    let suggestion = 'Use `gh api` or other `gh` subcommands instead of curl/wget for GitHub URLs';
    let match;

    if ((match = cmd.match(/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/releases/))) {
      suggestion = `Use \`gh release list --repo ${match[1]}/${match[2]}\` or \`gh api repos/${match[1]}/${match[2]}/releases/latest\` instead`;
    } else if ((match = cmd.match(/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/pulls/))) {
      suggestion = `Use \`gh pr list --repo ${match[1]}/${match[2]}\` instead`;
    } else if ((match = cmd.match(/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/issues/))) {
      suggestion = `Use \`gh issue list --repo ${match[1]}/${match[2]}\` instead`;
    } else if ((match = cmd.match(/api\.github\.com\/repos\/([^/]+)\/([^/]+)\/actions/))) {
      suggestion = `Use \`gh run list --repo ${match[1]}/${match[2]}\` instead`;
    } else if ((match = cmd.match(/api\.github\.com\/([^\s"'`]+)/))) {
      suggestion = `Use \`gh api ${match[1]}\` instead`;
    } else if ((match = cmd.match(/github\.com\/([^/]+)\/([^/]+)\/releases\/download\//))) {
      suggestion = `Use \`gh release download --repo ${match[1]}/${match[2]}\` instead`;
    } else if ((match = cmd.match(/github\.com\/([^/]+)\/([^/]+)\/archive\//))) {
      suggestion = `Use \`gh release download --repo ${match[1]}/${match[2]}\` instead`;
    } else if ((match = cmd.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/[^/]+\/([^[:space:]"'`]+)/))) {
      suggestion = repoCloneSuggestion(match[1], match[2]);
    } else if (/gist\.github\.com\//.test(cmd)) {
      suggestion = 'Use `gh gist view` instead';
    }

    deny(suggestion);
  } catch {
    // Ignore malformed input
  }

  process.exit(0);
});
