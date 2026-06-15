---
name: pci-compliance
description: "Implements PCI DSS controls for payment systems and card data."
origin: lamella
---

# PCI Compliance


## Contents

- [When to Use](#when-to-use)
- [PCI DSS 12 Core Requirements](#pci-dss-12-core-requirements)
- [Compliance Levels](#compliance-levels)
- [Critical: Data Rules](#critical-data-rules)
- [Key Implementation Strategies](#key-implementation-strategies)
- [Reducing PCI Scope](#reducing-pci-scope)
- [Common Violations](#common-violations)
- [SAQ Types](#saq-types)
- [Best Practices](#best-practices)
- [Resources](#resources)

PCI DSS (Payment Card Industry Data Security Standard) compliance for secure payment processing.

## When to Use

- Building payment processing systems
- Handling credit card information
- Implementing secure payment flows
- Conducting PCI compliance audits
- Preparing for PCI DSS assessments

## PCI DSS 12 Core Requirements

### Build and Maintain Secure Network
1. Install and maintain firewall configuration
2. Do not use vendor-supplied defaults

### Protect Cardholder Data
3. Protect stored cardholder data
4. Encrypt transmission across public networks

### Maintain Vulnerability Management
5. Protect systems against malware
6. Develop secure systems and applications

### Implement Strong Access Control
7. Restrict access by business need-to-know
8. Identify and authenticate access
9. Restrict physical access

### Monitor and Test Networks
10. Track and monitor all access
11. Regularly test security systems

### Maintain Information Security Policy
12. Maintain security policy

## Compliance Levels

| Level | Transactions/Year | Requirement |
|-------|-------------------|-------------|
| 1 | > 6 million | Annual ROC |
| 2 | 1-6 million | Annual SAQ |
| 3 | 20K-1M e-commerce | SAQ |
| 4 | < 20K e-commerce | SAQ |

## Critical: Data Rules

### NEVER Store
- Full track data (magnetic stripe)
- CVV/CVC/CVV2
- PIN or PIN block

### Can Store (Encrypted)
- PAN (card number)
- Cardholder name
- Expiration date
- Service code

## Key Implementation Strategies

### 1. Tokenization (Preferred)

Use payment processor tokens, never handle raw card data:

```javascript
// Frontend only - use Stripe.js
const {token} = await stripe.createToken(cardElement);
// Send token.id to server, NOT card details
```

### 2. Encryption at Rest

Use AES-256-GCM for any stored card data.

### 3. Access Control

Require `pci_access` role for cardholder data access.

### 4. Audit Logging

Log all access attempts with timestamp, user, resource, IP.

See [references/code-examples.md](references/code-examples.md) for implementation code.

## Reducing PCI Scope

1. **Use Hosted Payments**: Stripe Checkout, PayPal
2. **Tokenization**: Replace card data with tokens
3. **Network Segmentation**: Isolate cardholder environment
4. **Outsource**: Use PCI-compliant processors
5. **No Storage**: Never store full card details

## Common Violations

| Violation | Impact |
|-----------|--------|
| Storing CVV | CRITICAL - Never allowed |
| Unencrypted PAN | CRITICAL - Must encrypt |
| Weak Encryption | Use AES-256 minimum |
| No Access Controls | Restrict by role |
| Missing Audit Logs | Log all access |
| No TLS | Always use TLS 1.2+ |
| Default Passwords | Change all defaults |

## SAQ Types

| Type | Scope | Questions |
|------|-------|-----------|
| SAQ A | Hosted payment page, no card data | ~20 |
| SAQ A-EP | Embedded form with JS | ~180 |
| SAQ D | Store/process/transmit card data | ~300 |

## Best Practices

- Mask PAN in logs: `411111******1111`
- Validate card numbers with Luhn algorithm
- Use MFA for payment system access
- Regular penetration testing
- Incident response plan ready

## Resources

- [references/code-examples.md](references/code-examples.md) - Tokenization, encryption, validation code
- [references/compliance-checklist.md](references/compliance-checklist.md) - Full audit checklist
- [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
