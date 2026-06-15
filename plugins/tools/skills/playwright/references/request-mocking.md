# Request Mocking

Use request mocking when a Playwright flow depends on network behavior you need
to control.

## CLI Route Commands

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "**/api/users" --body='[{"id":1,"name":"Alice"}]' --content-type=application/json
playwright-cli unroute "**/*.jpg"
playwright-cli unroute
```

## Pattern Matching

```text
**/api/users
**/api/*/details
**/*.{png,jpg,jpeg}
**/search?q=*
```

## Use `run-code` for Advanced Cases

Reach for `run-code` when you need:

- conditional responses based on request body
- response modification after `route.fetch()`
- aborted requests or simulated offline states
- delayed responses for loading-state testing

## Practical Rule

Keep mocks narrowly scoped to the endpoint and behavior under test. Broad route
patterns make tests harder to trust and debug.
