# Dependency Audit and Security Analysis

## Context

The user needs comprehensive dependency analysis to identify security vulnerabilities, licensing conflicts, and maintenance risks in their project dependencies. Focus on actionable insights with automated fixes where possible.

## Requirements

$ARGUMENTS

## Instructions

### 1. Dependency Discovery

Scan and inventory all project dependencies:

**Multi-Language Detection**

```python
import os
import json
import toml
import yaml
from pathlib import Path

class DependencyDiscovery:
# ... (61 lines trimmed for brevity)

        return deps
```

**Dependency Tree Analysis**

```python
def build_dependency_tree(dependencies):
    """
    Build complete dependency tree including transitive dependencies
    """
    tree = {
        'root': {
            'name': 'project',
# ... (34 lines trimmed for brevity)
    add_dependencies(tree['root'], dependencies)
    return tree
```

### 2. Vulnerability Scanning

Check dependencies against vulnerability databases:

**CVE Database Check**

```python
import requests
from datetime import datetime

class VulnerabilityScanner:
    def __init__(self):
        self.vulnerability_apis = {
            'npm': 'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk',
# ... (60 lines trimmed for brevity)

        return vulnerabilities
```

**Severity Analysis**

```python
def analyze_vulnerability_severity(vulnerabilities):
    """
    Analyze and prioritize vulnerabilities by severity
    """
    severity_scores = {
        'critical': 9.0,
        'high': 7.0,
# ... (48 lines trimmed for brevity)

    return analysis
```

### 3. License Compliance

Analyze dependency licenses for compatibility:

**License Detection**

```python
class LicenseAnalyzer:
    def __init__(self):
        self.license_compatibility = {
            'MIT': ['MIT', 'BSD', 'Apache-2.0', 'ISC'],
            'Apache-2.0': ['Apache-2.0', 'MIT', 'BSD'],
            'GPL-3.0': ['GPL-3.0', 'GPL-2.0'],
            'BSD-3-Clause': ['BSD-3-Clause', 'MIT', 'Apache-2.0'],
# ... (51 lines trimmed for brevity)
            'compliance_status': 'FAIL' if issues else 'PASS'
        }
```

**License Report**

```markdown
## License Compliance Report

### Summary

- **Project License**: MIT
- **Total Dependencies**: 245
- **License Issues**: 3
# ... (32 lines trimmed for brevity)
     - Review source code for license information
     - Consider replacing with known alternatives
```

### 4. Outdated Dependencies

Identify and prioritize dependency updates:

**Version Analysis**

```python
def analyze_outdated_dependencies(dependencies):
    """
    Check for outdated dependencies
    """
    outdated = []

    for package_name, package_info in dependencies.items():
# ... (53 lines trimmed for brevity)

    return sorted(outdated_deps, key=lambda x: x['priority_score'], reverse=True)
```

### 5. Dependency Size Analysis

Analyze bundle size impact:

**Bundle Size Impact**

```javascript
// Analyze NPM package sizes
const analyzeBundleSize = async (dependencies) => {
  const sizeAnalysis = {
    totalSize: 0,
    totalGzipped: 0,
    packages: [],
    recommendations: [],
# ... (45 lines trimmed for brevity)
  return sizeAnalysis;
};
```

### 6. Supply Chain Security

Check for dependency hijacking and typosquatting:

**Supply Chain Checks**

```python
def check_supply_chain_security(dependencies):
    """
    Perform supply chain security checks
    """
    security_issues = []

    for package_name, package_info in dependencies.items():
# ... (51 lines trimmed for brevity)

    return {'suspicious': False}
```

### 7. Automated Remediation

Generate automated fixes:

**Update Scripts**

```bash
#!/bin/bash
# Auto-update dependencies with security fixes

echo "🔒 Security Update Script"
echo "========================"

# NPM/Yarn updates
# ... (38 lines trimmed for brevity)
    fi
fi
```

**Pull Request Generation**

```python
def generate_dependency_update_pr(updates):
    """
    Generate PR with dependency updates
    """
    pr_body = f"""
## 🔒 Dependency Security Update

# ... (44 lines trimmed for brevity)
        'labels': ['dependencies', 'security']
    }
```

### 8. Monitoring and Alerts

Set up continuous dependency monitoring:

**GitHub Actions Workflow**

```yaml
name: Dependency Audit

on:
  schedule:
    - cron: "0 0 * * *" # Daily
  push:
    paths:
# ... (48 lines trimmed for brevity)
              });
            }
```

## Output Format

1. **Executive Summary**: High-level risk assessment and action items
2. **Vulnerability Report**: Detailed CVE analysis with severity ratings
3. **License Compliance**: Compatibility matrix and legal risks
4. **Update Recommendations**: Prioritized list with effort estimates
5. **Supply Chain Analysis**: Typosquatting and hijacking risks
6. **Remediation Scripts**: Automated update commands and PR generation
7. **Size Impact Report**: Bundle size analysis and optimization tips
8. **Monitoring Setup**: CI/CD integration for continuous scanning

Focus on actionable insights that help maintain secure, compliant, and efficient dependency management.
