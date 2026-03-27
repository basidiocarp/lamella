# Manual and Argument Tests

Use manual invocation to confirm the command behaves like a user expects.

## Cover

- no-argument invocation
- normal argument substitution
- quoted arguments with spaces
- missing or invalid input
- interactive follow-up behavior if the command asks questions

## Good Output

The command should either proceed correctly or fail with a specific next step.
Avoid ambiguous errors or silent fallback behavior.
