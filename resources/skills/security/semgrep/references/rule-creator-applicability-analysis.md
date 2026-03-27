# Applicability Analysis

Use this step before porting or creating a Semgrep variant rule for another
language.

## Core Questions

For each target language, ask:
- does this vulnerability class actually exist here?
- does an equivalent sink or source construct exist?
- are the semantics close enough that the rule still means the same thing?

## Verdicts

### Applicable

Use when the pattern transfers directly with only syntax changes.

### Applicable With Adaptation

Use when the vulnerability exists but the target language needs a different
shape, different sinks, or different idioms.

### Not Applicable

Use when the vulnerability class or construct does not make sense in the target
language.

## What to Document

For each language:
- verdict
- why the verdict is correct
- equivalent constructs if they exist
- any adaptations required before writing the rule

## Rule

Do not port a rule just because the original vulnerability sounds familiar. The
pattern must map to real target-language constructs and deliver actual security
signal.
