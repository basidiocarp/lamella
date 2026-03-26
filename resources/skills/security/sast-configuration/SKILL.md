---
name: sast-configuration
description: >-
  Configures Static Application Security Testing (SAST) tools for automated vulnerability detection, including SARIF result
  parsing and processing. Use when setting up security scanning, implementing DevSecOps practices, automating code vulnerability
  detection, or processing SARIF output from scanners like CodeQL and Semgrep.
---

# SAST Configuration


## Contents

- [Overview](#overview)
- [Core Capabilities](#core-capabilities)
  - [1. Semgrep Configuration](#1-semgrep-configuration)
  - [2. SonarQube Setup](#2-sonarqube-setup)
  - [3. CodeQL Analysis](#3-codeql-analysis)
- [Quick Start](#quick-start)
  - [Initial Assessment](#initial-assessment)
  - [Basic Setup](#basic-setup)
- [SARIF Result Processing](#sarif-result-processing)
- [Templates & Assets](#templates-assets)
- [Integration Patterns](#integration-patterns)
  - [CI/CD Pipeline Integration](#cicd-pipeline-integration)
  - [Pre-commit Hook](#pre-commit-hook)
- [Best Practices](#best-practices)
- [Common Use Cases](#common-use-cases)
  - [New Project Setup](#new-project-setup)
  - [Custom Rule Development](#custom-rule-development)
  - [Compliance Scanning](#compliance-scanning)
- [Troubleshooting](#troubleshooting)
  - [High False Positive Rate](#high-false-positive-rate)
  - [Performance Issues](#performance-issues)
  - [Integration Failures](#integration-failures)
- [Related Skills](#related-skills)
- [Tool Comparison](#tool-comparison)
- [Next Steps](#next-steps)


Static Application Security Testing (SAST) tool setup, configuration, SARIF result processing, and custom rule creation for comprehensive security scanning across multiple programming languages.

## Overview

This skill provides comprehensive guidance for setting up and configuring SAST tools including Semgrep, SonarQube, and CodeQL, as well as processing their SARIF output. Use this skill when you need to:

- Set up SAST scanning in CI/CD pipelines
- Create custom security rules for your codebase
- Configure quality gates and compliance policies
- Optimize scan performance and reduce false positives
- Integrate multiple SAST tools for defense-in-depth
- Parse, filter, deduplicate, or convert SARIF scan results

## Core Capabilities

### 1. Semgrep Configuration

- Custom rule creation with pattern matching
- Language-specific security rules (Python, JavaScript, Go, Java, etc.)
- CI/CD integration (GitHub Actions, GitLab CI, Jenkins)
- False positive tuning and rule optimization
- Organizational policy enforcement

### 2. SonarQube Setup

- Quality gate configuration
- Security hotspot analysis
- Code coverage and technical debt tracking
- Custom quality profiles for languages
- Enterprise integration with LDAP/SAML

### 3. CodeQL Analysis

- GitHub Advanced Security integration
- Custom query development
- Vulnerability variant analysis
- Security research workflows
- SARIF result processing

## Quick Start

### Initial Assessment

1. Identify primary programming languages in your codebase
2. Determine compliance requirements (PCI-DSS, SOC 2, etc.)
3. Choose SAST tool based on language support and integration needs
4. Review baseline scan to understand current security posture

### Basic Setup

```bash
# Semgrep quick start
pip install semgrep
semgrep --config=auto --error

# SonarQube with Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# CodeQL CLI setup
gh extension install github/gh-codeql
codeql database create mydb --language=python
```

## SARIF Result Processing

SARIF (Static Analysis Results Interchange Format) is the standard output format for security scanners. Use this section when processing results from CodeQL, Semgrep, or other SARIF-producing tools.

### When to Use SARIF Processing

- Reading static analysis scan results in SARIF format
- Aggregating findings from multiple security tools
- Deduplicating or filtering security alerts
- Integrating SARIF data into CI/CD pipelines
- Converting SARIF to other formats

**Note:** This does NOT cover running scans or writing rules — use Semgrep or CodeQL skills for that.

### SARIF Structure

```
sarifLog
├── version: "2.1.0"
└── runs[]
    ├── tool.driver.name
    ├── tool.driver.rules[]
// ... (8 lines trimmed)
            └── physicalLocation
                ├── artifactLocation.uri
                └── region.startLine
```

### Core SARIF Operations

1. **Load and iterate** — Parse the JSON, loop over `runs[].results[]`
2. **Handle optionals** — Many fields are optional; check before accessing
3. **Normalize paths** — `artifactLocation.uri` may be relative or absolute
4. **Deduplicate** — Use `ruleId + file + line` or `fingerprints` as keys
5. **Filter by severity** — Check `result.level` or `rule.defaultConfiguration.level`

### SARIF References

- [references/sarif-python-helpers.md](references/sarif-python-helpers.md) - Python libraries and helper functions for SARIF
- [references/sarif-jq-queries.md](references/sarif-jq-queries.md) - jq queries for SARIF processing
- [references/sarif-ci-cd-integration.md](references/sarif-ci-cd-integration.md) - CI/CD integration patterns for SARIF
- [SARIF Spec](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)

## Templates & Assets

- [sarif_helpers.py](assets/sarif_helpers.py) - Python SARIF parsing helpers

## Integration Patterns

### CI/CD Pipeline Integration

```yaml
# GitHub Actions example
- name: Run Semgrep
  uses: returntocorp/semgrep-action@v1
  with:
    config: >-
      p/security-audit
      p/owasp-top-ten
```

### Pre-commit Hook

```bash
# .pre-commit-config.yaml
- repo: https://github.com/returntocorp/semgrep
  rev: v1.45.0
  hooks:
    - id: semgrep
      args: ['--config=auto', '--error']
```

## Best Practices

1. **Start with Baseline**
   - Run initial scan to establish security baseline
   - Prioritize critical and high severity findings
   - Create remediation roadmap

2. **Incremental Adoption**
   - Begin with security-focused rules
   - Gradually add code quality rules
   - Implement blocking only for critical issues

3. **False Positive Management**
   - Document legitimate suppressions
   - Create allow lists for known safe patterns
   - Regularly review suppressed findings

4. **Performance Optimization**
   - Exclude test files and generated code
   - Use incremental scanning for large codebases
   - Cache scan results in CI/CD

5. **Team Enablement**
   - Provide security training for developers
   - Create internal documentation for common patterns
   - Establish security champions program

## Common Use Cases

### New Project Setup

```bash
# Configure SAST tools for your project
semgrep --config auto --metrics=off .
```

### Custom Rule Development

```yaml
# See references/semgrep-rules.md for detailed examples
rules:
  - id: hardcoded-jwt-secret
    pattern: jwt.encode($DATA, "...", ...)
    message: JWT secret should not be hardcoded
    severity: ERROR
```

### Compliance Scanning

```bash
# PCI-DSS focused scan
semgrep --config p/pci-dss --json -o pci-scan-results.json
```

## Troubleshooting

### High False Positive Rate

- Review and tune rule sensitivity
- Add path filters to exclude test files
- Use nostmt metadata for noisy patterns
- Create organization-specific rule exceptions

### Performance Issues

- Enable incremental scanning
- Parallelize scans across modules
- Optimize rule patterns for efficiency
- Cache dependencies and scan results

### Integration Failures

- Verify API tokens and credentials
- Check network connectivity and proxy settings
- Review SARIF output format compatibility
- Validate CI/CD runner permissions

## Related Skills

- [CodeQL](../codeql/SKILL.md) - Advanced CodeQL query development
- [Security Review](../security-review/SKILL.md) - Manual security review patterns

## Tool Comparison

| Tool      | Best For                 | Language Support | Cost            | Integration   |
| --------- | ------------------------ | ---------------- | --------------- | ------------- |
| Semgrep   | Custom rules, fast scans | 30+ languages    | Free/Enterprise | Excellent     |
| SonarQube | Code quality + security  | 25+ languages    | Free/Commercial | Good          |
| CodeQL    | Deep analysis, research  | 10+ languages    | Free (OSS)      | GitHub native |

## Next Steps

1. Complete initial SAST tool setup
2. Run baseline security scan
3. Create custom rules for organization-specific patterns
4. Integrate into CI/CD pipeline
5. Establish security gate policies
6. Train development team on findings and remediation
```

### Variant Analysis (absorbed from variant-analysis)

| File | Description |
|------|-------------|
| [references/variant-METHODOLOGY.md](references/variant-METHODOLOGY.md) | 5-step variant analysis methodology |
| [assets/variant-semgrep/](assets/variant-semgrep/) | Semgrep rule templates by language |
| [assets/variant-codeql/](assets/variant-codeql/) | CodeQL query templates by language |
| [assets/variant-variant-report-template.md](assets/variant-variant-report-template.md) | Variant analysis report template |

## Reference Files


| File | Path |
|------|------|
| [Cpp](assets/variant-codeql/cpp.ql) | `assets/variant-codeql/cpp.ql` |
| [Go](assets/variant-codeql/go.ql) | `assets/variant-codeql/go.ql` |
| [Java](assets/variant-codeql/java.ql) | `assets/variant-codeql/java.ql` |
| [Javascript](assets/variant-codeql/javascript.ql) | `assets/variant-codeql/javascript.ql` |
| [Python](assets/variant-codeql/python.ql) | `assets/variant-codeql/python.ql` |
| [Cpp](assets/variant-semgrep/cpp.yaml) | `assets/variant-semgrep/cpp.yaml` |
| [Go](assets/variant-semgrep/go.yaml) | `assets/variant-semgrep/go.yaml` |
| [Java](assets/variant-semgrep/java.yaml) | `assets/variant-semgrep/java.yaml` |
| [Javascript](assets/variant-semgrep/javascript.yaml) | `assets/variant-semgrep/javascript.yaml` |
| [Python](assets/variant-semgrep/python.yaml) | `assets/variant-semgrep/python.yaml` |
