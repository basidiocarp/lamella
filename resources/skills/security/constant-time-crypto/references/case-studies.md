# Case Studies

## Case Study: OpenSSL RSA Timing Attack

Brumley and Boneh (2005) extracted RSA private keys from OpenSSL over a network. The vulnerability exploited Montgomery multiplication's variable-time reduction step.

**Attack vector:** Timing differences in modular exponentiation
**Detection approach:** Statistical analysis (precursor to dudect)
**Impact:** Remote key extraction

**Tools used:** Custom timing measurement
**Techniques applied:** Statistical analysis, chosen-ciphertext queries

### Technical Details

RSA decryption computes:

$$ct^{d} \mod{N}$$

where $d$ is the secret exponent. Montgomery multiplication (commonly used for modular arithmetic) leaks timing: when intermediate values exceed modulus $N$, an additional reduction step is required. An attacker constructs inputs $y$ and $y'$ such that:

$$
\begin{align*}
y^2 < y^3 < N \\
y'^2 < N \leq y'^3
\end{align*}
$$

For $y$, both multiplications take time $t_1+t_1$. For $y'$, the second multiplication requires reduction, taking time $t_1+t_2$. This timing difference reveals whether $d_i$ is 0 or 1.

---

## Case Study: KyberSlash

Post-quantum algorithm Kyber's reference implementation contained timing vulnerabilities in polynomial operations. Division operations leaked secret coefficients.

**Attack vector:** Secret-dependent division timing
**Detection approach:** Dynamic analysis and statistical testing
**Impact:** Secret key recovery in post-quantum cryptography

**Tools used:** Timing measurement tools
**Techniques applied:** Differential timing analysis

### Lesson Learned

This case demonstrates that constant-time issues persist even in modern post-quantum cryptography. Division operations on secrets remain a critical vulnerability pattern.

---

## Case Study: AES Cache Timing

Bernstein (2005) demonstrated that AES implementations using lookup tables are vulnerable to cache-timing attacks.

**Attack vector:** Cache access patterns during S-box lookups
**Detection approach:** Statistical timing analysis across cache lines
**Impact:** AES key extraction via cache timing side channels

### Technical Analysis

AES T-table implementations access lookup tables at indices derived from the secret key:

```c
// Vulnerable pattern
result = T0[state[0] ^ key[0]] ^ T1[state[1] ^ key[1]] ^ ...
```

Cache misses vs. hits create observable timing differences correlated with key bytes.

**Mitigation:** Use bit-sliced implementations or constant-time AES-NI instructions.
