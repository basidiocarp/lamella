# Manual and CI Testing

Keep a small manual checklist even if the automated suite is strong.

## Manual Prompt Checks

Try multiple natural-language phrasings for the same action:

- "add this to my feed"
- "publish this insight"
- "put this in my reading feed"

If only one phrasing works, the prompt or context injection is too brittle.

## CI Rules

- run agent-native tests in CI, not only locally
- snapshot stable prompt structure, not volatile dynamic data
- fail the build if the capability map or generated prompt docs drift from the
  code
- keep at least one end-to-end test that proves the main loop can finish
