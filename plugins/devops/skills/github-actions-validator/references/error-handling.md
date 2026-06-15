# Error Handling Guide

Detailed execution flow for handling GitHub Actions validation errors.

## Required Execution Flow

### Step 1: Set Skill Path and Run Validation

Run commands from the repository root that contains `.github/workflows/`.

```bash
SKILL_DIR="${CLAUDE_SKILL_DIR}"
bash "$SKILL_DIR/scripts/validate_workflow.sh" <workflow-file-or-directory>
```

### Step 2: Map Each Error to a Reference

For each actionlint/act error, consult the mapping table below, then extract the matching fix pattern.

### Step 3: Apply Minimal-Quote Policy

For each issue:
1. Include the exact error line from tool output.
2. Quote only the smallest useful snippet from `references/` (prefer <=8 lines).
3. Paraphrase the rest and cite the source file/section.
4. Show corrected workflow code.

### Step 4: Handle Unmapped Errors Explicitly

If an error does not match any mapping:
1. Label it as `UNMAPPED`.
2. Capture exact tool output, workflow file, and line number (if available).
3. Check `references/common_errors.md` general sections first.
4. If still unresolved, search official docs with the exact error string.
5. Mark the fix as `provisional` until post-fix rerun passes.

### Step 5: Verify Public Action Versions

For each `uses: owner/action@version`:
1. Check `references/action_versions.md`.
2. For unknown actions, verify against official docs.
3. Confirm required inputs and deprecations.

Offline mode behavior:
- If network/doc lookup is unavailable, rely on `references/action_versions.md` only.
- Mark unknown actions as `UNVERIFIED-OFFLINE`.
- Do not claim "latest" version without an online verification pass.

### Step 6: Mandatory Post-Fix Rerun

After applying fixes, rerun validation before finalizing:

```bash
SKILL_DIR="${CLAUDE_SKILL_DIR}"
bash "$SKILL_DIR/scripts/validate_workflow.sh" <workflow-file-or-directory>
```

### Step 7: Provide Final Summary

Final output should include:
- Issues found and fixes applied
- Any `UNMAPPED` or `UNVERIFIED-OFFLINE` items
- Post-fix rerun command and result
- Remaining warnings/risk notes

## Error Type to Reference File Mapping

| Error Pattern in Output | Reference File to Read | Section to Quote |
|------------------------|----------------------|------------------|
| `runs-on:`, `runner`, `ubuntu`, `macos`, `windows` | `references/runners.md` | Runner labels |
| `cron`, `schedule` | `references/common_errors.md` | Schedule Errors |
| `${{`, `expression`, `if:` | `references/common_errors.md` | Expression Errors |
| `needs:`, `job`, `dependency` | `references/common_errors.md` | Job Configuration Errors |
| `uses:`, `action`, `input` | `references/common_errors.md` | Action Errors |
| `untrusted`, `injection`, `security` | `references/common_errors.md` | Script Injection section |
| `syntax`, `yaml`, `unexpected` | `references/common_errors.md` | Syntax Errors |
| `docker`, `container` | `references/act_usage.md` | Troubleshooting |
| `@v3`, `@v4`, `deprecated`, `outdated` | `references/action_versions.md` | Version table |
| `workflow_call`, `reusable`, `oidc` | `references/modern_features.md` | Relevant section |
| `glob`, `path`, `paths:`, `pattern` | `references/common_errors.md` | Path Filter Errors |

## Script Output to Reference Mapping

| Output Pattern | Reference File |
|----------------|----------------|
| `[syntax-check]`, parse, YAML errors | `common_errors.md` - Syntax Errors |
| `[expression]`, `${{`, condition parsing | `common_errors.md` - Expression Errors |
| `[action]`, `uses:`, input/output mismatch | `common_errors.md` - Action Errors |
| `[events]` with CRON/schedule text | `common_errors.md` - Schedule Errors |
| `potentially untrusted`, injection warnings | `common_errors.md` - Security section |
| `[runner-label]` or unknown `runs-on` label | `runners.md` |
| `[job-needs]` dependency errors | `common_errors.md` - Job Configuration Errors |
| `[glob]`, `paths`, pattern errors | `common_errors.md` - Path Filter Errors |
| Docker/pull/image errors from act | `act_usage.md` - Troubleshooting |
| No pattern match | `common_errors.md` + official docs (label `UNMAPPED`) |

## Example: Complete Error Handling Workflow

**User's workflow has this error:**
```
runs-on: ubuntu-lastest
```

**Step 1 - Script output:**
```
label "ubuntu-lastest" is unknown
```

**Step 2 - Read `references/runners.md` or `references/common_errors.md`:**
Find the "Invalid Runner Label" section.

**Step 3 - Quote the fix to user:**

> **Error:** `label "ubuntu-lastest" is unknown`
>
> **Cause:** Typo in runner label (from `references/common_errors.md`):
> ```yaml
> # Bad
> runs-on: ubuntu-lastest  # Typo
> ```
>
> **Fix** (from `references/common_errors.md`):
> ```yaml
> # Good
> runs-on: ubuntu-latest
> ```
>
> **Valid runner labels** (from `references/runners.md`):
> - `ubuntu-latest`, `ubuntu-24.04`, `ubuntu-22.04`
> - `windows-latest`, `windows-2025`, `windows-2022`
> - `macos-latest`, `macos-15`, `macos-14`

**Step 4 - Provide corrected code:**
```yaml
runs-on: ubuntu-latest
```
