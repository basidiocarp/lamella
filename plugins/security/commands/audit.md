# /audit

Heavy-weight security and safety audit using os-checker tools.

## Usage

```
/audit [mode]
```

## Parameters

- `mode` (optional): Audit mode
  - `security` - security vulnerability audit (default)
  - `safety` - unsafe code safety audit
  - `concurrency` - concurrency audit
  - `full` - full audit across all available checkers

## When to Use

| Scenario | Recommendation |
|------|------|
| Day-to-day development | Use `/languages/rust` (clippy) |
| PR review | Use `/languages/rust` |
| **Before release** | `/audit security` |
| **Unsafe code review** | `/audit safety` |
| **Concurrency review** | `/audit concurrency` |
| **Security-critical project** | `/audit full` |

## Audit Modes

### Security (Default)

Check for known security vulnerabilities:

| Tool | What It Checks |
|------|----------|
| `cargo audit` | CVEs in dependencies |
| `geiger` | unsafe usage exposure |

```bash
cargo audit
cargo geiger
```

### Safety

Check unsafe-code correctness:

| Tool | What It Checks |
|------|----------|
| `miri` | Undefined Behavior |
| `rudra` | Memory-safety issues |
| `geiger` | unsafe usage statistics |

```bash
cargo +nightly miri test
# Rudra must be installed separately
```

**Note**: requires a nightly toolchain

### Concurrency

Check concurrency issues:

| Tool | What It Checks |
|------|----------|
| `lockbud` | Deadlock detection |
| `atomvchecker` | Atomicity violations |

### Full

Run every available checker. This is the slowest mode.

## Integration with os-checker Skills

These skills are useful during the audit:

| Skill | Purpose |
|-------|------|
| `os-checker-checkers` | Understand what each tool does |
| `os-checker-cli` | Learn the os-checker CLI |
| `os-checker-diagnostics` | Interpret audit results |
| `os-checker-setup` | Install the audit tools |

## Issue Prioritization

| Priority | Diagnostic Type | Response |
|--------|----------|------|
| Critical | `Miri`, `Rudra`, `Audit`, `Cargo` | Fix immediately |
| High | `Lockbud(Probably)`, `Semver Violation` | Should fix |
| Medium | `Lockbud(Possibly)`, `Atomvchecker` | Review manually |
| Low | `Geiger`, `Outdated` | Reference signal |

## Example Output

```
Security Audit Report
═══════════════════════════════════════════

[1/2] cargo audit
  ✗ 2 vulnerabilities found

  CRITICAL:
    RUSTSEC-2024-0001: Memory corruption in foo v1.2.3
    → Upgrade to foo v1.2.4

  HIGH:
    RUSTSEC-2024-0002: DoS vulnerability in bar v2.0.0
    → Upgrade to bar v2.0.1

[2/2] cargo geiger
  Unsafe usage in dependencies:
    ├── libc: 127 unsafe blocks
    ├── tokio: 45 unsafe blocks
    └── your-crate: 3 unsafe blocks

═══════════════════════════════════════════
Recommended Actions:
1. Update foo to v1.2.4 (CRITICAL)
2. Update bar to v2.0.1 (HIGH)
3. Review unsafe usage with /unsafe-review --quick
```

## Tool Installation

```bash
# Security
cargo install cargo-audit

# Safety (needs nightly)
rustup +nightly component add miri

# Geiger
cargo install cargo-geiger

# Full os-checker suite
cargo install os-checker
```

## Batch Audit (Multiple Repos)

Use os-checker for multi-repo batch audits:

```bash
# Create config
cat > audit-config.json << 'EOF'
{
  "org/repo1": {},
  "org/repo2": {},
  "org/repo3": {}
}
EOF

# Run the batch audit
os-checker run --config audit-config.json --emit results.json
```

## Related Commands

- `/languages/rust` - lightweight day-to-day checks with clippy
- `/unsafe-review` - unsafe review and quick checks
