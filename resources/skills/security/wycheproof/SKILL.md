---
name: wycheproof
description: Google's Wycheproof test vectors and crypto vulnerability patterns. Use when testing cryptographic implementations, validating crypto libraries against known attacks, or auditing encryption code.
---

# Wycheproof Crypto Testing

## Contents

- [What is Wycheproof](#what-is-wycheproof)
- [Quick Reference](#quick-reference)
- [Workflow](#workflow)
- [Key Vulnerability Classes](#key-vulnerability-classes)
- [Best Practices](#best-practices)
- [References](#references)

## What is Wycheproof

Wycheproof is Google's collection of security tests for cryptographic libraries that detect known weaknesses. It catches implementation bugs that correct APIs miss via 80,000+ test vectors covering signatures, key exchange, symmetric encryption, and MACs.

## Quick Reference

| Category | Coverage | Common Issues |
|----------|----------|---------------|
| RSA/ECDSA Signatures | Key validation, encoding | Malleable signatures, weak keys |
| Key Exchange (ECDH, DH) | Curve validation | Invalid curve attacks |
| AES-GCM/ChaCha20 | Nonce handling, auth tags | Nonce reuse, tag truncation |
| MACs (HMAC, Poly1305) | Key/tag validation | Length extension |

## Workflow

```
┌─────────────────┐
│ Identify crypto │
│   operations    │
└────────┬────────┘
         │
// ... (20 lines trimmed)
│  All edge cases │
│    handled      │
└─────────────────┘
```

## Key Vulnerability Classes

**Signature Issues**: Malleable ECDSA, weak RSA exponents, BER vs DER encoding
**Key Exchange**: Small subgroup attacks, invalid curve points, weak DH params
**Symmetric Crypto**: IV/nonce reuse, tag truncation, padding oracle
**Encoding**: ASN.1 parsing bugs, integer overflow, length confusion

## Best Practices

1. **Test flag handling**: Verify acceptable/invalid results match expectations
2. **Version testing**: Run against multiple library versions
3. **CI integration**: Include Wycheproof in automated testing
4. **Track CVEs**: Map test failures to known vulnerabilities

```python
# Basic test structure
def test_ecdsa_signature(test_vector):
    result = verify(test_vector["sig"], test_vector["msg"], test_vector["key"])
    if test_vector["result"] == "invalid":
        assert not result, f"Accepted invalid sig: {test_vector['tcId']}"
    elif test_vector["result"] == "valid":
        assert result, f"Rejected valid sig: {test_vector['tcId']}"
```

## References

- [references/implementation.md](references/implementation.md) - Full implementation guide
- [references/case-study.md](references/case-study.md) - Real-world audit examples
- [references/vulnerabilities.md](references/vulnerabilities.md) - Detailed vulnerability patterns
- [Wycheproof GitHub](https://github.com/google/wycheproof)
