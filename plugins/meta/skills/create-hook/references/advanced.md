# Advanced Hooks

Use these patterns when hooks need more than a simple deterministic command.

## Prompt Hooks

Use prompt hooks when the decision depends on judgment rather than a fixed shell
rule.

Good fit:
- should Claude stop or continue?
- does the current state satisfy a checklist?
- is a summary complete enough to allow exit?

Prompt hooks should return a simple allow/block result with a reason when they
block.

## Agent Hooks

Use agent hooks when the hook needs to inspect files, run tools, or verify the
actual repo state.

Good fit:
- check whether tests passed
- inspect generated files
- verify conditions that cannot be derived from hook input alone

Use them sparingly. They are heavier than prompt hooks.

## Async Hooks

Use async hooks for long-running side work that should not block the main flow.

Typical examples:
- background test runs
- indexing or reporting
- post-write analysis

Async hooks should report useful context later, but they cannot block an action
that already happened.

## Security Rules

Hooks run with user permissions, so treat them like local automation scripts.

Minimum safety rules:
- validate all inputs
- quote shell variables
- block path traversal
- avoid sensitive file access unless explicitly intended
- prefer project-root-relative paths over ad hoc shell assumptions

## Debugging

Useful techniques:
- run Claude in debug mode
- inspect matcher behavior and exit codes
- keep hook output terse and actionable

The advanced pattern is still the same rule: use the lightest hook type that can
make the decision safely.
