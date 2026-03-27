# YARA Rule Development Workflow

This guide walks through a practical YARA-X rule development cycle from samples to deployment.

## Overview

```text
Sample Collection
  -> String Extraction
  -> Rule Writing
  -> Validation
  -> False Positive Review
  -> Deployment
```

## Phase 1: Sample Collection

- Gather enough variants to avoid single-sample rules when possible.
- Check whether samples are packed before investing in string extraction.

```bash
# Check entropy
yr dump -m math sample.exe --output-format yaml | rg entropy

# Inspect PE structure
yr dump -m pe sample.exe --output-format yaml

# Inspect Android bytecode
yr dump -m dex classes.dex --output-format yaml
```

## Phase 2: String Extraction

Use `yarGen` for candidate strings, then clean the output for YARA-X:

```bash
python yarGen.py -m samples/ --excludegood --score --globalrule -o candidate_rule.yar
yr check candidate_rule.yar
yr fmt -w candidate_rule.yar
```

Use FLOSS when the sample is packed or the obvious strings are low quality:

```bash
floss sample.exe -o strings.txt
sort strings.txt | uniq -c | sort -rn | head -50
```

Keep mutex names, config markers, stack strings, PDB paths, and campaign-specific URLs. Drop generic APIs, paths, and short strings.

## Phase 3: Rule Writing

Start from a minimal YARA-X template:

```yara
rule {CATEGORY}_{PLATFORM}_{FAMILY}_{VARIANT}_{DATE}
{
    meta:
        description = "Detects {WHAT} via {HOW}"
        author = "Your Name <email@example.com>"
        reference = "https://analysis.example/report"
        date = "2026-03-27"
        hash = "{PRIMARY_SAMPLE_SHA256}"

    strings:
        $a = "{unique string 1}" ascii wide
        $b = "{unique string 2}" ascii wide
        $fp_legitimate = "{known good string}" ascii wide

    condition:
        filesize < 5MB and
        uint16(0) == 0x5A4D and
        1 of ($a, $b) and
        not $fp_legitimate
}
```

Keep conditions cheap-to-expensive:
1. file size
2. magic bytes
3. strings
4. loops and module calls
5. regex

## Phase 4: Validation

All three checks should pass before sample testing:

```bash
yr check rule.yar
yr fmt --check rule.yar
uv run {baseDir}/scripts/yara_lint.py rule.yar
```

Then test against:
- target malware samples
- packed and unpacked variants
- goodware corpus

## Phase 5: False Positive Review

If the rule matches goodware:
- tighten strings
- add exclusions
- replace generic APIs with more unique anchors
- restart if the pattern is fundamentally too common

## Phase 6: Deployment

Promote only rules that:
- match the target set
- avoid goodware
- pass formatting and linting
- include clear metadata and references
