---
name: yara-rule-authoring
description: "Guides authoring of high-quality YARA-X detection rules for malware identification."
origin: lamella
---

# YARA-X Rule Authoring

Use this skill to write or review YARA-X rules that are specific enough to catch a family without exploding false positives. Keep the main skill focused on rule quality; use the references for platform details, string heuristics, and testing workflow.

## Core Principles

1. Target a specific family or behavior.
2. Choose strings that produce strong atoms.
3. Start conditions with cheap filters like file type and size.
4. Test against goodware before calling a rule complete.
5. Treat metadata as analyst-facing documentation, not filler.

## Quick Template

```yara
rule MAL_Win_Example_Jan25
{
    meta:
        description = "Detects Example malware via unique mutex and C2 path"
        author = "Analyst <analyst@example.com>"
        date = "2025-01-29"

    strings:
        $mutex = "Global\\ExampleMutex" ascii wide
        $c2 = "/panel/gate.php" ascii

    condition:
        uint16(0) == 0x5A4D and
        filesize < 10MB and
        all of them
}
```

## Core Workflow

1. Gather multiple samples.
2. Extract candidate strings and remove weak indicators.
3. Write the first rule with strict metadata and cheap prefilters.
4. Run `yr check` and `yr fmt`.
5. Test against clean files and revise for false positives.

## Essential Commands

```bash
yr check rule.yar
yr fmt -w rule.yar
yr scan -s rule.yar sample.exe
yr dump -m pe sample.exe --output-format yaml
```

## References

- [references/style-guide.md](references/style-guide.md)
- [references/strings.md](references/strings.md)
- [references/performance.md](references/performance.md)
- [references/testing.md](references/testing.md)
- [references/decision-trees.md](references/decision-trees.md)
- [references/platform-patterns.md](references/platform-patterns.md)
- [references/expert-heuristics.md](references/expert-heuristics.md)
- [references/crx-module.md](references/crx-module.md)
- [references/dex-module.md](references/dex-module.md)
- [workflows/rule-development.md](workflows/rule-development.md)
