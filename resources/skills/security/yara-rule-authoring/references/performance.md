# YARA-X Performance Guidelines

Fast rules come from strong atoms and cheap early exits. The engine is fast, but poor pattern design still forces expensive verification work.

## Mental Model

YARA scanning is effectively:

1. extract atoms
2. find atom hits quickly
3. verify the full string and condition

Phase 3 is where slow rules burn time. Your job is to keep the candidate set small.

## What Makes a Good Atom

Good atoms are:

- at least four bytes long
- stable, not wildcard-heavy
- unusual in benign files

Bad atoms are:

- too short
- repetitive bytes
- common header or library sequences

## Common Performance Killers

### Short Strings

```yara
$bad = "abc"
$good = "abcdef"
```

### Unbounded Regex

```yara
$bad = /https?:\/\/.*/
$good = /https?:\/\/[a-z0-9\.\-]{5,50}\//
```

### Leading Wildcards

```yara
$bad = { ?? ?? 4D 5A 90 00 }
$good = { 4D 5A 90 00 ?? ?? }
```

### Common Byte Sequences

Avoid rules that key off platform boilerplate unless you combine it with something family-specific.

## Short-Circuit Pattern

Order conditions from cheapest to most expensive:

```yara
condition:
    filesize < 10MB and
    uint16(0) == 0x5A4D and
    $mutex and
    any of ($c2_*) and
    pe.imphash() == "abc123"
```

## Regex Rules

- every regex should have an extractable literal anchor
- prefer bounded repetition
- avoid nested quantifiers and greedy wildcards

```yara
$good = /eval\s*\(\s*(atob|unescape)\s*\(/ nocase
```

## Modules vs Direct Byte Checks

Modules are worth the cost when you need structured data, but do not load them for checks you can do with simple header bytes.

Use modules for:

- PE imports or sections
- CRX or DEX structure
- rich metadata checks

Use direct byte checks for:

- file magic
- tiny fixed offsets

## Review Heuristic

If the rule has broad strings, unbounded regex, and expensive module logic before any cheap filter, treat it as a performance bug even if it still matches correctly.
