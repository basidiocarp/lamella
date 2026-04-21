---
name: constant-time-crypto
description: "Detects and tests timing side-channel vulnerabilities in cryptographic code."
origin: lamella
---

# Constant-Time Crypto

Use this skill when secret-dependent operations may leak timing information. Keep this file as the routing layer for triage, analyzer use, and dynamic testing; language and tool detail lives in the references.

## When to Use

- Reviewing cryptographic code that touches secrets directly
- Investigating divisions, branches, or table lookups on secret-derived values
- Verifying a constant-time claim across multiple compilers or architectures
- Pairing static analyzer output with dudect or timecop confirmation

## High-Risk Patterns

| Pattern | Why It Leaks | Typical Fix |
|---------|--------------|-------------|
| Branch on secret | Different control flow | Constant-time select or masking |
| Table lookup by secret index | Cache-visible access pattern | Bit-sliced or constant-time lookup |
| Division or modulo on secret | Variable instruction latency | Barrett reduction or multiply-by-inverse |
| Secret-dependent comparison | Early exit | Constant-time compare primitive |

## Core Workflow

1. Identify whether the flagged operation depends on secret data.
2. Run the static analyzer on the relevant file or binary form.
3. Repeat on the architectures and optimization levels that matter.
4. Confirm suspicious findings with dudect or timecop when practical.
5. Patch with constant-time constructs and re-run the checks.

## Static Analyzer Quick Start

```bash
uv run {baseDir}/ct_analyzer/analyzer.py <source_file>
uv run {baseDir}/ct_analyzer/analyzer.py --json <source_file>
uv run {baseDir}/ct_analyzer/analyzer.py --arch x86_64 <source_file>
uv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 <source_file>
uv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 <source_file>
uv run {baseDir}/ct_analyzer/analyzer.py --opt-level O3 <source_file>
```

## Dynamic Follow-Up

| Goal | Tool |
|------|------|
| Quick statistical leak check | `dudect` |
| Localize a leak in execution | `timecop` |
| High-assurance proof workflow | `ct-verif` or related formal tooling |

## References

- [references/vulnerability-patterns.md](references/vulnerability-patterns.md)
- [references/tool-guides.md](references/tool-guides.md)
- [references/compiled.md](references/compiled.md)
- [references/vm-compiled.md](references/vm-compiled.md)
- [references/swift.md](references/swift.md)
- [references/kotlin.md](references/kotlin.md)
- [references/php.md](references/php.md)
- [references/javascript.md](references/javascript.md)
- [references/python.md](references/python.md)
- [references/ruby.md](references/ruby.md)
- [references/case-studies.md](references/case-studies.md)
