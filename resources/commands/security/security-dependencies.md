# Dependency Vulnerability Scanning

## Context

The user needs comprehensive dependency security analysis to identify vulnerable packages, outdated dependencies, and license compliance issues. Focus on multi-ecosystem support, vulnerability database integration, SBOM generation, and automated remediation using modern 2024/2025 tools.

## Requirements

$ARGUMENTS

## Instructions

### 1. Multi-Ecosystem Dependency Scanner

```python
import subprocess
import json
import requests
from pathlib import Path
from typing import Dict, List, Any
from dataclasses import dataclass
# ... (252 lines trimmed)

        return sbom
```

### 2. Vulnerability Prioritization

```python
class VulnerabilityPrioritizer:
    def calculate_priority_score(self, vulnerability: Dict) -> float:
        cvss_score = vulnerability.get('cvss_score', 0) or 0
        exploitability = 1.0 if vulnerability.get('exploit_available') else 0.5
        fix_available = 1.0 if vulnerability.get('fixed_in') else 0.3

        priority_score = (
            cvss_score * 0.4 +
            exploitability * 2.0 +
            fix_available * 1.0
        )

        return round(priority_score, 2)

    def prioritize_vulnerabilities(self, vulnerabilities: List[Dict]) -> List[Dict]:
        for vuln in vulnerabilities:
            vuln['priority_score'] = self.calculate_priority_score(vuln)

        return sorted(vulnerabilities, key=lambda x: x['priority_score'], reverse=True)
```

### 3. CI/CD Integration

```yaml
name: Dependency Security Scan

on:
  push:
    branches: [main]
  schedule:
# ... (44 lines trimmed)
            exit 1
          fi
```

### 4. Automated Updates

```bash
#!/bin/bash
# automated-dependency-update.sh

set -euo pipefail

ECOSYSTEM="$1"
# ... (37 lines trimmed)
        ;;
esac
```

### 5. Reporting

```python
class VulnerabilityReporter:
    def generate_markdown_report(self, scan_results: Dict[str, Any]) -> str:
        report = f"""# Dependency Vulnerability Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

# ... (58 lines trimmed)
        }
        return mapping.get(severity.upper(), 'warning')
```

## Best Practices

1. **Regular Scanning**: Run dependency scans daily via scheduled CI/CD
2. **Prioritize by CVSS**: Focus on high CVSS scores and exploit availability
3. **Staged Updates**: Auto-update patch versions, manual for major versions
4. **Test Coverage**: Always run full test suite after updates
5. **SBOM Generation**: Maintain up-to-date Software Bill of Materials
6. **License Compliance**: Check for restrictive licenses
7. **Rollback Strategy**: Create backup branches before major updates

## Tool Installation

```bash
# Python
pip install safety pip-audit pipenv pip-licenses

# JavaScript
npm install -g snyk npm-check-updates

# Go
go install golang.org/x/vuln/cmd/govulncheck@latest

# Rust
cargo install cargo-audit
```

## Usage Examples

```bash
# Scan all dependencies
python dependency_scanner.py scan --path .

# Generate SBOM
python dependency_scanner.py sbom --format cyclonedx

# Auto-fix vulnerabilities
./automated-dependency-update.sh npm patch

# CI/CD integration
python dependency_scanner.py scan --fail-on critical,high
```

Focus on automated vulnerability detection, risk assessment, and remediation across all major package ecosystems.
