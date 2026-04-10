---
description: Create a multi-persona pack with audience segments, messaging strategy, and CTA guidance
argument-hint: [create|list|strategy|cta] [--market b2b|b2c|b2g|b2d] [--persona <name>]
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Personas

Use this command when the user needs several related personas or a segmentation pass.

Use [`/persona`](persona.md) when they need one canonical persona artifact. Use this command when they want a persona set, messaging matrix, or CTA pack across segments.

## Subcommands

- `create`: build a fresh multi-persona pack
- `list`: summarize the existing personas or segments already documented
- `strategy`: generate messaging, channels, and content guidance for one persona or the whole set
- `cta`: generate CTA variants by persona and funnel stage

## Instructions

1. Parse the requested subcommand from `$ARGUMENTS`.
2. Read the most relevant product docs, existing research, positioning notes, and any prior persona outputs.
3. If the command scope is unclear, ask whether the user wants:
   - a fresh persona set
   - a messaging strategy for existing personas
   - CTA guidance for a known segment
4. Prefer evidence-backed segments over invented detail. Call out assumptions and open questions explicitly.
5. Keep outputs inline unless the user asks for files. If they want saved artifacts, use a normal repo path like `docs/`, `marketing/`, or a user-specified directory instead of legacy `.post-development/` locations.

## `create`

Build a multi-persona pack that covers the major segments for the product or initiative.

Include:
- one primary persona
- one or more secondary personas
- optional edge or emerging personas only if the evidence justifies them

For each persona, capture:
- role or segment name
- context and constraints
- goals
- pains or friction
- buying or adoption triggers
- objections or risks
- preferred channels or content formats
- confidence level and open questions

## `list`

Summarize the persona inventory already present in the working context or repository.

Prefer a compact table or bullet list with:
- persona name
- market or segment
- primary goal
- primary pain
- current confidence

## `strategy`

Generate a messaging strategy for one persona or for the full set.

Include:
- segment-specific positioning
- value proposition
- proof points
- channel recommendations
- content themes
- funnel-stage guidance
- risks where one message could misfit another segment

## `cta`

Generate CTA variants for one persona or for the full set.

Cover:
- awareness, consideration, and decision stages
- at least two channel contexts when relevant
- multiple tones only if the user asks for them

Keep CTAs concrete and segment-aware. Avoid generic filler lines.

## Output Shape

When the user wants a substantial deliverable, organize it as:

1. Segment summary
2. Persona cards
3. Messaging strategy
4. CTA recommendations
5. Assumptions and open questions

## Related Commands

- [`/persona`](persona.md) for a single canonical persona
- [`/seo`](seo.md) for search-driven positioning context
- [`/articles`](articles.md) for article generation
- [`/landing`](landing.md) for landing-page content
