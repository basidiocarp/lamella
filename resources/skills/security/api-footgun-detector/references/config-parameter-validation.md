# Configuration Parameter Validation

Accepting unsafe security parameters at construction time creates delayed
failures that are hard to spot in review.

## High-Risk Parameters

- algorithms and ciphers
- timeouts and lifetimes
- retry or attempt limits
- file paths and include targets

## Rule

Validate these values as soon as they enter the config object:

- allowlist algorithms
- require positive or bounded numeric values
- restrict paths to approved roots
- reject unknown disable keywords or magic strings

Unsafe config should be rejected on construction, not tolerated until runtime.
