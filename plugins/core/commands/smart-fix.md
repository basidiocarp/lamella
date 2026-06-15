---
description: Resolve complex issues with staged investigation, approval gates, and verified fixes
argument-hint: "<issue description> [--verification minimal|standard|comprehensive] [--prevention none|immediate|comprehensive]"
---

# Smart Fix

Use this command when the problem is bigger than a straight build fix: unclear regressions, multi-file failures, incidents with user impact, or issues that need explicit root-cause confirmation before editing.

## Arguments

- `--verification minimal|standard|comprehensive`
- `--prevention none|immediate|comprehensive`

If a flag is omitted, default to `standard` verification and `immediate` prevention.

## Workflow

### Phase 1: Frame the issue

1. Restate the problem in plain language:
   - symptom
   - affected surface area
   - likely impact
   - current reproduction signal
2. If the issue statement is weak, ask for the missing context before proceeding.
3. Gather the first round of evidence from logs, tests, recent commits, or failing paths.

### Phase 2: Investigate root cause

1. Use 1-2 narrowly scoped review agents if they will speed up diagnosis:
   - `debugger` for failure analysis
   - `code-reviewer` or a domain specialist for design and safety gaps
2. Build a short root-cause memo:
   - what is failing
   - why it is failing
   - what files or systems are involved
   - the safest fix direction
3. Present that memo and wait for approval before editing if the fix is non-trivial.

### Phase 3: Implement the fix

1. Read the relevant files directly.
2. Implement the smallest production-safe fix that matches the approved direction.
3. Add or update tests when the issue is reproducible in code.
4. If the fix branches into a wider refactor, stop and ask before expanding scope.

### Phase 4: Verify

Run verification at the requested level:

- `minimal`: reproduce the failing path and run the closest relevant checks
- `standard`: run the normal project validation path for the touched area
- `comprehensive`: run broader regression checks, adjacent tests, and any useful audit passes

If verification fails, loop once with the new evidence and explain what changed.

### Phase 5: Prevention

If prevention is enabled, finish with a small prevention plan:

- `immediate`: one or two concrete follow-ups such as tests, assertions, alerts, or docs
- `comprehensive`: include broader detection or process changes if they are justified

## Guardrails

Stop and ask before continuing if:
- the issue is not reproducible enough to diagnose responsibly
- the likely fix needs architectural change
- required tooling or dependencies are missing
- the user-facing impact is high and you need rollout or incident handling approval

## Output

End with:
1. root cause
2. fix summary
3. verification performed
4. remaining risks
5. prevention follow-up

## Related Commands

- [`/build-fix`](build-fix.md) for narrow compile and type failures
- [`/bugfix`](bugfix.md) for smaller bugfix work
