# YARA Expert Heuristics

## Rationalizations to Reject

When you catch yourself thinking these, stop and reconsider.

| Rationalization | Expert Response |
|-----------------|-----------------|
| "This generic string is unique enough" | Test against goodware first. Your intuition is wrong. |
| "yarGen gave me these strings" | yarGen suggests, you validate. Check each one manually. |
| "It works on my 10 samples" | 10 samples ≠ production. Use VirusTotal goodware corpus. |
| "One rule to catch all variants" | Causes FP floods. Target specific families. |
| "I'll make it more specific if we get FPs" | Write tight rules upfront. FPs burn trust. |
| "This hex pattern is unique" | Unique in one sample ≠ unique across malware ecosystem. |
| "Performance doesn't matter" | One slow rule slows entire ruleset. Optimize atoms. |
| "PEiD rules still work" | Obsolete. 32-bit packers aren't relevant. |
| "I'll add more conditions later" | Weak rules deployed = damage done. |
| "This is just for hunting" | Hunting rules become detection rules. Same quality bar. |
| "The API name makes it malicious" | Legitimate software uses same APIs. Need behavioral context. |
| "any of them is fine for these common strings" | Common strings + any = FP flood. Use `any of` only for individually unique strings. |
| "This regex is specific enough" | `/fetch.*token/` matches all auth code. Add exfil destination requirement. |
| "The JavaScript looks clean" | Attackers poison legitimate code with injects. Check for eval+decode chains. |
| "I'll use .* for flexibility" | Unbounded regex = performance disaster + memory explosion. Use `.{0,30}`. |
| "I'll use --relaxed-re-syntax everywhere" | Masks real bugs. Fix the regex instead of hiding problems. |

---

## String Selection Heuristics

**String selection:** Mutex names are gold; C2 paths silver; error messages bronze. Stack strings are almost always unique. If you need >6 strings, you're over-fitting.

**Condition design:** Start with `filesize <`, then magic bytes, then strings, then modules. If >5 lines, split into multiple rules.

**Quality signals:** yarGen output needs 80% filtering. Rules matching <50% of variants are too narrow; matching goodware are too broad.

---

## Modifier Discipline

- **Never use `nocase` or `wide` speculatively** — only when you have confirmed evidence the case/encoding varies in samples
- `nocase` doubles atom generation; `wide` doubles string matching — both have real costs
- "If you don't have a clear reason for using those modifiers, don't do it" — Kaspersky Applied YARA

---

## Regex Anchoring

- Regex without a 4+ byte literal substring **evaluates at every file offset** — catastrophic performance
- Always anchor regex to a distinctive literal: `/mshta\.exe http:\/\/.../` not `/http:\/\/.../`
- If you can't anchor, consider hex pattern with wildcards instead

---

## Loop Discipline

- Always bound loops with filesize: `filesize < 100KB and for all i in (1..#a) : ...`
- Unbounded `#a` can be thousands in large files — exponential slowdown

---

## YARA-X tips

- `$_unused` to suppress warnings
- `private $s` to hide from output
- `yr check` + `yr fmt` before every commit

---

## Common Mistakes

| Mistake | Bad | Good |
|---------|-----|------|
| API names as indicators | `"VirtualAlloc"` | Hex pattern of call site + unique mutex |
| Unbounded regex | `/https?:\/\/.*/` | `/https?:\/\/[a-z0-9]{8,12}\.onion/` |
| Missing file type filter | `pe.imports(...)` first | `uint16(0) == 0x5A4D and filesize < 10MB` first |
| Short strings | `"abc"` (3 bytes) | `"abcdef"` (4+ bytes) |
| Unescaped braces (YARA-X) | `/config{key}/` | `/config\{key\}/` |

---

## Performance Optimization

**Quick wins:** Put `filesize` first, avoid `nocase`, bounded regex `{1,100}`, prefer hex over regex.

**Red flags:** Strings <4 bytes, unbounded regex (`.*`), modules without file-type filter.

---

## Quality YARA Rule Repositories

Learn from production rules. These repositories contain well-tested, properly attributed rules:

| Repository | Focus | Maintainer |
|------------|-------|------------|
| [Neo23x0/signature-base](https://github.com/Neo23x0/signature-base) | 17,000+ production rules, multi-platform | Florian Roth |
| [Elastic/protections-artifacts](https://github.com/elastic/protections-artifacts) | 1,000+ endpoint-tested rules | Elastic Security |
| [reversinglabs/reversinglabs-yara-rules](https://github.com/reversinglabs/reversinglabs-yara-rules) | Threat research rules | ReversingLabs |
| [imp0rtp3/js-yara-rules](https://github.com/imp0rtp3/js-yara-rules) | JavaScript/browser malware | imp0rtp3 |
| [InQuest/awesome-yara](https://github.com/InQuest/awesome-yara) | Curated index of resources | InQuest |
