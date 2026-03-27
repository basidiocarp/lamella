# Helm Templating Best Practices

Use these rules when shaping reusable chart templates.

## Core Practices

- Put repeated naming and label logic in `_helpers.tpl`.
- Use `required` for critical values.
- Keep selectors stable and labels consistent.
- Prefer simple, readable helpers over deeply nested template logic.
- Move environment-specific values into `values.yaml` rather than branching heavily in templates.
