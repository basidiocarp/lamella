# Variant Troubleshooting

## Common Failure: Missed Lines

Typical causes:

- the pattern matches the wrong AST shape
- you ported syntax instead of semantics
- one sink variant is missing
- the source helper in the target language differs from the original

Fix sequence:

1. Re-run `--dump-ast` on the failing line.
2. Reduce the pattern to the smallest matching shape.
3. Add sibling sink variants explicitly instead of one overly clever pattern.
4. Re-run `semgrep --test`.

## Common Failure: Incorrect Lines

Typical causes:

- the sink pattern is too broad
- safe patterns need `pattern-not` or sanitizer coverage
- string formatting helpers are being matched without untrusted input

Fix sequence:

1. Identify which exact safe line was flagged.
2. Compare its AST with the intended vulnerable line.
3. Add a narrow exclusion or sanitizer.
4. Re-test before adding more variants.

## Common Failure: Rule Transfers Poorly

Sometimes the language has a different safety model:

- builders or prepared statements are the default
- the framework hides raw sinks behind helpers
- the source is not user-controlled in the same way

If the port requires too many caveats, downgrade the port:

- `NOT_APPLICABLE` if the vulnerability model does not really transfer
- `LOW_PRIORITY` if the target ecosystem mostly uses safer primitives

## Common Failure: Test File Is Too Thin

Symptoms:

- rule passes immediately but misses real-world shapes later
- every change breaks an unseen variant

Add test cases for:

- alternate sinks
- wrapper helpers
- framework-specific sources
- the safest common idiom that must stay `ok`

## Review Heuristic

If you cannot explain why each `ruleid:` and `ok:` line exists, the test file is not ready yet.
