# Quality Assessment

How to assess and improve CodeQL database quality after a successful build.

## Collect Metrics

```bash
log_step "Assessing database quality"

# 1. Baseline lines of code and file list (most reliable metric)
codeql database print-baseline -- "$DB_NAME"
BASELINE_LOC=$(python3 -c "
// ... (26 lines trimmed)
FINALIZED=$(grep '^finalised:' "$DB_NAME/codeql-database.yml" 2>/dev/null \
  | awk '{print $2}')
echo "Finalized: $FINALIZED"
```

## Compare Against Expected Source

Estimate the expected source file count from the working directory and compare.

> **Compiled languages (C/C++, Java, C#):** The source archive (`src.zip`) includes system headers and SDK files alongside project source files. For C/C++, this can inflate the archive count 10-20x (e.g., 111 archive files for 5 project source files). Compare against **project-relative files only** by filtering the archive listing.

```bash
# Count source files in the project (adjust extensions per language)
EXPECTED=$(fd -t f -e c -e cpp -e h -e hpp -e java -e kt -e py -e js -e ts \
  --exclude 'codeql_*.db' --exclude node_modules --exclude vendor --exclude .git . \
  2>/dev/null | wc -l)
echo "Expected source files: $EXPECTED"
// ... (16 lines trimmed)
  ERROR_RATIO="N/A (no files)"
fi
echo "Error ratio: $ERROR_RATIO ($EXTRACTOR_ERRORS errors / $PROJECT_SRC_COUNT project files)"
```

## Log Assessment

```bash
log_step "Quality assessment results"
log_result "Baseline LoC: $DB_LOC"
log_result "Project source files: $PROJECT_SRC_COUNT (expected: ~$EXPECTED)"
log_result "Total archive files: $SRC_FILE_COUNT (includes system headers for compiled langs)"
log_result "Extractor errors: $EXTRACTOR_ERRORS (ratio: $ERROR_RATIO)"
log_result "Finalized: $FINALIZED"

# Sample extracted project files (exclude system paths)
unzip -Z1 "$DB_NAME/src.zip" 2>/dev/null \
  | grep -v -E '^(Library/|usr/|System/|opt/|Applications/)' \
  | head -20 >> "$LOG_FILE"
```

## Quality Criteria

| Metric | Source | Good | Poor |
|--------|--------|------|------|
| Baseline LoC | `print-baseline` / `baseline-info.json` | > 0, proportional to project size | 0 or far below expected |
| Project source files | `src.zip` (filtered) | Close to expected source file count | 0 or < 50% of expected |
| Extractor errors | `diagnostic/extractors/*.jsonl` | 0 or < 5% of project files | > 5% of project files |
| Finalized | `codeql-database.yml` | `true` | `false` (incomplete build) |
| Key directories | `src.zip` listing | Application code directories present | Missing `src/main`, `lib/`, `app/` etc. |
| "No source code seen" | build log | Absent | Present (cached build — compiled languages) |

**Interpreting archive file counts for compiled languages:** C/C++ databases include system headers (e.g., `<stdio.h>`, SDK headers) in `src.zip`. A project with 5 source files may have 100+ files in the archive. Always filter to project-relative paths when comparing against expected counts. Use `baselineLinesOfCode` as the primary quality indicator.

**Interpreting baseline LoC:** A small number of extractor errors is normal and does not significantly impact analysis. However, if `baselineLinesOfCode` is 0 or the source archive contains no files, the database is empty — likely a cached build (compiled languages) or wrong `--source-root`.

---

## Improve Quality (if poor)

Try these improvements, re-assess after each. **Log all improvements:**

### 1. Adjust source root

```bash
log_step "Quality improvement: adjust source root"
NEW_ROOT="./src"  # or detected subdirectory
# For interpreted: add --codescanning-config=codeql-config.yml
# For compiled: omit config flag
log_cmd "codeql database create $DB_NAME --language=$CODEQL_LANG --source-root=$NEW_ROOT --overwrite"
codeql database create $DB_NAME --language=$CODEQL_LANG --source-root=$NEW_ROOT --overwrite
log_result "Changed source-root to: $NEW_ROOT"
```

### 2. Fix "no source code seen" (cached build - compiled languages only)

```bash
log_step "Quality improvement: force rebuild (cached build detected)"
log_cmd "make clean && rebuild"
make clean && codeql database create $DB_NAME --language=$CODEQL_LANG --overwrite
log_result "Forced clean rebuild"
```

### 3. Install type stubs / dependencies

> **Note:** These install into the *target project's* environment to improve CodeQL extraction quality.

```bash
log_step "Quality improvement: install type stubs/additional deps"

# Python type stubs — install into target project's environment
STUBS_INSTALLED=""
for stub in types-requests types-PyYAML types-redis; do
  if pip install "$stub" 2>/dev/null; then
    STUBS_INSTALLED="$STUBS_INSTALLED $stub"
  fi
done
log_result "Installed type stubs:$STUBS_INSTALLED"

# Additional project dependencies
log_cmd "pip install -e ."
pip install -e . 2>&1 | tee -a "$LOG_FILE"
```

### 4. Adjust extractor options

```bash
log_step "Quality improvement: adjust extractor options"

# C/C++: Include headers
export CODEQL_EXTRACTOR_CPP_OPTION_TRAP_HEADERS=true
log_result "Set CODEQL_EXTRACTOR_CPP_OPTION_TRAP_HEADERS=true"

# Java: Specific JDK version
export CODEQL_EXTRACTOR_JAVA_OPTION_JDK_VERSION=17
log_result "Set CODEQL_EXTRACTOR_JAVA_OPTION_JDK_VERSION=17"

# Then rebuild with current method
```

**After each improvement:** Re-assess quality. If no improvement possible, move to next build method.
