# YARA Rule Authoring Decision Trees

## Is This String Good Enough?

```
Is this string good enough?
├─ Less than 4 bytes?
│  └─ NO — find longer string
├─ Contains repeated bytes (0000, 9090)?
│  └─ NO — add surrounding context
├─ Is an API name (VirtualAlloc, CreateRemoteThread)?
│  └─ NO — use hex pattern of call site instead
├─ Appears in Windows system files?
│  └─ NO — too generic, find something unique
├─ Is it a common path (C:\Windows\, cmd.exe)?
│  └─ NO — find malware-specific paths
├─ Unique to this malware family?
│  └─ YES — use it
└─ Appears in other malware too?
   └─ MAYBE — combine with family-specific marker
```

---

## When to Use "all of" vs "any of"

```
Should I require all strings or allow any?
├─ Strings are individually unique to malware?
│  └─ any of them (each alone is suspicious)
├─ Strings are common but combination is suspicious?
│  └─ all of them (require the full pattern)
├─ Strings have different confidence levels?
│  └─ Group: all of ($core_*) and any of ($variant_*)
└─ Seeing many false positives?
   └─ Tighten: switch any → all, add more required strings
```

**Lesson from production:** Rules using `any of ($network_*)` where strings included "fetch", "axios", "http" matched virtually all web applications. Switching to require credential path AND network call AND exfil destination eliminated FPs.

---

## When to Abandon a Rule Approach

Stop and pivot when:

- **yarGen returns only API names and paths** → See [When Strings Fail, Pivot to Structure](#when-strings-fail-pivot-to-structure)

- **Can't find 3 unique strings** → Probably packed. Target the unpacked version or detect the packer.

- **Rule matches goodware files** → Strings aren't unique enough. 1-2 matches = investigate and tighten; 3-5 matches = find different indicators; 6+ matches = start over.

- **Performance is terrible even after optimization** → Architecture problem. Split into multiple focused rules or add strict pre-filters.

- **Description is hard to write** → The rule is too vague. If you can't explain what it catches, it catches too much.

---

## Debugging False Positives

```
FP Investigation Flow:
│
├─ 1. Which string matched?
│     Run: yr scan -s rule.yar false_positive.exe
│
// ... (8 lines trimmed)
│
└─ 5. Is the malware using common techniques?
      └─ Target malware-specific implementation details, not the technique
```

---

## Hex vs Text vs Regex

```
What string type should I use?
│
├─ Exact ASCII/Unicode text?
│  └─ TEXT: $s = "MutexName" ascii wide
│
// ... (8 lines trimmed)
│
└─ Unknown encoding (XOR, base64)?
   └─ TEXT with modifier: $s = "config" xor(0x00-0xFF)
```

---

## Is the Sample Packed? (Check First)

Before writing any string-based rule:

```
Is the sample packed?
├─ Entropy > 7.0?
│  └─ Likely packed — find unpacked layer first
├─ Few/no readable strings?
│  └─ Likely packed — use entropy, PE structure, or packer signatures
├─ UPX/MPRESS/custom packer detected?
│  └─ Target the unpacked payload OR detect the packer itself
└─ Readable strings available?
   └─ Proceed with string-based detection
```

**Expert guidance:** Don't write rules against packed layers. The packing changes; the payload doesn't.

---

## When Strings Fail, Pivot to Structure

If yarGen returns only API names and generic paths:

```
String extraction failed — what now?
├─ High entropy sections?
│  └─ Use math.entropy() on specific sections
├─ Unusual imports pattern?
│  └─ Use pe.imphash() for import hash clustering
├─ Consistent PE structure anomalies?
│  └─ Target section names, sizes, characteristics
├─ Metadata present?
│  └─ Target version info, timestamps, resources
└─ Nothing unique?
   └─ This sample may not be detectable with YARA alone
```

**Expert guidance:** "One can try to use other file properties, such as metadata, entropy, import hashes or other data which stays constant." — Kaspersky Applied YARA Training

---

## When to Use Modules vs. Byte Checks

```
Should I use a module or raw bytes?
├─ Need imphash/rich header/authenticode?
│  └─ Use PE module — too complex to replicate
├─ Just checking magic bytes or simple offsets?
│  └─ Use uint16/uint32 — faster, no module overhead
├─ Checking section names/sizes?
│  └─ PE module is cleaner, but add magic bytes filter FIRST
├─ Checking Chrome extension permissions?
│  └─ Use crx module — string parsing is fragile
└─ Checking LNK target paths?
   └─ Use lnk module — LNK format is complex
```

**Expert guidance:** "Avoid the magic module — use explicit hex checks instead" — Neo23x0. Apply this principle: if do it with uint32(), don't load a module.

---

## JavaScript Detection Decision Tree

```
Writing a JavaScript rule?
├─ npm package?
│  ├─ Check package.json patterns
│  ├─ Look for postinstall/preinstall hooks
│  └─ Target exfil patterns: fetch + env access + credential paths
├─ Browser extension?
│  ├─ Chrome: Use crx module
│  └─ Others: Target manifest patterns, background script behaviors
├─ Standalone JS file?
│  ├─ Look for obfuscation markers: eval+atob, fromCharCode chains
│  ├─ Target unique function/variable names (often survive minification)
│  └─ Check for packed/encoded payloads
└─ Minified/webpack bundle?
   ├─ Target unique strings that survive bundling (URLs, magic values)
   └─ Avoid function names (will be mangled)
```
