# YARA-X String Selection

Choosing the right strings matters more than clever condition logic. Good rules start with strings that are distinctive, stable, and cheap to evaluate.

## Quick String Checklist

Before keeping a string, ask:

- Is it at least four bytes long?
- Does it contain four reasonably unique consecutive bytes?
- Is it family-specific instead of generic platform noise?
- Would it also show up in benign software?
- Does it need modifiers that multiply the search space?

If the answer to the last two questions is “yes,” the string probably needs more context or should be rejected.

## High-Value Sources

Strong candidates:

- mutex names
- unique C2 paths
- configuration markers
- unusual error messages
- PDB paths
- stack strings or runtime-decoded strings

Weak candidates:

- Windows API names
- common paths like `C:\Windows\System32`
- generic format strings
- library names

## String Types

### Text Strings

```yara
$text = "Hello World"
$text_wide = "Hello" wide
$text_both = "Hello" ascii wide
$text_nocase = "hello" nocase
$text_full = "hello" fullword
```

### Hex Strings

```yara
$hex = { 4D 5A 90 00 }
$wild = { 4D 5A ?? ?? }
$jump = { 4D 5A [2-4] 50 45 }
$alt = { 4D 5A ( 90 00 | 00 00 ) }
```

Keep jumps bounded. Unbounded jumps are usually a performance bug.

### Regular Expressions

```yara
$url = /https?:\/\/[a-z0-9]{5,50}\.onion/
```

Prefer bounded quantifiers. Avoid patterns like `/https?:\/\/.*/` that happily overmatch.

For YARA-X specifically:

- escape literal braces in regexes
- validate regex-heavy rules with `yr check`
- remember that `base64` needs strings of at least three characters

## Modifier Judgment

| Modifier | Cost | Guidance |
|----------|------|----------|
| `wide` | Low | Good for Windows Unicode strings |
| `nocase` | Medium | Use only when case variation is realistic |
| `fullword` | Low | Useful to prevent substring hits |
| `xor` | High | Prefer a narrow key range or a known key |
| `base64` | Medium | Good for short encoded markers, not everything |
| `private` | None | Hide helper strings from scan output |

Example:

```yara
strings:
    $public = "malware_marker"
    private $helper = "internal_pattern"

condition:
    $public and $helper
```

## Reject These by Default

```yara
$bad = "VirtualAlloc"
$bad = "CreateRemoteThread"
$bad = "cmd.exe"
$bad = "%s"
$bad = "KERNEL32.dll"
```

These strings are common and rarely family-specific on their own.

## Stack Strings

Stack-built or runtime-built strings are often high value because benign tools rarely reproduce the exact write sequence.

```yara
$stack_cmd = {
    C6 45 ?? 63
    C6 45 ?? 6D
    C6 45 ?? 64
    C6 45 ?? 2E
    C6 45 ?? 65
    C6 45 ?? 78
    C6 45 ?? 65
}
```

If automated extraction yields only imports and library noise, look for stack strings next.

## Hex Pattern Rules

- put stable bytes first to improve atom quality
- prefer one or two precise wildcards over a loose block
- avoid unlimited gaps

Good:

```yara
{ 4D 5A 90 00 ?? ?? }
```

Bad:

```yara
{ ?? ?? 4D 5A 90 00 }
{ 4D 5A [-] 50 45 }
```

## Combining Strings

Group strings by role:

```yara
strings:
    $mutex = "Global\\MyMutex"
    $config = { 43 4F 4E 46 49 47 }
    $c2_a = "/api/beacon/check"
    $c2_b = "/api/task/pull"

condition:
    all of ($mutex, $config) and any of ($c2_*)
```

That structure is easier to review than one giant `any of them` rule.

## yarGen Output

Treat yarGen as a candidate generator, not an answer key:

```bash
python yarGen.py -m /path/to/samples --excludegood
```

Expect to reject most output. Keep the strings that are both distinctive and explainable.

## JavaScript-Specific Patterns

Useful obfuscation indicators:

```yara
$hex_var = /_0x[a-fA-F0-9]{4,}/
$eval_decode = /eval\s*\(\s*(unescape|atob)\s*\(/ nocase
$func_decode = /Function\s*\(\s*atob\s*\(/ nocase
$hex_array = /var\s+\w+\s*=\s*\[\s*["']\\x[0-9a-fA-F]+/
```

Useful Unicode stealth indicators:

```yara
$vs_utf8 = { EF B8 (80|81|82|83|84|85|86|87|88|89|8A|8B|8C|8D|8E|8F) }
$zwc = { E2 80 (8B|8C|8D|8E|8F|AA|AB|AC|AD|AE|AF) }
```

These get stronger when combined with `eval`, `Function`, or exfiltration markers.

## Exfiltration and Credential Theft Patterns

Good exfil indicators:

```yara
$discord_webhook = /discord\.com\/api\/webhooks\/\d+\//
$telegram_bot = /api\.telegram\.org\/bot[0-9]+:[A-Za-z0-9_-]+/
$pastebin_raw = /pastebin\.com\/raw\//
```

Credential-theft context:

```yara
strings:
    $chrome_login = "Login Data"
    $firefox_logins = "logins.json"
    $npmrc = ".npmrc"
    $ssh_key = /id_rsa|id_ed25519/
    $aws_creds = "credentials"
    $read_file = /fs\.readFile|readFileSync/

condition:
    any of ($chrome_login, $firefox_logins, $npmrc, $ssh_key, $aws_creds) and
    $read_file
```

## Review Heuristic

If you cannot explain why a string is specific to the malware family, do not keep it just because it matched the sample.
