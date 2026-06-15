# Constant-Time Analysis: Swift

Swift compiles to native code through LLVM, so the same constant-time concerns
that apply to C, C++, Rust, and Go also apply here.

## What to Watch For

Swift source can hide timing-sensitive behavior behind friendly syntax. The
highest-signal review targets are:

- division or remainder on secret-derived values
- branches or ternaries on secret-derived values
- table lookups with secret-derived indices
- standard equality checks on secret byte strings
- optional or enum control flow that depends on secret state

## Review Patterns

### Secret-Dependent Branching

```swift
let result = secret != 0 ? a : b
```

This reads cleanly but still creates branch-dependent behavior. Prefer
mask-based selection when the algorithm requires constant-time semantics.

### Non-Constant Comparisons

```swift
if computed == expected {
    // early-exit compare path
}
```

Standard equality on strings, arrays, or byte buffers is not a constant-time
comparison guarantee. Prefer a constant-time byte-wise comparison routine or a
reviewed crypto library helper.

### Secret-Indexed Lookup

```swift
let value = lookupTable[Int(secretIndex)]
```

This is a cache-timing review trigger even if the syntax looks harmless.

## Apple Platform Guidance

Prefer platform crypto libraries over custom constant-time implementations when
they cover the required primitive:

- CryptoKit for common modern primitives
- Security framework for secure random bytes and keychain access

That does not remove the need to audit surrounding control flow, comparisons,
and indexing logic.

## Swift-Specific Footguns

Swift adds a few language-level review triggers:

- optional unwrapping paths that branch on secret presence
- `switch` over secret-derived enums or tags
- collection and string operations whose behavior depends on data shape
- implicit copies or conversions that obscure the real comparison path

These are not automatically unsafe, but they deserve explicit review in
cryptographic code.

## Architecture Notes

The backend and architecture still matter:
- `arm64` on iPhone, iPad, Apple Watch, and Apple Silicon Macs
- `x86_64` on older Intel Macs

If the code is security-critical, validate the actual production architecture
instead of assuming one assembly profile generalizes to all targets.

## Practical Workflow

1. Review Swift source for branches, division, and table access driven by secret
   values.
2. Prefer reviewed library primitives for compare, key generation, and MAC
   operations.
3. Inspect generated output only when the source is ambiguous or the path is
   critical.
4. Run timing-oriented tests on the target architecture for the final check.

## Detection Checklist

| Pattern | Risk |
|---|---|
| `/` or `%` on secret-derived values | variable-time arithmetic |
| ternary or `if` on secret-derived values | branch timing |
| `switch` on secret-derived tags | branch timing |
| direct `==` on secret bytes or strings | early-exit comparison |
| lookup table indexed by secret | cache timing |
| custom crypto helpers over library primitives | hidden implementation risk |

Use this reference as the Swift-specific review filter, then pair it with the
general native-code guidance in the constant-time skill.
