---
name: property-based-testing
description: "Run this when implementing property-based tests — guides property-based testing patterns across multiple languages and smart contracts."
origin: lamella
---

# Property-Based Testing Guide


## Contents

- [When to Invoke (Automatic Detection)](#when-to-invoke-automatic-detection)
- [When NOT to Use](#when-not-to-use)
- [Property Catalog (Quick Reference)](#property-catalog-quick-reference)
- [Decision Tree](#decision-tree)
- [How to Suggest PBT](#how-to-suggest-pbt)
- [When NOT to Use PBT](#when-not-to-use-pbt)
- [Red Flags](#red-flags)
- [Rationalizations to Reject](#rationalizations-to-reject)

Use this skill proactively during development when you encounter patterns where PBT provides stronger coverage than example-based tests.

## When to Invoke (Automatic Detection)

**Invoke this skill when you detect:**

- **Serialization pairs**: `encode`/`decode`, `serialize`/`deserialize`, `toJSON`/`fromJSON`, `pack`/`unpack`
- **Parsers**: URL parsing, config parsing, protocol parsing, string-to-structured-data
- **Normalization**: `normalize`, `sanitize`, `clean`, `canonicalize`, `format`
- **Validators**: `is_valid`, `validate`, `check_*` (especially with normalizers)
- **Data structures**: Custom collections with `add`/`remove`/`get` operations
- **Mathematical/algorithmic**: Pure functions, sorting, ordering, comparators
- **Smart contracts**: Solidity/Vyper contracts, token operations, state invariants, access control

**Priority by pattern:**

| Pattern | Property | Priority |
|---------|----------|----------|
| encode/decode pair | Roundtrip | HIGH |
| Pure function | Multiple | HIGH |
| Validator | Valid after normalize | MEDIUM |
| Sorting/ordering | Idempotence + ordering | MEDIUM |
| Normalization | Idempotence | MEDIUM |
| Builder/factory | Output invariants | LOW |
| Smart contract | State invariants | HIGH |

## When NOT to Use

Do NOT use this skill for:
- Simple CRUD operations without transformation logic
- One-off scripts or throwaway code
- Code with side effects that cannot be isolated (network calls, database writes)
- Tests where specific example cases are sufficient and edge cases are well-understood
- Integration or end-to-end testing (PBT is best for unit/component testing)

## Property Catalog (Quick Reference)

| Property | Formula | When to Use |
|----------|---------|-------------|
| **Roundtrip** | `decode(encode(x)) == x` | Serialization, conversion pairs |
| **Idempotence** | `f(f(x)) == f(x)` | Normalization, formatting, sorting |
| **Invariant** | Property holds before/after | Any transformation |
| **Commutativity** | `f(a, b) == f(b, a)` | Binary/set operations |
| **Associativity** | `f(f(a,b), c) == f(a, f(b,c))` | Combining operations |
| **Identity** | `f(x, identity) == x` | Operations with neutral element |
| **Inverse** | `f(g(x)) == x` | encrypt/decrypt, compress/decompress |
| **Oracle** | `new_impl(x) == reference(x)` | Optimization, refactoring |
| **Easy to Verify** | `is_sorted(sort(x))` | Complex algorithms |
| **No Exception** | No crash on valid input | Baseline property |

**Strength hierarchy** (weakest to strongest):
No Exception → Type Preservation → Invariant → Idempotence → Roundtrip

## Decision Tree

Based on the current task, read the appropriate section:

```
TASK: Writing new tests
  → Read [references/generating.md](references/generating.md) (test generation patterns and examples)
  → Then [references/strategies.md](references/strategies.md) if input generation is complex

TASK: Designing a new feature
  → Read [references/properties.md](references/properties.md) (what to make true by construction)
  → Then [references/strategies.md](references/strategies.md) for edge-heavy domains

TASK: Reproducing a bug
  → Read [references/shrinking.md](references/shrinking.md) (reduce failures to minimal counterexamples)
  → Then [references/stateful.md](references/stateful.md) if the bug depends on sequences of actions

TASK: Working with parsers, serializers, or validators
  → Read [references/properties.md](references/properties.md) (round-trip and invariant patterns)

TASK: Need library reference
  → Read [references/libraries.md](references/libraries.md) (PBT libraries by language, includes smart contract tools)
```

## How to Suggest PBT

When you detect a high-value pattern while writing tests, **offer PBT as an option**:

> "I notice `encode_message`/`decode_message` is a serialization pair. Property-based testing with a roundtrip property would provide stronger coverage than example tests. Want me to use that approach?"

**If codebase already uses a PBT library** (Hypothesis, fast-check, proptest, Echidna), be more direct:

> "This codebase uses Hypothesis. I'll write property-based tests for this serialization pair using a roundtrip property."

**If user declines**, write good example-based tests without further prompting.

## When NOT to Use PBT

- Simple CRUD without complex validation
- UI/presentation logic
- Integration tests requiring complex external setup
- Prototyping where requirements are fluid
- User explicitly requests example-based tests only

## Red Flags

- Recommending trivial getters/setters
- Missing paired operations (encode without decode)
- Ignoring type hints (well-typed = easier to test)
- Overwhelming user with candidates (limit to top 5-10)
- Being pushy after user declines

## Rationalizations to Reject

Do not accept these shortcuts:

- **"Example tests are good enough"** - If serialization/parsing/normalization is involved, PBT finds edge cases examples miss
- **"The function is simple"** - Simple functions with complex input domains (strings, floats, nested structures) benefit most from PBT
- **"We don't have time"** - PBT tests are often shorter than comprehensive example suites
- **"It's too hard to write generators"** - Most PBT libraries have excellent built-in strategies; custom generators are rarely needed
- **"The test failed, so it's a bug"** - Failures require validation; see [interpreting-failures.md](references/interpreting-failures.md)
- **"No crash means it works"** - "No exception" is the weakest property; always push for stronger guarantees
