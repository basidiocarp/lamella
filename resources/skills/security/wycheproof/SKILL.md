---
name: wycheproof
description: "Applies Google's Wycheproof test vectors and crypto vulnerability patterns to cryptographic implementations."
origin: lamella
---

# Wycheproof Crypto Testing

Use Wycheproof when the implementation looks correct at the API layer but may still accept malformed signatures, weak keys, invalid curve points, or broken authenticated-encryption inputs.

## When to Use

- Verifying signature, key exchange, MAC, or AEAD implementations
- Auditing a crypto library upgrade against known edge cases
- Reproducing suspected validation bugs with structured test vectors
- Building CI checks around high-risk crypto primitives

## Core Workflow

1. Identify the primitive and library version under review.
2. Pull the matching Wycheproof test vectors.
3. Map each vector result to expected application behavior.
4. Run the suite in CI and flag any invalid vector that is accepted.
5. Triage failures against known vulnerability classes before patching.

## Minimal Test Pattern

```python
def test_ecdsa_signature(test_vector):
    result = verify(test_vector["sig"], test_vector["msg"], test_vector["key"])
    if test_vector["result"] == "invalid":
        assert not result, f"Accepted invalid sig: {test_vector['tcId']}"
    elif test_vector["result"] == "valid":
        assert result, f"Rejected valid sig: {test_vector['tcId']}"
```

## High-Value Coverage Areas

| Area | Typical Failures |
|------|------------------|
| Signatures | Malleability, BER vs DER parsing, weak key acceptance |
| Key exchange | Invalid curve, subgroup, weak parameter acceptance |
| AEAD | Nonce reuse handling, tag truncation, malformed ciphertext acceptance |
| MACs | Key length handling, edge-case verification behavior |

## References

- [references/implementation.md](references/implementation.md)
- [references/vulnerabilities.md](references/vulnerabilities.md)
- [references/case-study.md](references/case-study.md)
- [Wycheproof GitHub](https://github.com/google/wycheproof)
