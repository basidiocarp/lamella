# Dependency Upgrade Strategy

## Context

The user needs to upgrade project dependencies safely, handling breaking changes, ensuring compatibility, and maintaining stability. Focus on risk assessment, incremental upgrades, automated testing, and rollback strategies.

## Requirements

$ARGUMENTS

## Instructions

### 1. Dependency Update Analysis

Assess current dependency state and upgrade needs:

**Comprehensive Dependency Audit**

```python
import json
import subprocess
from datetime import datetime, timedelta
from packaging import version

class DependencyAnalyzer:
    def analyze_update_opportunities(self):
# ... (74 lines trimmed for brevity)
        except:
            return 'unknown'
```

### 2. Breaking Change Detection

Identify potential breaking changes:

**Breaking Change Scanner**

```python
class BreakingChangeDetector:
    def detect_breaking_changes(self, package_name, current_version, target_version):
        """
        Detect breaking changes between versions
        """
        breaking_changes = {
            'api_changes': [],
# ... (75 lines trimmed for brevity)

        return changes
```

### 3. Migration Guide Generation

Create detailed migration guides:

**Migration Guide Generator**

````python
def generate_migration_guide(package_name, current_version, target_version, breaking_changes):
    """
    Generate step-by-step migration guide
    """
    guide = f"""
# Migration Guide: {package_name} {current_version} → {target_version}

# ... (16 lines trimmed for brevity)
### Step 1: Update Dependencies

```bash
# Create a new branch
git checkout -b upgrade/{package_name}-{target_version}

# Update package
npm install {package_name}@{target_version}

# Update peer dependencies if needed
{generate_peer_deps_commands(package_name, target_version)}
````

### Step 2: Address Breaking Changes

{generate_breaking_change_fixes(breaking_changes)}

### Step 3: Update Code Patterns

{generate_code_updates(package_name, current_version, target_version)}

### Step 4: Run Codemods (if available)

{generate_codemod_commands(package_name, target_version)}

### Step 5: Test & Verify

```bash
# Run linter to catch issues
npm run lint

# Run tests
npm test

# Run type checking
npm run type-check

# Manual testing checklist
```

{generate_test_checklist(package_name, breaking_changes)}

### Step 6: Performance Validation

{generate_performance_checks(package_name)}

## Rollback Plan

If issues arise, follow these steps to rollback:

```bash
# Revert package version
git checkout package.json package-lock.json
npm install

# Or use the backup branch
git checkout main
git branch -D upgrade/{package_name}-{target_version}
```

## Common Issues & Solutions

{generate_common_issues(package_name, target_version)}

## Resources

- [Official Migration Guide]({get_official_guide_url(package_name, target_version)})
- [Changelog]({get_changelog_url(package_name, target_version)})
- [Community Discussions](<{get_community_url(package_name)}>)
  """
      return guide

````

### 4. Incremental Upgrade Strategy

Plan safe incremental upgrades:

**Incremental Upgrade Planner**
```python
class IncrementalUpgrader:
    def plan_incremental_upgrade(self, package_name, current, target):
        """
        Plan incremental upgrade path
        """
        # Get all versions between current and target
        all_versions = self._get_versions_between(package_name, current, target)
# ... (23 lines trimmed for brevity)
**Breaking Changes**: {step['breaking_changes']}

```bash
# Upgrade command
npm install {package_name}@{step['version']}

# Test command
npm test -- --updateSnapshot

# Verification
npm run integration-tests
````

**Key Changes**:
{self.\_summarize_changes(step)}

**Testing Focus**:
{self.\_get_test_focus(step)}

# ... (20 lines trimmed for brevity)
        return safe_versions

````

### 5. Automated Testing Strategy

Ensure upgrades don't break functionality:

**Upgrade Test Suite**
```javascript
// upgrade-tests.js
const { runUpgradeTests } = require('./upgrade-test-framework');

async function testDependencyUpgrade(packageName, targetVersion) {
    const testSuite = {
        preUpgrade: async () => {
            // Capture baseline
# ... (48 lines trimmed for brevity)
    return runUpgradeTests(testSuite);
}
````

### 6. Compatibility Matrix

Check compatibility across dependencies:

**Compatibility Checker**

```python
def generate_compatibility_matrix(dependencies):
    """
    Generate compatibility matrix for dependencies
    """
    matrix = {}

    for dep_name, dep_info in dependencies.items():
# ... (36 lines trimmed for brevity)

    return compatible_packages
```

### 7. Rollback Strategy

Implement safe rollback procedures:

**Rollback Manager**

```bash
#!/bin/bash
# rollback-dependencies.sh

# Create rollback point
create_rollback_point() {
    echo "📌 Creating rollback point..."

# ... (43 lines trimmed for brevity)
    echo "✅ Rollback verified"
}
```

### 8. Batch Update Strategy

Handle multiple updates efficiently:

**Batch Update Planner**

```python
def plan_batch_updates(dependencies):
    """
    Plan efficient batch updates
    """
    # Group by update type
    groups = {
        'patch': [],
# ... (53 lines trimmed for brevity)

    return generate_batch_plan(batches)
```

### 9. Framework-Specific Upgrades

Handle framework upgrades:

**Framework Upgrade Guides**

```python
framework_upgrades = {
    'angular': {
        'upgrade_command': 'ng update',
        'pre_checks': [
            'ng update @angular/core@{version} --dry-run',
            'npm audit',
            'ng lint'
# ... (35 lines trimmed for brevity)
    }
}
```

### 10. Post-Upgrade Monitoring

Monitor application after upgrades:

```javascript
// post-upgrade-monitoring.js
const monitoring = {
  metrics: {
    performance: {
      page_load_time: { threshold: 3000, unit: "ms" },
      api_response_time: { threshold: 500, unit: "ms" },
      memory_usage: { threshold: 512, unit: "MB" },
# ... (48 lines trimmed for brevity)
  },
};
```

## Output Format

1. **Upgrade Overview**: Summary of available updates with risk assessment
2. **Priority Matrix**: Ordered list of updates by importance and safety
3. **Migration Guides**: Step-by-step guides for each major upgrade
4. **Compatibility Report**: Dependency compatibility analysis
5. **Test Strategy**: Automated tests for validating upgrades
6. **Rollback Plan**: Clear procedures for reverting if needed
7. **Monitoring Dashboard**: Post-upgrade health metrics
8. **Timeline**: Realistic schedule for implementing upgrades

Focus on safe, incremental upgrades that maintain system stability while keeping dependencies current and secure.
