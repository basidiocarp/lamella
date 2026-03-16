# Helper Scripts (Optional)

These scripts are **optional convenience tools** for quick template generation.

## When to Use Scripts vs Manual Generation

| Scenario | Recommendation |
|----------|----------------|
| Simple, standard project (single binary, no special features) | ✅ Use `generate_makefile_template.sh` for speed |
| Complex project (Docker, multi-binary, custom patterns) | ❌ Use manual generation for full control |
| Adding targets to existing Makefile | ✅ Use `add_standard_targets.sh` |
| User has specific formatting/style requirements | ❌ Use manual generation |
| Rapid prototyping / proof-of-concept | ✅ Use scripts, customize later |
| Production-ready Makefile | ⚠️ Start with script, then customize manually |

## generate_makefile_template.sh

Generates a complete Makefile template for a specific project type.
Script path: `scripts/generate_makefile_template.sh`

```bash
bash scripts/generate_makefile_template.sh [TYPE] [NAME] [OUTPUT_FILE]

Types: c, c-lib, cpp, go, python, java, generic
```

**Example:**
```bash
bash scripts/generate_makefile_template.sh go myservice
# Creates Makefile with Go patterns, version embedding, standard targets

bash scripts/generate_makefile_template.sh go myservice build/Makefile
# Writes template to build/Makefile (TYPE NAME OUTPUT)
```

## add_standard_targets.sh

Adds missing standard GNU targets to an existing Makefile.
Script path: `scripts/add_standard_targets.sh`

```bash
bash scripts/add_standard_targets.sh [MAKEFILE] [TARGETS...]
bash scripts/add_standard_targets.sh [TARGETS...]  # uses ./Makefile

Targets: all, install, uninstall, clean, distclean, test, check, help, dist
```

**Example:**
```bash
bash scripts/add_standard_targets.sh Makefile install uninstall help
# Adds install, uninstall, help targets if they don't exist

bash scripts/add_standard_targets.sh clean test
# Explicit-target mode: modifies ./Makefile

bash scripts/add_standard_targets.sh -n Makefile dist
# Dry-run mode: shows planned changes without editing files
```

## Helper Script Regression Smoke Tests

Run after modifying helper scripts or templates:
```bash
bash test/test_helper_scripts.sh
```
