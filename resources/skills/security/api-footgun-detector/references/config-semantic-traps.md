# Configuration Semantic Traps

Security bugs often hide in values that look harmless but mean too many things.

## Common Traps

- `0` meaning unlimited, disabled, or immediate expiry
- empty string acting like a valid credential
- `null` meaning skip verification
- booleans that disable a security control
- wildcard strings such as `*` or `any`

## Design Rule

If the security meaning of a value is ambiguous, split it into explicit fields
such as:

- `enabled: true`
- `timeout_seconds: 300`

Do not overload one magic value to mean "off".
