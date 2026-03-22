# macOS arm64e Workaround

Methods for building CodeQL databases on macOS Apple Silicon when the `arm64e`/`arm64` architecture mismatch causes SIGKILL (exit code 137) during build tracing.

**Use when `IS_MACOS_ARM64E=true`** (detected in build-database workflow Step 2a). These replace Methods 1 and 2 on affected systems.

The strategy is to use Homebrew-installed tools (plain `arm64`, not `arm64e`) so `libtrace.dylib` can be injected successfully. Try sub-methods in order:

## Sub-method 2m-a: Homebrew clang/gcc with multi-step tracing

Trace only the compiler invocations individually, avoiding system tools (`/usr/bin/ar`, `/bin/mkdir`) that would be killed. This requires a multi-step build: init → trace each compiler call → finalize.

```bash
log_step "METHOD 2m-a: macOS arm64 — Homebrew compiler with multi-step tracing"

# 1. Find Homebrew C/C++ compiler (arm64, not arm64e)
BREW_CC=""
# Prefer Homebrew clang
// ... (72 lines trimmed)
    fi
  fi
fi
```

## Sub-method 2m-b: Rosetta x86_64 emulation

Force the entire CodeQL pipeline to run under Rosetta, which uses the `x86_64` slice of both `libtrace.dylib` and system tools — no `arm64e` mismatch.

```bash
log_step "METHOD 2m-b: macOS arm64 — Rosetta x86_64 emulation"

# Check if Rosetta is available
if ! arch -x86_64 /usr/bin/true 2>/dev/null; then
  log_result "Rosetta not available — skipping 2m-b"
// ... (11 lines trimmed)
    log_result "FAILED (Rosetta)"
  fi
fi
```

## Sub-method 2m-c: System compiler (direct attempt)

As a verification step, try the standard autobuild with the system compiler. This will likely fail with exit code 137 on affected systems, but confirms the arm64e issue is the cause.

> **This sub-method is optional.** Skip it if arm64e incompatibility was already confirmed in Step 2a.

```bash
log_step "METHOD 2m-c: System compiler (expected to fail on arm64e)"
CMD="codeql database create $DB_NAME --language=$CODEQL_LANG --source-root=. --overwrite"
log_cmd "$CMD"

$CMD 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=$?
if [ $EXIT_CODE -eq 137 ] || [ $EXIT_CODE -eq 134 ]; then
  log_result "FAILED: exit code $EXIT_CODE confirms arm64e/libtrace incompatibility"
elif codeql resolve database -- "$DB_NAME" >/dev/null 2>&1; then
  log_result "SUCCESS (unexpected — system compiler worked)"
else
  log_result "FAILED (exit code: $EXIT_CODE)"
fi
```

## Sub-method 2m-d: Ask user

If all macOS workarounds fail, present options:

```
AskUserQuestion:
  header: "macOS Build"
  question: "Build tracing failed due to macOS arm64e incompatibility. How to proceed?"
  multiSelect: false
  options:
    - label: "Use build-mode=none (Recommended)"
      description: "Source-level analysis only. Misses some interprocedural data flow but catches most C/C++ vulnerabilities (format strings, buffer overflows, unsafe functions)."
    - label: "Install arm64 tools and retry"
      description: "Run: brew install llvm make — then retry with Homebrew toolchain"
    - label: "Install Rosetta and retry"
      description: "Run: softwareupdate --install-rosetta — then retry under x86_64 emulation"
    - label: "Abort"
      description: "Stop database creation"
```

**If "Use build-mode=none":** Proceed to Method 4.

**If "Install arm64 tools and retry":**
```bash
log_step "Installing Homebrew arm64 toolchain"
brew install llvm make 2>&1 | tee -a "$LOG_FILE"
# Retry Sub-method 2m-a
```

**If "Install Rosetta and retry":**
```bash
log_step "Installing Rosetta"
softwareupdate --install-rosetta --agree-to-license 2>&1 | tee -a "$LOG_FILE"
# Retry Sub-method 2m-b
```
