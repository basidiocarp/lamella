# YARA-X DEX Module Reference

The `dex` module lets YARA-X inspect Android DEX structure directly. Use it for class names, method names, string content, and integrity checks rather than treating DEX files as raw blobs.

## Important Constraints

- Requires YARA-X v1.11.0 or later.
- The API is not compatible with the legacy YARA `dex` module.
- Always gate the rule with `dex.is_dex`.

```yara
import "dex"
```

## Core Fields

### Header

- `dex.header.magic`
- `dex.header.version`
- `dex.header.checksum`
- `dex.header.signature`
- `dex.header.file_size`

### Collections

- `dex.strings`
- `dex.types`
- `dex.fields`
- `dex.methods`
- `dex.class_defs`

### Convenience Helpers

- `dex.contains_string(pattern)`
- `dex.contains_method(pattern)`
- `dex.contains_class(pattern)`
- `dex.checksum()`
- `dex.signature()`

## Integrity Check Example

```yara
import "dex"

rule SUSP_DEX_ChecksumMismatch
{
    condition:
        dex.is_dex and
        dex.checksum() != dex.header.checksum
}
```

## Obfuscation Signals

### Single-Letter Class Names

```yara
import "dex"

rule SUSP_DEX_HeavyObfuscation
{
    condition:
        dex.is_dex and
        for 10 c in dex.class_defs : (
            c.class matches /^L[a-z]\/[a-z]\/[a-z];$/
        )
}
```

### Missing Source File Info

```yara
rule SUSP_DEX_StrippedDebugInfo
{
    condition:
        dex.is_dex and
        for all c in dex.class_defs : (
            c.source_file == ""
        )
}
```

### String Decryption or Packed Payload Hints

Look for combinations, not one-off indicators:

- base64 alphabets
- suspicious crypto method names
- reflective loading helpers

## Common Malware Patterns

### Reflection or Dynamic Loading

```yara
rule SUSP_DEX_ReflectionLoading
{
    condition:
        dex.is_dex and
        (
            dex.contains_class("Ldalvik/system/DexClassLoader;") or
            dex.contains_method("loadClass") or
            dex.contains_method("forName")
        )
}
```

### SMS or Accessibility Abuse

Strong combinations include:

- SMS interception APIs plus network clients
- accessibility-service methods plus overlay or gesture helpers

## Best Practices

- validate file type first
- prefer `contains_*()` helpers for broad presence checks
- combine class, method, and string signals
- test rules against legitimate Android apps to control false positives
- account for obfuscation by leaning on behavior, not only class names
