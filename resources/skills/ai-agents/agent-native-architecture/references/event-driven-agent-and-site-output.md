# Event-Driven Agents and Site Output

Use this pattern when events, messages, or timers should trigger an agent turn.

## Core Shape

```text
event source -> agent loop -> tool calls -> durable output
```

Examples of event sources:

- chat messages
- webhooks
- cron or scheduled jobs
- user-created files

## Rules

- Convert each event into a prompt with enough local context to act.
- Let the agent decide how to satisfy the outcome with primitive tools.
- Persist outputs into durable storage such as files or indexed records.

## Site as Output

If the product publishes a site or feed, let the agent update source content
files and let the normal site pipeline render them. Avoid special
site-generation tools unless the stack truly requires them.
