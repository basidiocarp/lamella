# Application Error Patterns

Use this reference for application-layer error aggregation.

- Add context at I/O and boundary points
- Prefer `anyhow`-style aggregation at the executable edge
- Keep library APIs typed even when the application is not
