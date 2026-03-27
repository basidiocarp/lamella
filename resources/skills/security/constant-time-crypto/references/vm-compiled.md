# Constant-Time Analysis: VM-Compiled Languages

Use this reference for Java and C# code where source compiles to bytecode and
then passes through a JIT runtime. The main review target is still the emitted
bytecode and the source constructs that produce dangerous instruction families.

## What Changes in VM Languages

VM pipelines add an intermediate step:

```text
source -> bytecode -> JIT/runtime -> native machine code
```

This creates two practical constraints:

- bytecode is easier to inspect consistently than JIT output
- the runtime may still introduce timing differences that bytecode review
  cannot prove away

So the workflow is:
1. review source for secret-dependent operations
2. inspect bytecode when needed
3. validate critical paths dynamically on the production runtime

## High-Risk Instruction Families

### JVM

| Category | Examples | Why it matters |
|---|---|---|
| division and remainder | `idiv`, `ldiv`, `irem`, `lrem` | operand-dependent latency |
| conditional branches | `ifeq`, `ifne`, `if_icmp*` | secret-driven control flow |
| table and indexed access | `*aload`, `*astore`, `tableswitch`, `lookupswitch` | cache and branch side channels |

### CIL / .NET

| Category | Examples | Why it matters |
|---|---|---|
| division and remainder | `div`, `div.un`, `rem`, `rem.un` | operand-dependent latency |
| conditional branches | `beq`, `bne`, `brtrue`, `brfalse` | secret-driven control flow |
| indexed loads and stores | `ldelem.*`, `stelem.*`, `switch` | cache and dispatch side channels |

## Source-Level Review Patterns

Prioritize the constructs that most often survive into risky bytecode:

- division or modulo on secret-derived values
- `if`, ternary, or `switch` on secret-derived values
- array or lookup-table indexing with secret-derived offsets
- early-return comparisons for tags, MACs, tokens, or passwords
- use of non-cryptographic randomness in key or nonce generation

## Safer Substitutions

### Java

```java
if (MessageDigest.isEqual(computed, expected)) {
    // constant-time compare path
}
```

Prefer `MessageDigest.isEqual` or a crypto-library equivalent over
`Arrays.equals` for secret material.

### C#

```csharp
using System.Security.Cryptography;

if (CryptographicOperations.FixedTimeEquals(computed, expected)) {
    // constant-time compare path
}
```

Prefer `CryptographicOperations.FixedTimeEquals` over `SequenceEqual` for
secret-bearing comparisons.

For secret-dependent selection, replace branches with mask-based logic where the
algorithm supports it.

## Runtime Caveats

Even safe-looking bytecode is not a mathematical proof:

- tiered compilation can change generated code over time
- speculative optimization can reshape control flow
- different JVM and CLR versions can behave differently

Treat JIT behavior as a verification concern, not a reason to skip source review.

## Minimal Analysis Workflow

1. Flag secret-dependent division, branching, and table access in source.
2. Inspect bytecode when the source pattern is ambiguous.
3. Run a timing or statistical check on the production runtime for critical
   primitives.
4. Prefer well-reviewed library primitives over custom constant-time code where
   possible.

## Tooling Notes

- Bytecode inspection is the stable review surface.
- Dynamic timing tests still matter for hot cryptographic paths.
- AOT builds can reduce JIT variability, but they do not automatically make code
  constant-time.

Use this as the Java/C# review lens, then pair it with the tool guidance in
`tool-guides.md`.
