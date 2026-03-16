# Wycheproof - Implementation Guide

## Phase 1: Add Wycheproof to Your Project

**Option 1: Git Submodule (Recommended)**

Adding Wycheproof as a git submodule ensures automatic updates:

```bash
git submodule add https://github.com/C2SP/wycheproof.git
```

**Option 2: Fetch Specific Test Vectors**

If submodules aren't possible, fetch specific JSON files:

```bash
#!/bin/bash

TMP_WYCHEPROOF_FOLDER=".wycheproof/"
TEST_VECTORS=('aes_gcm_test.json' 'aes_eax_test.json')
BASE_URL="https://raw.githubusercontent.com/C2SP/wycheproof/master/testvectors_v1/"
// ... (11 lines trimmed)
    fi
  fi
done
```

## Phase 2: Parse Test Vectors

Identify the test file for your algorithm and parse the JSON:

**Python Example:**

```python
import json

def load_wycheproof_test_vectors(path: str):
    testVectors = []
    try:
// ... (19 lines trimmed)
            testVectors.append(tv)

    return testVectors
```

**JavaScript Example:**

```javascript
const fs = require('fs').promises;

async function loadWycheproofTestVectors(path) {
  const tests = [];

// ... (15 lines trimmed)

  return tests;
}
```

## Phase 3: Write Testing Harness

Create test functions that handle both valid and invalid test cases.

**Python/pytest Example:**

```python
import pytest
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

tvs = load_wycheproof_test_vectors("wycheproof/testvectors_v1/aes_gcm_test.json")

// ... (28 lines trimmed)

    assert tv['result'] == 'valid', f"No invalid test case should pass: {tv['comment']}"
    assert decrypted_msg == tv['msg'], f"Decryption mismatch: {tv['comment']}"
```

**JavaScript/Mocha Example:**

```javascript
const assert = require('assert');

function testFactory(tcId, tests) {
  it(`[${tcId + 1}] ${tests[tcId].comment}`, function () {
    const test = tests[tcId];
// ... (20 lines trimmed)
for (var tcId = 0; tcId < tests.length; tcId++) {
  testFactory(tcId, tests);
}
```

## Phase 4: CI Integration

Ensure test vectors stay up to date by:

1. **Using git submodules**: Update submodule in CI before running tests
2. **Fetching latest vectors**: Run fetch script before test execution
3. **Scheduled updates**: Set up weekly/monthly updates to catch new test vectors
