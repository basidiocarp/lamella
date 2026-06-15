# PEP 723: Inline Script Metadata

Use PEP 723 for self-contained Python scripts that need dependencies but do not
justify a full project scaffold.

## Good Fits

- one-file automation scripts
- quick utilities shared between projects
- scripts with a few external dependencies

Do not use it for:
- multi-file apps
- reusable packages
- projects with richer build or dependency management needs

## Core Shape

PEP 723 stores script metadata in a comment block inside the script.

Typical fields:
- required Python version
- dependencies
- optional tool-specific metadata

This works especially well with `uv run --script`.

## Operational Guidance

- specify `requires-python`
- keep the script focused on one job
- let the tool manage dependencies instead of hand-editing them repeatedly
- add a docstring or short usage note if the script will be shared

## When to Upgrade Out of PEP 723

Move to `pyproject.toml` when:
- the script grows into a project
- multiple entry points appear
- local packages or editable installs are needed
- dependency management needs become more complex

PEP 723 is best when the script wants to stay a script.
