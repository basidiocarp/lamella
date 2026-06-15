---
name: makefile
description: "Generates, validates, lints, and audits Makefiles with `.PHONY` targets and build automation."
origin: lamella
---

# Makefile

## Contents

- [When to Use](#when-to-use)
- [Generation Workflow](#generation-workflow)
- [Validation Workflow](#validation-workflow)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Reference Files](#reference-files)

## When to Use

**Generation:** Creating new Makefiles, setting up build systems (C/C++, Python, Go, Java), converting manual build processes to Make.

**Validation:** Validating Makefile syntax, linting .mk files, finding issues, checking security, reviewing before CI.

## Generation Workflow

### Stage 1: Gather Requirements

| Category | Information |
|----------|-------------|
| **Project** | Language, structure (single/multi-directory) |
| **Build** | Source files, output artifacts, dependencies |
| **Install** | PREFIX location, directories |
| **Targets** | all, install, clean, test, dist, help |

**Defaults:** Single-directory, PREFIX=/usr/local, standard targets (all, build, test, clean, install, help).

### Stage 2: Generate

Use templates from `references/code-templates.md` or helper scripts:

```bash
bash scripts/generate_makefile_template.sh go myservice Makefile
bash scripts/add_standard_targets.sh Makefile install clean help
```

### Stage 3: Validate Output

Run the validation workflow below. Fix all errors before delivery.

## Validation Workflow

### Default Entrypoint

```bash
bash scripts/validate_makefile.sh <makefile-path>
```

Validation layers:
1. Dependency preflight (python3, pip3, make)
2. GNU make syntax check (`make -n --dry-run`)
3. `mbake validate`
4. `mbake format --check`
5. Security, best-practice, and optimization checks
6. Optional `checkmake` and `unmake` checks

### Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | No blocking findings | Optional improvements only |
| `1` | Warnings only | Fix recommended |
| `2` | Errors found | Fix required, then rerun |

### Progressive Reference Loading

| Finding type | Reference |
|-------------|-----------|
| .PHONY, variables, structure | docs/best-practices.md |
| Tabs vs spaces, credential patterns | docs/common-mistakes.md |
| mbake behavior, formatter flags | docs/bake-tool.md |

### Fix + Rerun Loop

After applying fixes, rerun validation. Stop when no new errors are introduced. Document intentionally accepted warnings.

### Fallback Behavior

| Constraint | Fallback |
|-----------|----------|
| python3/pip3 unavailable | `make -f <file> -n --dry-run` + grep checks |
| make unavailable | Continue non-syntax stages |
| Read-only file | Provide patch suggestions only |

## Best Practices

### Variables
- `?=` for user-overridable (CC, CFLAGS, PREFIX)
- `:=` for project-specific (SOURCES, OBJECTS)

### Targets
- Always declare `.PHONY` for non-file targets
- Default target should be `all`
- Use `.DELETE_ON_ERROR` for safety

### Recipes
- Use tabs, never spaces
- Quote variables: `$(RM) "$(TARGET)"`
- Use `@` prefix for quiet commands
- Test with `make -n` first

## Troubleshooting

```bash
command -v python3 pip3 make
make -f <makefile-path> -n --dry-run
grep -nE "^(  |    )[a-zA-Z@\$\(]" <makefile-path>  # tab violations
NO_COLOR=1 bash scripts/validate_makefile.sh <path> > /tmp/validator.log 2>&1
```

## Reference Files

### Generation References

| Reference | Purpose |
|-----------|---------|
| [references/code-templates.md](references/code-templates.md) | Complete templates by language |
| [references/documentation-lookup.md](references/documentation-lookup.md) | External doc lookup |
| [references/best-practices.md](references/best-practices.md) | Generation best practices |
| [references/makefile-layout.md](references/makefile-layout.md) | Top-level file order and special targets |
| [references/variables-guide.md](references/variables-guide.md) | Variable usage |
| [references/standard-targets.md](references/standard-targets.md) | Conventional public targets |
| [references/phony-and-help-targets.md](references/phony-and-help-targets.md) | `.PHONY` and help target patterns |
| [references/target-dependencies.md](references/target-dependencies.md) | Prerequisites and pattern rules |
| [references/rules-and-modularization.md](references/rules-and-modularization.md) | Includes, recipe shape, multi-directory rules |
| [references/patterns-guide.md](references/patterns-guide.md) | Common patterns |
| [references/optimization-guide.md](references/optimization-guide.md) | Optimization |
| [references/security-guide.md](references/security-guide.md) | Security hardening |
| [references/helper-scripts.md](references/helper-scripts.md) | Helper script docs |
| [references/validation.md](references/validation.md) | Validation process |

### Validation References

| Reference | Purpose |
|-----------|---------|
### Additional Resources

- [Best Practices From Makefile Validator](references/best-practices-from-makefile-validator.md)
- [Generation Stage3](references/generation-stage3.md)
- [Test Validate](scripts/test_validate.sh)
