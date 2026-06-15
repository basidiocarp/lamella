<overview>
How to design MCP tools that expand capability without hard-coding workflow decisions.
</overview>

<principles>

## Prefer Primitives

- Tools should expose capabilities like reading, writing, storing, sending, or querying.
- Prompts and policies should decide when those capabilities are composed.

## Keep Inputs Simple

- Accept data, not business decisions.
- Avoid enums that encode a full workflow branch when free-form input plus policy is enough.

## Name by Capability

- Prefer names like `write_file`, `store_item`, or `send_message`.
- Avoid names that imply a full business process unless the tool truly owns that process end to end.

</principles>
