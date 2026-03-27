---
name: continuous-learning
description: Extracts reusable patterns from Claude Code sessions and saves them as learned skills for future use. Use when setting up automatic pattern extraction, configuring session evaluation hooks, or reviewing learned skills.
---

# Continuous Learning Skill


## Contents

- [When to Use](#when-to-use)
- [How It Works](#how-it-works)
- [Configuration](#configuration)
- [Pattern Types](#pattern-types)
- [Hook Setup](#hook-setup)
- [Why Stop Hook?](#why-stop-hook)
- [Related](#related)
- [Comparison Notes (Research: Jan 2025)](#comparison-notes-research-jan-2025)

Automatically evaluates Claude Code sessions on end to extract reusable patterns that can be saved as learned skills.

## When to Use

- Setting up automatic pattern extraction from Claude Code sessions
- Configuring the Stop hook for session evaluation
- Reviewing or curating learned skills in `~/.claude/skills/learned/`
- Adjusting extraction thresholds or pattern categories
- Comparing v1 (this) vs v2 (instinct-based) approaches

## How It Works

This skill runs as a **Stop hook** at the end of each session:

1. **Session Evaluation**: Checks if session has enough messages (default: 10+)
2. **Pattern Detection**: Identifies extractable patterns from the session
3. **Skill Extraction**: Saves useful patterns to `~/.claude/skills/learned/`

## Configuration

Edit `config.json` to customize:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "observation_types": [
    "workflow_patterns",
    "user_corrections",
    "validation_gaps",
    "external_api_issues"
  ],
  "ignore_patterns": [
    "simple_formatting",
    "one_off_typos"
  ],
  "review_before_write": true
}
```

## Pattern Types

| Pattern | Description |
|---------|-------------|
| `error_resolution` | How specific errors were resolved |
| `user_corrections` | Patterns from user corrections |
| `workarounds` | Solutions to framework/library quirks |
| `debugging_techniques` | Effective debugging approaches |
| `project_specific` | Project-specific conventions |

## Hook Setup

Add to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

## Why Stop Hook?

- **Lightweight**: Runs once at session end
- **Non-blocking**: Doesn't add latency to every message
- **Complete context**: Has access to full session transcript

## Related

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Section on continuous learning
- `/learn` command - Manual pattern extraction mid-session

---

## Comparison Notes (Research: Jan 2025)

Homunculus v2 uses a more sophisticated instinct-based approach: PreToolUse/PostToolUse hooks for 100% reliable observation, background Haiku agent for analysis, atomic "instincts" with 0.3-0.9 confidence scoring, and evolution path from instincts → clusters → skills/commands/agents.

Key insight: "v1 relied on skills to observe (~50-80% fire rate). v2 uses hooks for observation (100% reliable) and instincts as the atomic unit of learned behavior."

## Reference Files

- [Detect Project](scripts/detect-project.sh)
