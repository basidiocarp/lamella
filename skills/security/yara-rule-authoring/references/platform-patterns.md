# YARA Platform-Specific Patterns

## Platform Overview

YARA works on any file type. Adapt patterns to your target:

| Platform | Magic Bytes | Bad Strings | Good Strings |
|----------|-------------|-------------|--------------|
| **Windows PE** | `uint16(0) == 0x5A4D` | API names, Windows paths | Mutex names, PDB paths |
| **macOS Mach-O** | `uint32(0) == 0xFEEDFACE` (32-bit), `0xFEEDFACF` (64-bit), `0xCAFEBABE` (universal) | Common Obj-C methods | Keylogger strings, persistence paths |
| **JavaScript/Node** | (none needed) | `require`, `fetch`, `axios` | Obfuscator signatures, eval+decode chains |
| **npm/pip packages** | (none needed) | `postinstall`, `dependencies` | Suspicious package names, exfil URLs |
| **Office docs** | `uint32(0) == 0x504B0304` | VBA keywords | Macro auto-exec, encoded payloads |
| **VS Code extensions** | (none needed) | `vscode.workspace` | Uncommon activationEvents, hidden file access |
| **Chrome extensions** | Use `crx` module | Common Chrome APIs | Permission abuse, manifest anomalies |
| **Android apps** | Use `dex` module | Standard DEX structure | Obfuscated classes, suspicious permissions |

---

## macOS Malware Detection

No dedicated Mach-O module exists yet. Use magic byte checks + string patterns:

### Magic bytes

```yara
// Mach-O 32-bit
uint32(0) == 0xFEEDFACE
// Mach-O 64-bit
uint32(0) == 0xFEEDFACF
// Universal binary (fat binary)
uint32(0) == 0xCAFEBABE or uint32(0) == 0xBEBAFECA
```

### Good indicators for macOS malware

- Keylogger artifacts: `CGEventTapCreate`, `kCGEventKeyDown`
- SSH tunnel strings: `ssh -D`, `tunnel`, `socks`
- Persistence paths: `~/Library/LaunchAgents`, `/Library/LaunchDaemons`
- Credential theft: `security find-generic-password`, `keychain`

### Example pattern from Airbnb BinaryAlert

```yara
rule SUSP_Mac_ProtonRAT
{
    strings:
        // Library indicators
        $lib1 = "SRWebSocket" ascii
        $lib2 = "SocketRocket" ascii

        // Behavioral indicators
        $behav1 = "SSH tunnel not launched" ascii
        $behav2 = "Keylogger" ascii

    condition:
        (uint32(0) == 0xFEEDFACF or uint32(0) == 0xCAFEBABE) and
        any of ($lib*) and any of ($behav*)
}
```

---

## JavaScript-Specific Detection

### Good strings

- Ethereum function selectors: `{ 70 a0 82 31 }` (transfer)
- Zero-width characters (steganography): `{ E2 80 8B E2 80 8C }`
- Obfuscator signatures: `_0x`, `var _0x`
- Specific C2 patterns: domain names, webhook URLs

### Bad strings (avoid)

- `require`, `fetch`, `axios` — too common
- `Buffer`, `crypto` — legitimate uses everywhere
- `process.env` alone — need specific env var names

---

## Multi-Indicator Clustering Pattern

Production rules often group indicators by type:

```yara
strings:
    // Category A: Library indicators
    $a1 = "SRWebSocket" ascii
    $a2 = "SocketRocket" ascii

    // Category B: Behavioral indicators
    $b1 = "SSH tunnel" ascii
    $b2 = "keylogger" ascii nocase

    // Category C: C2 patterns
    $c1 = /https:\/\/[a-z0-9]{8,16}\.onion/

condition:
    filesize < 10MB and
    any of ($a*) and any of ($b*)  // Require evidence from BOTH categories
```

**Why this works:** Different indicator types have different confidence levels. A single C2 domain might be definitive, while you need multiple library imports to be confident. Grouping by `$a*`, `$b*`, `$c*` lets you express graduated requirements.
