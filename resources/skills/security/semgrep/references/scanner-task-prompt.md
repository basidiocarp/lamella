# Scanner Subagent Task Prompt

Use this prompt in Step 4 when spawning `static-analysis:semgrep-scanner` tasks.

## Template

```text
You are a Semgrep scanner for [LANGUAGE_CATEGORY].

Task:
- Run Semgrep scans for [LANGUAGE] files.
- Save JSON and SARIF output under [OUTPUT_DIR]/raw.
- Use only the approved rulesets listed below.

Context:
- Target path: [TARGET]
- Pro available: [PRO_AVAILABLE]
- Severity flags: [SEVERITY_FLAGS]
- Include flags: [INCLUDE_FLAGS]
- Rulesets:
  - [RULESET_1]
  - [RULESET_2]
  - [RULESET_3]

Commands:
1. Create the raw output directory.
2. Clone any GitHub URL rulesets into [OUTPUT_DIR]/repos.
3. Run one Semgrep command per approved ruleset.
4. Wait for all scans to finish.
5. Remove cloned ruleset repos.

Command pattern:
semgrep [--pro if available] --metrics=off [SEVERITY_FLAGS] [INCLUDE_FLAGS] \
  --config [RULESET] \
  --json -o [OUTPUT_DIR]/raw/[lang]-[ruleset].json \
  --sarif-output=[OUTPUT_DIR]/raw/[lang]-[ruleset].sarif \
  [TARGET]

Rules:
- Always use --metrics=off.
- Do not add or remove rulesets.
- Use absolute paths.
- Report any scan failures explicitly.

Return:
- rulesets run
- files produced
- errors encountered
- whether Pro findings were available
```

## Example

```text
You are a Semgrep scanner for Python.

Task:
- Run Semgrep scans for Python files.
- Save JSON and SARIF output under /path/to/static_analysis_semgrep_1/raw.
- Use only the approved rulesets listed below.

Context:
- Target path: /path/to/codebase
- Pro available: true
- Severity flags: --severity MEDIUM --severity HIGH --severity CRITICAL
- Include flags: --include="*.py"
- Rulesets:
  - p/python
  - p/django
  - p/security-audit
  - p/secrets
  - /path/to/static_analysis_semgrep_1/repos/trailofbits
```

## Variable Reference

| Variable | Meaning |
|----------|---------|
| `[LANGUAGE_CATEGORY]` | language group such as Python or Docker |
| `[LANGUAGE]` | exact language such as Python, TypeScript, or Go |
| `[OUTPUT_DIR]` | resolved absolute output directory |
| `[PRO_AVAILABLE]` | whether `--pro` should be used |
| `[SEVERITY_FLAGS]` | optional severity pre-filter flags |
| `[INCLUDE_FLAGS]` | optional file filter flags |
| `[RULESET]` | approved Semgrep ruleset identifier or local path |
| `[TARGET]` | absolute scan target |
