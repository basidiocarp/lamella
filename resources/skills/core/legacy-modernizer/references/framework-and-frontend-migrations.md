# Framework and Frontend Migrations

Framework and UI migrations usually benefit from side-by-side execution more
than direct replacement.

## Common Approaches

- proxy or adapter layer between old and new framework surfaces
- incremental route or component replacement
- shared state bridge during coexistence

## Watch For

- duplicated business logic in both stacks
- bundle or performance regressions during overlap
- styling and routing divergence between the two worlds
