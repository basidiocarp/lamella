# Tool Call Patterns

Use these patterns when writing MCP-enabled instructions.

## Simple Call

1. validate required input
2. call the tool once
3. check the result
4. confirm the outcome

## Sequential Calls

Use one tool to discover identifiers, then a second to mutate or enrich:

1. search for the target item
2. create or update it
3. fetch the final state if confirmation matters

## Batch Operations

For repeated calls:

1. gather the list of items
2. process each item consistently
3. track success and failure separately
4. summarize the batch outcome clearly

## Schema-Aware Usage

Use `/mcp` to inspect the tool schema before wiring instructions. Good
instructions mention the key required fields and any format constraints the user
must satisfy before the call is attempted.
