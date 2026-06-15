# Token Categories and Naming

Design tokens should expose a clear hierarchy:

- primitive tokens for raw values
- semantic tokens for intended meaning
- component tokens for local application

## Naming Rules

- use kebab-case
- prefer semantic names such as `text-primary`
- keep state suffixes explicit: `-hover`, `-focus`, `-disabled`
- avoid leaking temporary implementation details into long-lived names
