# Django Settings Examples

Use split settings when the project needs different configuration by environment
without hiding the shared defaults.

## Common Shape

Typical layout:
- `base.py` for shared defaults
- `development.py` for local tooling and debug behavior
- `production.py` for hardened runtime settings

Keep the base file authoritative for defaults. Environment-specific files should
override only what truly changes.

## Development Settings

Typical development-only concerns:
- `DEBUG = True`
- local hosts
- debug toolbar
- console email backend
- local database name overrides

Do not let development settings become a second base file.

## Production Settings

Typical production concerns:
- `DEBUG = False`
- environment-driven hosts and secrets
- secure cookie and header settings
- real email, logging, and cache backends

Treat production settings as an explicit hardening layer, not just “base with
DEBUG off.”

## Design Rule

If the settings split becomes hard to understand, the override model is too
clever. Keep the environment files narrow and obvious.
