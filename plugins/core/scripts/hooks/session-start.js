#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new Claude session starts. Loads the most recent session
 * summary into Claude's context via stdout, and reports available
 * sessions and learned skills.
 */

const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  readFile,
  getProjectName,
  log,
  output
} = require('../lib/utils');
const { getPackageManager, getSelectionPrompt } = require('../lib/package-manager');
const { listAliases } = require('../lib/session-aliases');
const { detectProjectType } = require('../lib/project-detect');

const BASE_SKILLS = [
  {
    name: 'systematic-debugging',
    reason: 'first choice for debugging regressions and unclear failures'
  },
  {
    name: 'test-driven-development',
    reason: 'default for feature work and bugfixes that should start with tests'
  },
  {
    name: 'code-review-process',
    reason: 'use before merge or when asked for review-quality feedback'
  },
  {
    name: 'tmux-interactive-runner',
    reason: 'use for interactive or long-running terminal workflows'
  }
];

const LANGUAGE_SKILLS = {
  rust: [
    { name: 'rust-router', reason: 'general Rust implementation and compile-error triage' },
    { name: 'rust-learner', reason: 'crate versions, Rust releases, and docs lookup' }
  ],
  typescript: [
    { name: 'typescript', reason: 'type-safe TypeScript changes and conventions' },
    { name: 'react-patterns', reason: 'React and Next.js component work' }
  ],
  javascript: [
    { name: 'modern-javascript-patterns', reason: 'modern JS utilities, modules, and browser APIs' }
  ],
  python: [
    { name: 'modern-python', reason: 'modern Python project setup and tooling' },
    { name: 'python-testing', reason: 'pytest fixtures, parametrization, and test patterns' }
  ],
  golang: [
    { name: 'golang-patterns', reason: 'idiomatic Go implementation guidance' },
    { name: 'golang-testing', reason: 'table-driven tests and Go test structure' }
  ]
};

const FRAMEWORK_SKILLS = {
  react: [
    { name: 'react-patterns', reason: 'React state, rendering, and component patterns' },
    { name: 'frontend-patterns', reason: 'frontend architecture and UI implementation' }
  ],
  nextjs: [
    { name: 'nextjs-app-router-patterns', reason: 'App Router layouts, caching, and route patterns' }
  ],
  django: [
    { name: 'django-patterns', reason: 'Django architecture and ORM patterns' },
    { name: 'django-verification', reason: 'migrations, checks, and release verification' }
  ],
  fastapi: [
    { name: 'fastapi', reason: 'FastAPI routing, models, and up-to-date patterns' }
  ]
};

const PROJECT_SKILLS = {
  'basidiocarp': [
    { name: 'plugin-structure', reason: 'plugin layout, manifests, and auto-discovery work' },
    { name: 'create-hook', reason: 'Claude Code hook design and SessionStart/PostToolUse automation' },
    { name: 'agent-development', reason: 'building or editing agents in lamella' },
    { name: 'command-development', reason: 'slash-command authoring and plugin command behavior' }
  ]
};

function collectSkillRecommendations(projectInfo, projectName) {
  const byName = new Map();

  function addRecommendations(recommendations) {
    for (const recommendation of recommendations || []) {
      if (!byName.has(recommendation.name)) {
        byName.set(recommendation.name, recommendation);
      }
    }
  }

  addRecommendations(BASE_SKILLS);

  for (const language of projectInfo.languages || []) {
    addRecommendations(LANGUAGE_SKILLS[language]);
  }

  for (const framework of projectInfo.frameworks || []) {
    addRecommendations(FRAMEWORK_SKILLS[framework]);
  }

  addRecommendations(PROJECT_SKILLS[projectName]);

  return Array.from(byName.values()).slice(0, 8);
}

function formatProjectSummary(projectInfo, projectName) {
  const parts = [];

  if (projectName) {
    parts.push(`workspace: ${projectName}`);
  }
  if ((projectInfo.languages || []).length > 0) {
    parts.push(`languages: ${projectInfo.languages.join(', ')}`);
  }
  if ((projectInfo.frameworks || []).length > 0) {
    parts.push(`frameworks: ${projectInfo.frameworks.join(', ')}`);
  }

  if (parts.length === 0) {
    return null;
  }

  return `Project profile: ${parts.join('; ')}`;
}

function formatSkillRecommendations(recommendations) {
  if (!recommendations.length) {
    return null;
  }

  const lines = [
    'Startup skill hints: these are recommendations injected at session start, not force-loaded skills.',
    ...recommendations.map(
      recommendation => `- ${recommendation.name}: ${recommendation.reason}`
    )
  ];

  return lines.join('\n');
}

async function main() {
  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();
  const projectName = getProjectName();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  const recentSessions = findFiles(sessionsDir, '*-session.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);

    // Read and inject the latest session content into Claude's context
    const content = readFile(latest.path);
    if (content && !content.includes('[Session context goes here]')) {
      // Only inject if the session has actual content (not the blank template)
      output(`Previous session summary:\n${content}`);
    }
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // Check for available session aliases
  const aliases = listAliases({ limit: 5 });

  if (aliases.length > 0) {
    const aliasNames = aliases.map(a => a.name).join(', ');
    log(`[SessionStart] ${aliases.length} session alias(es) available: ${aliasNames}`);
    log(`[SessionStart] Use /sessions load <alias> to continue a previous session`);
  }

  // Detect and report package manager
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // If no explicit package manager config was found, show selection prompt
  if (pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  // Detect project type and frameworks (#293)
  const projectInfo = detectProjectType();
  const projectSummary = formatProjectSummary(projectInfo, projectName);
  if (projectSummary) {
    log(`[SessionStart] ${projectSummary}`);
  } else {
    log('[SessionStart] No specific project type detected');
  }

  const recommendations = collectSkillRecommendations(projectInfo, projectName);
  if (recommendations.length > 0) {
    log(
      `[SessionStart] Recommended skills: ${recommendations
        .map(recommendation => recommendation.name)
        .join(', ')}`
    );
  }

  // Context assembly order: stable project summary first (L2), then dynamic skill recommendations
  // This follows cache-friendly assembly rules to maximize prompt cache hits across turns.
  const startupNotes = [projectSummary, formatSkillRecommendations(recommendations)].filter(Boolean);
  if (startupNotes.length > 0) {
    output(startupNotes.join('\n\n'));
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});
