# Backend Hierarchy

Backend settings can be defined at organization, environment, component-type,
or component level.

Rules:

- more specific scopes override broader defaults
- component-level overrides should be rare and intentional
- track where the effective backend came from before editing generated files
