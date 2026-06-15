# Language-Specific Sharp Edges

Use this page as the index for language-specific misuse patterns. The grouped references below keep the advice short enough to scan during a review.

## Grouped References

- [Native languages](native-languages.md)
- [Platform and managed languages](platform-and-managed-languages.md)
- [Dynamic languages](dynamic-languages.md)

## How to Use This Reference

1. Start with the language family that matches the code under review.
2. Look for APIs where the easiest path is also the dangerous path.
3. Treat recurring themes as design failures, not developer failures:
   - silent overflow
   - type confusion
   - unsafe defaults
   - dynamic execution primitives
   - framework helpers that hide security-sensitive behavior

## Review Questions

- Does the language default to silent coercion or silent overflow?
- Are dangerous operations spelled almost the same as safe ones?
- Are important safety checks only warnings or conventions?
- Can developers accidentally disable safety with `null`, `0`, empty strings, or helper shortcuts?
