# Wycheproof - Common Vulnerabilities Detected

Wycheproof test vectors are designed to catch specific vulnerability patterns:

| Vulnerability | Description | Affected Algorithms | Example CVE |
|---------------|-------------|---------------------|-------------|
| Signature malleability | Multiple valid signatures for same message | ECDSA, EdDSA | CVE-2024-42459 |
| Invalid DER encoding | Accepting non-canonical DER signatures | ECDSA | CVE-2024-42460, CVE-2024-42461 |
| Invalid curve attacks | ECDH with invalid curve points | ECDH | Common in many libraries |
| Padding oracle | Timing leaks in padding validation | RSA-PKCS1 | Historical OpenSSL issues |
| Tag forgery | Accepting modified authentication tags | AES-GCM, ChaCha20-Poly1305 | Various implementations |

## Advanced Usage

### Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| Filter test groups by parameters | Focus on test vectors relevant to your implementation constraints |
| Use test vector flags | Understand specific vulnerability patterns being tested |
| Check the `notes` field | Get detailed explanations of flag meanings |
| Test both encrypt/decrypt and sign/verify | Ensure bidirectional correctness |
| Run tests in CI | Catch regressions and benefit from new test vectors |
| Use parameterized tests | Get clear failure messages with tcId and comment |

### Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|----------------|------------------|
| Only testing valid cases | Misses vulnerabilities where invalid inputs are accepted | Test all result types: valid, invalid, acceptable |
| Ignoring "acceptable" result | Implementation might have subtle bugs | Treat acceptable as warnings worth investigating |
| Not filtering test groups | Wastes time on unsupported parameters | Filter by keySize, ivSize, etc. based on your implementation |
| Not updating test vectors | Miss new vulnerability patterns | Use submodules or scheduled fetches |
| Testing only one direction | Encrypt/sign might work but decrypt/verify fails | Test both operations |

## Related Skills

### Tool Skills

| Skill | Primary Use in Wycheproof Testing |
|-------|-----------------------------------|
| **pytest** | Python testing framework for parameterized tests |
| **mocha** | JavaScript testing framework for test generation |
| **constant-time-testing** | Complement Wycheproof with timing side-channel testing |
| **cryptofuzz** | Fuzz-based crypto testing to find additional bugs |

### Technique Skills

| Skill | When to Apply |
|-------|---------------|
| **fuzz-coverage-analysis** | Ensure test vectors cover all code paths in crypto implementation |
| **property-based-testing** | Test mathematical properties (e.g., encrypt/decrypt round-trip) |
| **fuzz-harness-writing** | Create harnesses for crypto parsers (complements Wycheproof) |

### Related Domain Skills

| Skill | Relationship |
|-------|--------------|
| **crypto-testing** | Wycheproof is a key tool in comprehensive crypto testing methodology |
| **fuzzing** | Use fuzzing to find bugs Wycheproof doesn't cover (new edge cases) |

## Skill Dependency Map

```
                    ┌─────────────────────┐
                    │    wycheproof       │
                    │   (this skill)      │
                    └──────────┬──────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   Tool Skills       │ │  Technique Skills   │ │  Domain Skills      │
│ pytest, mocha,      │ │ coverage, harness,  │ │ crypto testing,     │
│ constant-time       │ │ PBT                 │ │ fuzzing             │
│ testing             │ │                     │ │                     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```
