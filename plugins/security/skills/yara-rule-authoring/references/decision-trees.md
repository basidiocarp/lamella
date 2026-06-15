# YARA Rule Authoring Decision Trees

Use these decision trees to decide whether to keep refining a rule, tighten it,
or abandon the current approach.

## Is This String Good Enough?

Choose strings that survive family variation but do not appear broadly in
goodware.

```text
candidate string
├─ too short or repetitive?
│  └─ reject it
├─ generic API, path, or command?
│  └─ add surrounding context or drop it
├─ common in system files or benign apps?
│  └─ reject it
├─ specific to this family or cluster?
│  └─ keep it
└─ only useful in combination?
   └─ group it with stronger indicators
```

## `all of` vs `any of`

```text
are strings individually strong?
├─ yes
│  └─ `any of` can work
├─ no, but the combination is distinctive
│  └─ use `all of` or grouped requirements
└─ mixed confidence
   └─ require all core strings and any of the variant strings
```

If false positives rise, tighten from `any` to grouped or `all` conditions.

## When to Stop Refining the Same Rule

Pivot when:
- you cannot find multiple distinctive indicators
- the rule keeps matching benign software after tightening
- only generic API names or paths are available
- performance stays poor after basic prefilters
- you cannot describe clearly what the rule is meant to catch

At that point, switch to structure, metadata, or packer-focused detection.

## False-Positive Triage

```text
false positive found
├─ identify which string or condition matched
├─ ask whether the indicator is generic
├─ ask whether the combination is still too broad
├─ add a family-specific marker or structural check
└─ if the rule still needs broad generic strings, redesign it
```

Use `yr scan -s` or equivalent matched-string output early. It shortens the
tightening loop.

## Text vs Hex vs Regex

| Use this | When |
|---|---|
| text strings | stable ASCII or UTF-16 content exists |
| hex patterns | call-site structure or byte adjacency matters |
| regex | variable separators or bounded text variation matters |
| xor/base64 modifiers | encoding varies but the payload string is still useful |

Default to the simplest readable representation that still captures the signal.

## Packed Sample Check

Do this before investing in a string-heavy rule.

```text
sample packed?
├─ high entropy and few readable strings
│  └─ detect the packer or unpack first
├─ stable payload strings are visible
│  └─ continue with string and structure checks
└─ metadata or layout is the only stable signal
   └─ pivot to structural detection
```

## Structure Pivot

When strings fail, ask what stays stable:
- import patterns or hashes
- section layout and entropy
- embedded resources
- archive or extension metadata
- family-specific byte patterns around loaders or decryptors

## Module vs Raw Checks

Use a module when the file format is complex or the feature is expensive to
reimplement. Use raw offset and magic-byte checks when the property is simple
and hot-path performance matters.

## Authoring Rule

If the decision tree keeps telling you the signal is generic, believe it. A
shorter, narrower rule is usually better than a clever broad one.
