# Build Fixes

Fixes to apply when a CodeQL database build method fails. Try these in order, then retry the current build method. **Log each fix attempt.**

## 1. Clean existing state

```bash
log_step "Applying fix: clean existing state"
rm -rf "$DB_NAME"
log_result "Removed $DB_NAME"
```

## 2. Clean build cache

```bash
log_step "Applying fix: clean build cache"
CLEANED=""
make clean 2>/dev/null && CLEANED="$CLEANED make"
rm -rf build CMakeCache.txt CMakeFiles 2>/dev/null && CLEANED="$CLEANED cmake-artifacts"
./gradlew clean 2>/dev/null && CLEANED="$CLEANED gradle"
mvn clean 2>/dev/null && CLEANED="$CLEANED maven"
cargo clean 2>/dev/null && CLEANED="$CLEANED cargo"
log_result "Cleaned: $CLEANED"
```

## 3. Install missing dependencies

> **Note:** The commands below install the *target project's* dependencies so CodeQL can trace the build. Use whatever package manager the target project expects (`pip`, `npm`, `go mod`, etc.) — these are not the skill's own tooling preferences.

```bash
log_step "Applying fix: install dependencies"

# Python — use target project's package manager (pip/uv/poetry)
if [ -f requirements.txt ]; then
  log_cmd "pip install -r requirements.txt"
  pip install -r requirements.txt
elif [ -f pyproject.toml ] && command -v uv >/dev/null 2>&1; then
  log_cmd "uv sync"
  uv sync
elif [ -f package-lock.json ]; then
  log_cmd "npm ci"
  npm ci
elif [ -f pnpm-lock.yaml ]; then
  log_cmd "pnpm install --frozen-lockfile"
  pnpm install --frozen-lockfile
elif [ -f yarn.lock ]; then
  log_cmd "yarn install --frozen-lockfile"
  yarn install --frozen-lockfile
elif [ -f go.mod ]; then
  log_cmd "go mod download"
  go mod download
elif [ -f Cargo.toml ]; then
  log_cmd "cargo fetch"
  cargo fetch
else
  log_result "No recognized dependency manifest found"
fi

log_result "Dependencies installed - see above for details"
```

## 4. Handle private registries

If dependencies require authentication, ask user:
```
AskUserQuestion: "Build requires private registry access. Options:"
  1. "I'll configure auth and retry"
  2. "Skip these dependencies"
  3. "Show me what's needed"
```

```bash
# Log authentication setup if performed
log_step "Private registry authentication configured"
log_result "Registry: <REGISTRY_URL>, Method: <AUTH_METHOD>"
```

**After fixes:** Retry current build method. If still fails, move to next method.
