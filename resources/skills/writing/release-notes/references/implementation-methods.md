# Changelog Implementation Methods

## Method 1: Conventional Changelog (Node.js)

```bash
# Install tools
npm install -D @commitlint/cli @commitlint/config-conventional
npm install -D husky
npm install -D standard-version
# or
// ... (30 lines trimmed)
# Setup husky
npx husky init
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

## Method 2: standard-version Configuration

```javascript
// .versionrc.js
module.exports = {
  types: [
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
// ... (20 lines trimmed)
    postchangelog: 'echo "Running postchangelog"',
  },
};
```

```json
// package.json scripts
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch",
    "release:dry": "standard-version --dry-run"
  }
}
```

## Method 3: semantic-release (Full Automation)

```javascript
// release.config.js
module.exports = {
  branches: [
    "main",
    { name: "beta", prerelease: true },
// ... (30 lines trimmed)
    ],
  ],
};
```

## Method 4: GitHub Actions Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
// ... (73 lines trimmed)
          tag_name: ${{ steps.version.outputs.tag }}
          body_path: RELEASE_NOTES.md
          generate_release_notes: true
```

## Method 5: git-cliff (Rust-based, Fast)

```toml
# cliff.toml
[changelog]
header = """
# Changelog

// ... (54 lines trimmed)
[github]
owner = "owner"
repo = "repo"
```

```bash
# Generate changelog
git cliff -o CHANGELOG.md

# Generate for specific range
git cliff v1.0.0..v2.0.0 -o RELEASE_NOTES.md

# Preview without writing
git cliff --unreleased --dry-run
```

## Method 6: Python (commitizen)

```toml
# pyproject.toml
[tool.commitizen]
name = "cz_conventional_commits"
version = "1.0.0"
version_files = [
// ... (11 lines trimmed)
schema_pattern = "^(feat|fix|docs|style|refactor|perf|test|chore)(\\(\\w+\\))?:\\s.*"
bump_pattern = "^(feat|fix|perf|refactor)"
bump_map = {"feat" = "MINOR", "fix" = "PATCH", "perf" = "PATCH", "refactor" = "PATCH"}
```

```bash
# Install
pip install commitizen

# Create commit interactively
cz commit

# Bump version and update changelog
cz bump --changelog

# Check commits
cz check --rev-range HEAD~5..HEAD
```
