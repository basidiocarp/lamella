# Auth, Stores, and Toolchain

This slice covers environment integration and external system wiring.

## Main Areas

- `auth`
- `stores`
- `vendor`
- `toolchain`

## Rule

Settings that touch identities, secrets, or vendored dependencies should be
explicit and auditable. Avoid silent fallback behavior in these sections.
