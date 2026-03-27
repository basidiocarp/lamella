# Stage 4: Validate and Format

Validation is required for every generated Makefile.

## Validation Loop

1. generate the Makefile
2. run validator or fallback checks
3. fix all errors
4. apply formatting where safe
5. rerun until clean

## Fallback Checks

```bash
make -f <Makefile> -n --dry-run
rg -n '^ {1,}\\S' <Makefile>
rg -n '^\\.PHONY:' <Makefile>
```

## Validation Report Format

```text
## Validation Report
Result: PASSED | PASSED with warnings | FAILED
Errors: N
Warnings: N
Remaining issues:
- [if any]
```
