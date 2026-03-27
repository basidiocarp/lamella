# Capability and Parity Tests

Start here when you need to prove the agent can perform the same meaningful
actions the UI offers.

## Outcome-First Assertions

Prefer checks like:

- file exists in the right location
- record was created or updated
- generated content includes the required elements
- blocked state is explicit and actionable

Avoid tests that only assert a specific helper or tool call was made.

## Capability Map

Maintain a map between UI actions and agent paths to success:

```text
"add book" -> add_book
"publish note" -> write_file or publish_to_feed
"remove item" -> delete_file or delete_item
```

Test that each mapped outcome is achievable from natural language, not only
through direct tool invocation.
