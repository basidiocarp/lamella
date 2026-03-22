# Stage 4: Validate and Format

Validation is required for every generated Makefile.

## Validation Tool Preflight

1. **Preferred path:** run `devops-skills:makefile-validator`.
2. **If validator skill is unavailable:** run local fallback checks:
   ```bash
   # Required fallback check (if make exists)
   make -f <Makefile> -n --dry-run

   # Structural fallback checks
   rg -n '^ {1,}\S' <Makefile>         # suspicious space-indented recipe lines
   rg -n '^\.PHONY:' <Makefile>
   ```
3. **If `make` is unavailable:** run structural checks only, report "partial validation due to missing make binary", and request user confirmation before claiming production readiness.

## Required Validation Loop

```
1. Generate Makefile following stages above
2. Run validator skill (or fallback checks if unavailable)
3. Fix all errors (MUST have 0 errors before completion)
4. Apply formatting fixes (see "Formatting Step" below)
5. Fix warnings when feasible (SHOULD fix; explain if skipped)
6. Address info items for large/production projects
7. Re-run validation until checks pass
8. Output structured validation report (REQUIRED - see format below)
```

## Formatting Step (REQUIRED)

When mbake reports formatting issues, either:

1. **Auto-apply formatting** (preferred for minor issues):
   ```bash
   mbake format <Makefile>
   ```

2. **Explain why not applied** (if formatting would break functionality):
   ```
   Formatting not applied because:
   - [specific reason, e.g., "heredoc syntax would be corrupted"]
   - Manual review recommended for: [specific lines]
   ```

If `mbake` is not installed or not executable, skip formatter execution and record:
`Formatting skipped: mbake unavailable in current environment.`

## Validation Pass Criteria

| Level | Requirement | Action |
|-------|-------------|--------|
| **Errors (0 required)** | Syntax errors, missing tabs, invalid targets | MUST fix before completion |
| **Warnings (fix if feasible)** | Formatting issues, missing optimizations | SHOULD fix; explain if skipped |
| **Info (address for production)** | Enhancement suggestions, style preferences | SHOULD address for production Makefiles |

## Known mbake False Positives

| mbake Warning | Actual Status | Explanation |
|---------------|---------------|-------------|
| "Unknown special target '.DELETE_ON_ERROR'" | ✅ Valid | Critical GNU Make target that deletes failed build artifacts |
| "Unknown special target '.SUFFIXES'" | ✅ Valid | Standard GNU Make target for disabling/setting suffix rules |
| "Unknown special target '.ONESHELL'" | ✅ Valid | GNU Make 3.82+ feature for single-shell recipe execution |
| "Unknown special target '.POSIX'" | ✅ Valid | POSIX compliance declaration |

## Validation Report Format

```
## Validation Report

**Result:** [PASSED / PASSED with warnings / FAILED]
**Errors:** [count]
**Warnings:** [count]
// ... (16 lines trimmed)

### Remaining Issues (if any)
- [List any issues requiring user attention]
```

## Production-Quality Requirements

When generating Makefiles with Docker or deployment targets:

1. **Error Handling for docker-push:**
   ```makefile
   docker-push: docker-build
   	@echo "Pushing $(IMAGE)..."
   	docker push $(IMAGE) || { echo "Failed to push $(IMAGE)"; exit 1; }
   ```

2. **Parallel Safety for Docker targets:**
   ```makefile
   .NOTPARALLEL: docker-build docker-push docker-run
   ```

3. **Install target error handling:**
   ```makefile
   install: $(TARGET)
   	install -d $(DESTDIR)$(PREFIX)/bin || exit 1
   	install -m 755 $(TARGET) $(DESTDIR)$(PREFIX)/bin/ || exit 1
   ```

## Validation Checklist

- [ ] Syntax correct (`make -n` passes)
- [ ] All non-file targets have .PHONY
- [ ] Tab indentation (not spaces)
- [ ] No hardcoded credentials
- [ ] User-overridable variables use `?=`
- [ ] .DELETE_ON_ERROR present
- [ ] MAKEFLAGS optimizations included (Modern header)
- [ ] Order-only prerequisites for build directories (large projects)
- [ ] Error handling in critical recipes (install, deploy, docker-push)
