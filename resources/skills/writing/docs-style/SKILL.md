---
name: docs-style
description: "Defines style guidelines for writing and updating documentation. Use when writing new docs, READMEs, JSDoc comments, code comments, or reviewing docs for quality."
---

# Docs Style


## Contents

- [Principles](#principles)
- [Doc Types](#doc-types)
- [Tone](#tone)
- [Headings](#headings)
- [Structure Rules](#structure-rules)
- [Folder READMEs](#folder-readmes)
- [JSDoc/TSDoc](#jsdoctsdoc)
- [Code Comments](#code-comments)

Follow [writing-voice](../writing-voice/SKILL.md) for prose tone.

## Principles

- Concise — no filler. Easy to find what you need
- Task-oriented — frame around what the user is trying to do, not what the product can do
- Progressive disclosure — intro to advanced. Don't throw users into the deep end
- Real examples over abstract explanations — show, don't describe
- Code snippets must be copy-pasteable — no placeholder values that silently break, no missing imports
- Prerequisites up front — don't surprise the user halfway through
- One topic per page — covering two things? Split it
- Link, don't repeat — reference other docs instead of duplicating content
- Scannable headings — skimming the TOC should reveal page structure
- Show expected output — after a step, tell the user what they should see
- Consistent terminology — pick one term per concept, use it everywhere
- Screenshots/GIFs for key product features — visuals when they teach faster than text

## Doc Types

Know which type you're writing. Don't mix them in one page:

| Type | Purpose | Key rule |
|------|---------|----------|
| Tutorial | Learning | Must be completable end-to-end — every step produces a working result |
| How-to | Completing a task | Assumes prior knowledge, gets to the point |
| Reference | Looking something up | Exhaustive, consistent structure for every entry |
| Explanation | Understanding why | Conceptual, no steps |

## Tone

**No personality.** The docs aren't a character. No "Let's dive in!", no "The Magic of...", no "Pro Tip:", no emoji in headings. Direct and clinical. The docs serve information.

**Don't patronize.** The reader is a developer. Don't tell them when to use something in a comparison table. If the distinction matters, state it plainly in a sentence, then move on.

**Lead with the thing.** Open with the command or code, not a paragraph explaining what they're about to see.

**Inline guidance over callout boxes.** Weave tips into prose. Reserve `<Tip>`, `<Warning>`, etc. for truly critical warnings (data loss, security). One per page max; zero is often fine.

**Examples should feel real.** Realistic file paths, realistic prompts, realistic tasks. Not `> Tell me about the CLI` but `> @tests/auth.test.ts This test started failing after the last migration`.

**Examples earn their place.** Don't add "Example: Doing X" sections that are just English prompts in a code block. Examples are valuable when they demonstrate non-obvious syntax, flags, piping, or configuration. If the reader could figure it out from the rest of the page, skip it.

## Headings

- Direct and plain, not clever or engaging
- "Resume previous sessions" — good (direct verb)
- "Giving Context with @" — bad (tutorial narrator voice). Use "`@` Context"
- Test: if it sounds like a friendly narrator walking you through something, rewrite it

## Structure Rules

- **No "Next Steps" sections.** Don't end pages with "What's Next?" CardGroups. The sidebar already does this. Put relevant links inline where the context is.
- **Page title = sidebar title.** Drop `sidebarTitle` unless there's a genuine reason for them to differ. Don't stuff extra context into the page title.
- **No subtitle/description in frontmatter.** The opening paragraph provides context. Metadata subtitles duplicate what prose already says.

## Folder READMEs

Explain **why** the folder exists and the mental model. Not a file listing.

Good:

````markdown
# Converters

Transform field schemas into format-specific representations.

```
┌─────────────┐     ┌──────────────┐
│ Field Schema│────▶│  to-arktype  │────▶ Runtime validation
└─────────────┘     ├──────────────┤
                    │  to-drizzle  │────▶ SQLite columns
                    └──────────────┘
```

Field schemas are pure JSON Schema objects with `x-component` hints.
Each converter takes the same input and produces output for a specific consumer.
````

Bad:

```markdown
# Converters

- `to-arktype.ts` - Converts to ArkType
- `to-drizzle.ts` - Converts to Drizzle
- `index.ts` - Exports
```

Can include: ASCII diagrams, overview of key exports, relationships to other folders. Avoid: exhaustive file listings, descriptions that repeat the filename.

## JSDoc/TSDoc

Explain **when and why** to use something, not what it does.

Good:

```typescript
/**
 * Get all table helpers as an array.
 *
 * Useful for providers and indexes that need to iterate over all tables.
 * Returns only the table helpers, excluding utility methods like `clearAll`.
 *
 * @example
 * for (const table of tables.defined()) {
 *   console.log(table.name, table.count());
 * }
 */
defined() { ... }
```

Bad:

```typescript
/** Returns all table helpers as an array. */
defined() { ... }
```

Rules:
- Include `@example` with realistic usage
- Document non-obvious behavior and edge cases
- Public APIs get detailed docs; internal helpers can be minimal

## Code Comments

Comments explain **why**, not **what**.

Good:

```typescript
// Y.Doc clientIDs are random 32-bit integers, so we can't rely on ordering.
// Use timestamps from the entries themselves for deterministic sorting.
const sorted = entries.sort((a, b) => a.timestamp - b.timestamp);
```

Bad:

```typescript
// Sort the entries
const sorted = entries.sort((a, b) => a.timestamp - b.timestamp);
```

- If the code is clear, don't comment it
- Comment workarounds with links to issues/docs
- Delete commented-out code; that's what git is for

## Audience Assessment

Before writing, determine:

| Dimension | Options |
|-----------|---------|
| Technical level | Beginner, Intermediate, Expert |
| Role | End user, Developer, Admin, Stakeholder |
| Prior knowledge | What can you assume? |
| Context | Internal team, External customers, Open source community |

Adjust depth and terminology accordingly. Don't write for beginners if the audience is senior engineers; don't use jargon if the audience is non-technical.

## Tutorial Format

```markdown
# How to [Accomplish Goal]

**Time required**: [X minutes]
**Difficulty**: [Beginner/Intermediate/Advanced]

// ... (23 lines trimmed)

## Troubleshooting
[Common issues and fixes]
```

Key rules for tutorials:
- Every step must produce a working, testable result
- Show expected output after each step
- Include a verification section at the end
- List prerequisites up front — never surprise the reader mid-tutorial

## Architecture Doc Format

```markdown
# [System Name] Architecture

## Overview
[What this system does in 2-3 sentences]

// ... (11 lines trimmed)

## Failure Modes
[What breaks and how the system handles it]
```
