---
name: supply-chain-risk-auditor
description: "Audits dependency supply-chain risk, staleness, and takeover exposure."
origin: lamella
---
# Supply Chain Risk Auditor

Dependency risk assessment and supply chain security auditing.

## When to Use

- Assessing dependency risk before a security audit
- Evaluating supply chain attack surface of a project
- Identifying unmaintained or risky dependencies
- Pre-engagement scoping for supply chain concerns
- Running security audits on npm/pnpm/yarn dependencies
- Checking for outdated packages
- Finding unused dependencies
- Analyzing bundle size impact

## When NOT to Use

- Runtime dependency analysis
- License compliance auditing
- Broad upgrade planning across multiple ecosystems; use `dependency-auditor` for that

## Purpose

You systematically evaluate all dependencies of a project to identify red flags that indicate a high risk of exploitation or takeover. You generate a summary report noting these issues.

### Risk Criteria

A dependency is considered high-risk if it features any of the following risk factors:

* **Single maintainer or team of individuals** - The project is primarily or solely maintained by a single individual, or a small number of individuals. The project is not managed by an organization such as the Linux Foundation or a company such as Microsoft. If the individual is an extremely prolific and well-known contributor to the ecosystem, such as `sindresorhus` or Drew Devault, the risk is lessened but not eliminated. Conversely, if the individual is anonymous — that is, their GitHub identity is not readily tied to a real-world identity — the risk is significantly greater. **Justification:** If a developer is bribed or phished, they could unilaterally push malicious code. Consider the left-pad incident.
* **Unmaintained** - The project is stale (no updates for a long period of time) or explicitly deprecated/archived. The maintainer may have put a note in the README.md or a GitHub issue that the project is inactive, understaffed, or seeking new maintainers. The project's GitHub repository may have a large number of issues noting bugs or security issues that the maintainers have not responded to. Feature request issues do NOT count.  **Justification:** If vulnerabilities are identified in the project, they may not be patched in a timely manner.
* **Low popularity:** The project has a relatively low number of GitHub stars and/or downloads compared to other dependencies used by the target. **Justification:** Fewer users means fewer eyes on the project. If malicious code is introduced, it will not be noticed in a timely manner.
* **High-risk features:** The project implements features that by their nature are especially prone to exploitation, including FFI, deserialization, or third-party code execution. **Justification:** These dependencies are key to the target's security posture, and need to meet a high bar of scrutiny.
* **Presence of past CVEs:** The project has high or critical severity CVEs, especially a large number relative to its popularity and complexity. **Justification:** This is not necessarily an indicator of concern for extremely popular projects that are simply subject to more scrutiny and thus are the subject of more security research.
* **Absence of a security contact:** The project has no security contact listed in `.github/SECURITY.md`, `CONTRIBUTING.md`, `README.md`, etc., or separately on the project's website (if one exists). **Justification:** Individuals who discover a vulnerability will have difficulty reporting it in a safe and timely manner.

## Prerequisites

Ensure that the `gh` tool is available before continuing. Ask the user to install if it is not found.

## Workflow (Initial Setup)

You achieve your purpose by:

1. Creating a `.supply-chain-risk-auditor` directory for your workspace
	* Start a `results.md` report file based on `results-template.md` in this directory
2. Finding all git repositories for direct dependencies.
3. Normalizing the git repository entries to URLs, i.e., if they are just in name/project format, prepend the github URL.

## Workflow (Dependency Audit)
1. For each dependency whose repository you identified in Initial Setup, evaluate its risk according to the Risk Criteria noted above.
	* For any criteria that require actions such as counting open GitHub issues, use the `gh` tool to query the exact data. It is vitally important that any numbers you cite (such as number of stars, open issues, and so on) are accurate. You may round numbers of issues and stars using ~ notation, e.g. "~4000 stars".
2. If a dependency satisfies any of the Risk Criteria noted above, add it to the High-Risk Dependencies table in `results.md`, clearly noting your reason for flagging it as high-risk. For conciseness, skip low-risk dependencies; only note dependencies with at least one risk factor. Do not note "opposites" of risk factors like having a column for "organization backed (lower risk)" dependencies. The absence of a dependency from the report should be the indicator that it is low- or no-risk.

## Workflow (Post-Audit)
1. For each dependency in the High-Risk Dependencies table, fill out the Suggested Alternative field with an alternative dependency that performs the same or similar function but is more popular, better maintained, and so on. Prefer direct successors and drop-in replacements if available. Provide a short justification of your suggestion.
2. Note the total counts for each risk factor category in the Counts by Risk Factor table, and summarize the overall security posture in the Executive Summary section.
3. Summarize your recommendations under the Recommendations section

**NOTE:** Do not add sections beyond those noted in `results-template.md`.

## Practical Dependency Audit Commands

### Security Audit

```bash
# NPM audit
npm audit
npm audit --json
npm audit fix
npm audit fix --force  # May have breaking changes

# PNPM
pnpm audit

# Yarn
yarn audit
```

### Check Outdated Packages

```bash
# NPM
npm outdated

# Interactive update
npx npm-check-updates -i

# Update all to latest
npx npm-check-updates -u
npm install

# Check specific package
npm view <package> versions
```

### Find Unused Dependencies

```bash
# Using depcheck
npx depcheck
npx depcheck --detailed
npx depcheck --ignores="@types/*,eslint-*"
```

**Common false positives:** `@types/*` packages, ESLint/Prettier plugins, PostCSS plugins, Next.js plugins, and Babel presets may be flagged as unused when they're referenced in config files.

### Analyze Bundle Size

```bash
# For Next.js
npx @next/bundle-analyzer

# General purpose
npx source-map-explorer dist/**/*.js

# Check package size before installing
npx package-phobia <package-name>

# Compare alternatives
npx bundlephobia-cli compare lodash ramda
```

## Dependency Review Checklist

### Security
- [ ] No critical/high vulnerabilities
- [ ] Dependencies actively maintained
- [ ] No known malicious packages
- [ ] Lock file committed

### Freshness
- [ ] No major version behind (unless intentional)
- [ ] Security patches applied
- [ ] Deprecated packages replaced

### Cleanliness
- [ ] No unused dependencies
- [ ] No duplicate packages (check lock file)
- [ ] devDependencies vs dependencies correct

## Update Strategies

### Conservative (Recommended)

```bash
# Update patch versions only
npm update

# Update specific package
npm install package@latest
```

### Aggressive

```bash
# Update everything
npx npm-check-updates -u
npm install
npm test
```

### Interactive

```bash
npx npm-check-updates -i
# Options: a - update all, space - toggle, enter - apply
```

## Lock File Best Practices

1. **Always commit** lock files (package-lock.json, pnpm-lock.yaml, yarn.lock)
2. **Use `npm ci`** in CI/CD (not `npm install`)
3. **Regenerate** if corrupted: delete lock file + node_modules, reinstall
4. **Single lock file** per project (don't mix package managers)

## Automated Monitoring

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        dependency-type: "development"
```
