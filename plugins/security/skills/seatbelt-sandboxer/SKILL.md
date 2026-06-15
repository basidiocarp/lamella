---
name: seatbelt-sandboxer
description: "Generates minimal macOS Seatbelt sandbox configurations."
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
origin: lamella
---

# macOS Seatbelt Sandbox Profiling

Generate minimally-permissioned allowlist-based Seatbelt profiles for macOS processes.

## When to Use

- Sandboxing macOS applications with narrow file and network access
- Isolating developer tools or untrusted dependencies
- Building defense-in-depth around local automation or build tools

## Method

1. Identify required file, process, network, and IPC access.
2. Start from deny-all.
3. Add read-only runtime paths.
4. Add tightly scoped write paths.
5. Add only the network permissions the program actually needs.
6. Test iteratively with `sandbox-exec`.

## Minimal Profile

```scheme
(version 1)
(deny default)

;; Process
(allow process-exec*)
(allow process-fork)
(allow sysctl-read)

;; Read-only runtime access
(allow file-read-metadata)
(allow file-read-data
    (subpath "/usr")
    (subpath "/bin")
    (subpath "/System")
    (subpath (param "WORKING_DIR")))

;; Restricted writes
(allow file-write*
    (subpath (param "WORKING_DIR"))
    (subpath "/private/tmp")
    (literal "/dev/null"))

;; Network disabled
(deny network*)
```

## Usage

```bash
sandbox-exec -f profile.sb \
  -D WORKING_DIR=/path/to/project \
  -D HOME=$HOME \
  /path/to/application
```

## Notes

- Prefer `file-read-data` plus broad `file-read-metadata` instead of `file-read*`.
- Split profiles by subcommand if different commands need different privileges.
- Validate with real sample workloads, not just `echo`.

## References

- [Apple Sandbox Guide (reverse-engineered)](https://reverse.put.as/wp-content/uploads/2011/09/Apple-Sandbox-Guide-v1.0.pdf)
- [sandbox-exec man page](https://keith.github.io/xcode-man-pages/sandbox-exec.1.html)
