---
name: changelog
description: Generate a short daily, weekly, or custom-window changelog from recent merged work
argument-hint: "[daily|weekly|N-days] [--audience dev|product|leadership] [--channel discord|slack|docs]"
---

# Changelog

Generate a concise changelog for recent merged work. Use this for team updates, internal release summaries, or lightweight status posts.

Use [`/release-notes`](release-notes.md) for formal versioned release artifacts.

## Time Window

- For daily changelogs: look at PRs merged in the last 24 hours
- For weekly summaries: look at PRs merged in the last 7 days
- For custom windows: interpret a numeric argument as the number of days
- Default to the last day if no window is provided

Always label the output with the actual window you used.

## PR Analysis

Analyze recent merged work and gather:

1. User-facing changes
2. Important bug fixes
3. Operational or developer-facing improvements worth sharing
4. Breaking changes or rollout notes
5. PR numbers and contributor names when available

Use `gh` to enrich PR titles, labels, descriptions, and linked issues when it is available. If it is not available, continue from local git history.

## Priorities

1. Breaking changes
2. User-facing features
3. Critical bug fixes
4. Performance improvements
5. Developer experience improvements
6. Documentation updates

## Formatting

When writing the changelog:

1. Keep it concise and readable.
2. Lead with the most important changes.
3. Group related items.
4. Include PR numbers when you have them.
5. Credit contributors naturally, not as filler.
6. Match the audience:
   - `dev`: more implementation detail
   - `product`: emphasize user and roadmap impact
   - `leadership`: emphasize outcomes, risk, and momentum
7. Match the channel:
   - `discord` or `slack`: keep it short and post-ready
   - `docs`: a slightly fuller summary is acceptable

If the user does not specify a target channel, produce a concise Markdown changelog that can be pasted into chat or docs.

## Deployment Notes

When relevant, include:
- database migrations
- environment variable updates
- manual rollout steps
- dependency or infrastructure changes that operators should know about

## Output Shape

Use this structure:

```markdown
# [Daily|Weekly|Custom] Changelog — YYYY-MM-DD

## Breaking Changes
- ...

## Highlights
- ...

## Fixes
- ...

## Other Improvements
- ...

## Shoutouts
- ...
```

Omit empty sections.

## Edge Cases

- If no changes landed in the selected window, return a short quiet-period note.
- If PR metadata is incomplete, use the best available local information and note assumptions briefly.
- Keep chat-post versions under the target channel limit.
