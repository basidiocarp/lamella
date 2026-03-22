# Wycheproof - Case Study: Elliptic npm Package

This case study demonstrates how Wycheproof found three CVEs in the popular elliptic npm package (3000+ dependents, millions of weekly downloads).

## Overview

The [elliptic](https://www.npmjs.com/package/elliptic) library is an elliptic-curve cryptography library written in JavaScript, supporting ECDH, ECDSA, and EdDSA. Using Wycheproof test vectors on version 6.5.6 revealed multiple vulnerabilities:

- **CVE-2024-42459**: EdDSA signature malleability (appending/removing zeros)
- **CVE-2024-42460**: ECDSA DER encoding - invalid bit placement
- **CVE-2024-42461**: ECDSA DER encoding - leading zero in length field

## Methodology

1. **Identify supported curves**: ed25519 for EdDSA
2. **Find test vectors**: `testvectors_v1/ed25519_test.json`
3. **Parse test vectors**: Load JSON and extract tests
4. **Write test harness**: Create parameterized tests
5. **Run tests**: Identify failures
6. **Analyze root causes**: Examine implementation code
7. **Propose fixes**: Add validation checks

## Key Findings

**EdDSA Issue (CVE-2024-42459):**
- Missing signature length validation
- Allowed trailing zeros in signatures
- Fix: Add `if(sig.length !== 128) return false;`

**ECDSA Issue 1 (CVE-2024-42460):**
- Missing check for first bit being zero in DER-encoded r and s values
- Fix: Add `if ((data[p.place] & 128) !== 0) return false;`

**ECDSA Issue 2 (CVE-2024-42461):**
- DER length field accepted leading zeros
- Fix: Add `if(buf[p.place] === 0x00) return false;`

## Impact

All three vulnerabilities allowed multiple valid signatures for a single message, leading to consensus problems across implementations.

**Lessons learned:**
- Wycheproof catches subtle encoding bugs
- Reusable test harnesses pay dividends
- Test vector comments and flags help diagnose issues
- Even popular libraries benefit from systematic test vector validation

## Signature Malleability: Deep Dive

**Problem:** Implementations that don't validate signature encoding can accept multiple valid signatures for the same message.

**Example (EdDSA):** Appending or removing zeros from signature:
```text
Valid signature:   ...6a5c51eb6f946b30d
Invalid signature: ...6a5c51eb6f946b30d0000  (should be rejected)
```

**How to detect:**
```python
# Add signature length check
if len(sig) != 128:  # EdDSA signatures must be exactly 64 bytes (128 hex chars)
    return False
```

**Impact:** Can lead to consensus problems when different implementations accept/reject the same signatures.

**Related Wycheproof tests:**
- EdDSA: tcId 37 - "removing 0 byte from signature"
- ECDSA: tcId 06 - "Legacy: ASN encoding of r misses leading 0"
