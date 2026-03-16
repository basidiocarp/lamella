---
name: yara-rule-authoring
description: >
  Guides authoring of high-quality YARA-X detection rules for malware identification.
  Use when writing, reviewing, or optimizing YARA rules. Covers naming conventions,
  string selection, performance optimization, migration from legacy YARA, and false
  positive reduction.
---

# YARA-X Rule Authoring


## Contents

- [Core Principles](#core-principles)
- [Quick Reference](#quick-reference)
- [Essential Commands](#essential-commands)
- [Platform Magic Bytes](#platform-magic-bytes)
- [Example Rule](#example-rule)
- [Workflow](#workflow)
- [Quality Checklist](#quality-checklist)
- [Common Mistakes](#common-mistakes)
- [YARA-X Migration](#yara-x-migration)
- [References](#references)

Write detection rules that catch malware without drowning in false positives.

> **This skill targets YARA-X**, the Rust-based successor to legacy YARA. YARA-X powers VirusTotal's production systems.

## Core Principles

1. **Strings must generate good atoms** - 4-byte subsequences for fast matching
2. **Target specific families** - "Detects LockBit 3.0" not "Detects ransomware"
3. **Test against goodware** - Validate against VirusTotal or clean file set
4. **Short-circuit first** - `filesize < 10MB and uint16(0) == 0x5A4D` before strings
5. **Metadata is documentation** - Future you needs to know what/why/where

## Quick Reference

### Naming Convention
```
{CATEGORY}_{PLATFORM}_{FAMILY}_{VARIANT}_{DATE}
```
Prefixes: `MAL_`, `HKTL_`, `WEBSHELL_`, `EXPL_`, `SUSP_`, `GEN_`
Platforms: `Win_`, `Lnx_`, `Mac_`, `Android_`, `CRX_`
Example: `MAL_Win_Emotet_Loader_Jan25`

### Required Metadata
```yara
meta:
    description = "Detects Example malware via unique mutex and C2 path"
    author = "Your Name <email@example.com>"
    reference = "https://example.com/analysis"
    date = "2025-01-29"
```

### String Selection
**Good:** Mutex names, PDB paths, C2 paths, stack strings, config markers
**Bad:** API names, common executables, format specifiers, generic paths

### Condition Order
1. `filesize < 10MB` (instant)
2. `uint16(0) == 0x5A4D` (nearly instant)
3. String matches (cheap)
4. Module checks (expensive)

## Essential Commands

```bash
# Install
brew install yara-x  # macOS
cargo install yara-x  # or via cargo

# Validate and format
yr check rule.yar
yr fmt -w rule.yar

# Scan with string matches
yr scan -s rule.yar sample.exe

# Inspect file structure
yr dump -m pe sample.exe --output-format yaml
```

## Platform Magic Bytes

| Platform | Magic Check |
|----------|-------------|
| Windows PE | `uint16(0) == 0x5A4D` |
| macOS 64-bit | `uint32(0) == 0xFEEDFACF` |
| macOS Universal | `uint32(0) == 0xCAFEBABE` |
| Office/ZIP | `uint32(0) == 0x504B0304` |

## Example Rule

```yara
rule MAL_Win_Example_Jan25
{
    meta:
        description = "Detects Example malware via unique mutex"
        author = "Analyst <analyst@example.com>"
// ... (9 lines trimmed)
        uint16(0) == 0x5A4D and
        $mutex and $c2
}
```

## Workflow

1. **Gather samples** - Multiple samples; single-sample rules are brittle
2. **Extract candidates** - `yarGen -m samples/ --excludegood`
3. **Validate quality** - yarGen needs 80% filtering
4. **Write rule** - Follow template with metadata
5. **Lint** - `yr check`, `yr fmt`
6. **Goodware test** - VirusTotal corpus or clean files
7. **Deploy** - Monitor for FPs

## Quality Checklist

- [ ] Name follows convention
- [ ] Description starts with "Detects"
- [ ] All strings 4+ bytes with good atoms
- [ ] Condition starts with cheap checks
- [ ] `yr check` passes
- [ ] `yr fmt --check` passes
- [ ] Zero goodware matches

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| API names as indicators | Use call site hex + unique mutex |
| Unbounded regex `.*` | Bound it: `.{0,30}` |
| Missing file type filter | Add `uint16(0) == 0x5A4D` first |
| Short strings <4 bytes | Find longer alternatives |
| Unescaped `{` in regex | Escape: `\{` |

## YARA-X Migration

```bash
yr check --relaxed-re-syntax rules/  # Find issues
# Fix each, then:
yr check rules/  # Verify
```

Common fixes: escape `{` in regex, base64 strings need 3+ chars, use `#a - 1` not `@a[-1]`

## References

- [decision-trees.md](references/decision-trees.md) - String quality, string matching, FP debugging
- [platform-patterns.md](references/platform-patterns.md) - macOS, JavaScript, indicators by platform
- [expert-heuristics.md](references/expert-heuristics.md) - Common mistakes, modifier discipline, repositories
### Additional Resources


| File | Path |
|------|------|
| [Crx Module](references/crx-module.md) | `references/crx-module.md` |
| [Dex Module](references/dex-module.md) | `references/dex-module.md` |
| [Performance](references/performance.md) | `references/performance.md` |
| [Strings](references/strings.md) | `references/strings.md` |
| [Style Guide](references/style-guide.md) | `references/style-guide.md` |
| [Testing](references/testing.md) | `references/testing.md` |
- [Atom Analyzer](scripts/atom_analyzer.py)
- [Pyproject](scripts/pyproject.toml)
- [Yara Lint](scripts/yara_lint.py)
- [Rule Development](workflows/rule-development.md)
