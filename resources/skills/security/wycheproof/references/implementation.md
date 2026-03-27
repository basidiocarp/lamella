# Wycheproof Implementation Guide

Use Wycheproof to prove your crypto implementation rejects malformed, weak, or edge-case inputs that still look plausible to developers.

## 1. Add the Test Vectors

Preferred:

```bash
git submodule add https://github.com/C2SP/wycheproof.git
```

If submodules are not practical, fetch only the vectors you need:

```bash
mkdir -p .wycheproof
curl -fsSL \
  https://raw.githubusercontent.com/C2SP/wycheproof/master/testvectors_v1/aes_gcm_test.json \
  -o .wycheproof/aes_gcm_test.json
```

## 2. Parse the Vectors

Python example:

```python
import json

def load_wycheproof_test_vectors(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as handle:
        raw = json.load(handle)

    vectors = []
    for group in raw["testGroups"]:
        for test in group["tests"]:
            test["key"] = group.get("key")
            test["iv"] = group.get("iv")
            vectors.append(test)
    return vectors
```

JavaScript example:

```javascript
const fs = require("fs").promises;

async function loadWycheproofTestVectors(path) {
  const raw = JSON.parse(await fs.readFile(path, "utf8"));
  const vectors = [];

  for (const group of raw.testGroups) {
    for (const test of group.tests) {
      vectors.push({ ...test, key: group.key, iv: group.iv });
    }
  }

  return vectors;
}
```

## 3. Build the Harness

The harness should distinguish:

- valid cases that must succeed
- invalid cases that must fail
- acceptable edge cases such as legacy or weak-but-documented inputs

Python example:

```python
import pytest
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

vectors = load_wycheproof_test_vectors(".wycheproof/aes_gcm_test.json")

@pytest.mark.parametrize("tv", vectors)
def test_aes_gcm(tv):
    aesgcm = AESGCM(bytes.fromhex(tv["key"]))
    nonce = bytes.fromhex(tv["iv"])
    ciphertext = bytes.fromhex(tv["ct"] + tv["tag"])
    aad = bytes.fromhex(tv.get("aad", ""))

    if tv["result"] == "valid":
        plaintext = aesgcm.decrypt(nonce, ciphertext, aad)
        assert plaintext == bytes.fromhex(tv["msg"])
    else:
        with pytest.raises(Exception):
            aesgcm.decrypt(nonce, ciphertext, aad)
```

## 4. CI Integration

- update the submodule or fetched vectors before test execution
- pin the vector version if reproducibility matters
- schedule periodic updates so newly published negative tests do not lag behind your library

The implementation is only good enough once invalid vectors reliably fail in CI, not just on a local smoke run.
