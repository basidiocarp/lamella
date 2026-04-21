---
name: stride-analysis-patterns
description: "Applies the STRIDE methodology to threat identification, attack tree construction, and security requirement extraction."
origin: lamella
---

# STRIDE Analysis Patterns

Systematic threat identification using the STRIDE methodology, with workflow to translate threats into actionable security requirements.

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
- [Quick Reference](#quick-reference)
- [Security Requirement Extraction](#security-requirement-extraction)
- [Best Practices](#best-practices)
- [References](#references)
- [Resources](#resources)

## When to Use This Skill

- Building threat models for new systems
- Security review of existing architectures
- Identifying attack vectors systematically
- Compliance and security documentation
- Risk assessment and prioritization
- Security design reviews
- Converting threat models to actionable requirements
- Writing security user stories
- Creating security test cases and acceptance criteria
- Compliance requirement mapping

## Core Concepts

### STRIDE Categories

| Category                  | Threat Type                | Example Attack                     |
| ------------------------- | -------------------------- | ---------------------------------- |
| **S**poofing              | Identity theft             | Fake login page, stolen credentials|
| **T**ampering             | Data modification          | SQL injection, MITM attacks        |
| **R**epudiation           | Denying actions            | Deleting audit logs                |
| **I**nformation Disclosure| Data leakage               | Path traversal, verbose errors     |
| **D**enial of Service     | Availability attacks       | DDoS, resource exhaustion          |
| **E**levation of Privilege| Unauthorized access        | Privilege escalation, broken auth  |

### Analysis Flow

```
System Diagram → Identify Components → Apply STRIDE → Document Threats → Requirements → Mitigations
       ↓                 ↓                  ↓                ↓                  ↓            ↓
     DFD         Trust Boundaries    Per-Component     Risk Rating      User Stories     Controls
```

### Risk Rating

| Severity | Impact     | Likelihood | Priority |
| -------- | ---------- | ---------- | -------- |
| Critical | System-wide| Likely     | P0       |
| High     | Major      | Possible   | P1       |
| Medium   | Limited    | Unlikely   | P2       |
| Low      | Minimal    | Rare       | P3       |

## Quick Reference

### STRIDE Per Element

| DFD Element     | Primary STRIDE Threats                              |
| --------------- | --------------------------------------------------- |
| External Entity | S (Spoofing)                                        |
| Process         | S, T, R, I, D, E (all)                              |
| Data Store      | T, R, I, D                                          |
| Data Flow       | T, I, D                                             |
| Trust Boundary  | Focus area for all threats                          |

### Common Mitigations

| STRIDE          | Mitigation Pattern                                  |
| --------------- | --------------------------------------------------- |
| Spoofing        | Strong authentication, MFA, session management      |
| Tampering       | Input validation, integrity checks, signing         |
| Repudiation     | Audit logging, digital signatures, timestamps       |
| Info Disclosure | Encryption, access control, data classification     |
| DoS             | Rate limiting, resource quotas, redundancy          |
| EoP             | Least privilege, RBAC, authorization checks         |

### STRIDE to Security Domain Mapping

| STRIDE Category       | Primary Security Domain(s)            |
|-----------------------|---------------------------------------|
| Spoofing              | Authentication, Session Management    |
| Tampering             | Input Validation, Data Protection     |
| Repudiation           | Audit Logging                         |
| Information Disclosure| Data Protection, Cryptography         |
| Denial of Service     | Availability, Input Validation        |
| Elevation of Privilege| Authorization                         |

### Analysis Checklist

```
For each component:
□ What can be spoofed?
□ What can be tampered with?
□ What actions need non-repudiation?
□ What data could leak?
□ What resources can be exhausted?
□ What privileges could be escalated?
```

## Security Requirement Extraction

Transform STRIDE threat analysis into actionable security requirements.

### Requirement Flow

```
Business Requirements → Security Requirements → Technical Controls
         ↓                       ↓                      ↓
  "Protect customer    "Encrypt PII at rest"   "AES-256 encryption
   data"                                        with KMS key rotation"
```

### Security Requirement Types

| Type               | Focus                   | Example                               |
| ------------------ | ----------------------- | ------------------------------------- |
| **Functional**     | What system must do     | "System must authenticate users"      |
| **Non-functional** | How system must perform | "Authentication must complete in <2s" |
| **Constraint**     | Limitations imposed     | "Must use approved crypto libraries"  |

### Requirement Attributes

| Attribute        | Description                 |
| ---------------- | --------------------------- |
| **Traceability** | Links to threats/compliance |
| **Testability**  | Can be verified             |
| **Priority**     | Business importance         |
| **Risk Level**   | Impact if not met           |

### Security Domains

- `AUTHENTICATION` - Identity verification
- `AUTHORIZATION` - Access control
- `DATA_PROTECTION` - Encryption, data handling
- `AUDIT_LOGGING` - Event tracking
- `INPUT_VALIDATION` - Input sanitization
- `SESSION_MANAGEMENT` - Session handling
- `CRYPTOGRAPHY` - Crypto operations
- `AVAILABILITY` - System uptime

### Security User Story Format

```
As a [security-conscious role],
I want the system to [requirement],
So that [security rationale].

Acceptance Criteria:
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
```

## Best Practices

### Do's

- **Start with DFD** - Visualize data flows first
- **Focus on boundaries** - Trust boundaries are key
- **Be systematic** - Apply all 6 categories
- **Document assumptions** - Record trust assumptions
- **Prioritize by risk** - Focus on high-impact threats
- **Trace to threats** - Every requirement should map to threats
- **Be specific** - Vague requirements can't be tested
- **Include acceptance criteria** - Define "done"
- **Consider compliance** - Map to frameworks early (PCI-DSS, HIPAA, GDPR)
- **Review regularly** - Requirements evolve with threats

### Don'ts

- **Don't skip categories** - Each reveals different threats
- **Don't work alone** - Include developers and ops
- **Don't ignore edge cases** - Attackers find them
- **Don't stop at identification** - Continue to mitigations and requirements
- **Don't treat as one-time** - Update with system changes
- **Don't be generic** - "Be secure" is not a requirement
- **Don't skip rationale** - Explain why it matters
- **Don't forget testability** - If you can't test it, you can't verify it

### When to Update

- New features added
- Architecture changes
- After security incidents
- Compliance audits
- Major dependency updates

## References

Detailed templates and implementation code:

- [Threat Model Template](references/threat-model-template.md) - Complete STRIDE document template
- [Analysis Code](references/analysis-code.md) - Python ThreatModel and StrideAnalyzer classes
- [DFD Analysis](references/dfd-analysis.md) - Data flow analysis and STRIDE mapping
- [Requirement Model](references/requirement-model.md) - Python data model with types and classes for requirements
- [Threat-to-Requirement Extractor](references/threat-to-requirement-extractor.md) - Automated extraction from STRIDE threats
- [Compliance Mapping](references/compliance-mapping.md) - PCI-DSS, HIPAA, GDPR, OWASP requirement mappings
- [User Story Generator](references/user-story-generator.md) - Generate security user stories and epics


### Attack Tree Construction (absorbed)
| File | Description |
|------|-------------|
| [references/attack-tree-data-model.md](references/attack-tree-data-model.md) | Python classes for nodes, trees, enums |
| [references/attack-tree-tree-builder.md](references/attack-tree-tree-builder.md) | Fluent builder pattern with examples |
| [references/attack-tree-diagram-exporters.md](references/attack-tree-diagram-exporters.md) | Mermaid and PlantUML export |
| [references/attack-tree-path-analysis.md](references/attack-tree-path-analysis.md) | Path enumeration and risk scoring |

## Resources

- [Microsoft Threat Modeling](https://docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)
- [OWASP Threat Modeling](https://owasp.org/www-community/Threat_Modeling)
- [STRIDE Paper](https://www.microsoft.com/en-us/security/blog/2007/09/11/stride-chart/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
```
