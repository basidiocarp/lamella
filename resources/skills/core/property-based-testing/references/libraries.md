# PBT Libraries by Language

## Quick Reference

| Language | Library | Import/Setup |
|----------|---------|--------------|
| Python | Hypothesis | `from hypothesis import given, strategies as st` |
| JavaScript/TypeScript | fast-check | `import fc from "fast-check"` |
| Rust | proptest | `use proptest::prelude::*` |
| Go | rapid | `import "pgregory.net/rapid"` |
| Java | jqwik | `import net.jqwik.api.*` |
| Scala | ScalaCheck | `import org.scalacheck._` |
| Haskell | QuickCheck | `import Test.QuickCheck` |
| C++ | RapidCheck | `#include <rapidcheck.h>` |

## Installation

**Python**
```bash
pip install hypothesis
```

**JavaScript/TypeScript**
```bash
npm install fast-check
```

**Rust**
```toml
[dev-dependencies]
proptest = "1.0"
```

**Go**
```bash
go get pgregory.net/rapid
```

## Detecting Existing Usage

```bash
# Python
rg "from hypothesis import" --type py

# JavaScript/TypeScript
rg "from ['\"]fast-check['\"]" --type ts --type js

# Rust
rg "proptest!" --type rust

# Solidity
rg "echidna_" --glob "*.sol"
```
