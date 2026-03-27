---
title: "Voice Refine - Before/After Examples"
description: "Real-world examples of verbose voice input transformed into structured prompts"
tags: [reference, tts, skill]
---

# Voice Refine - Before/After Examples

## Example 1: React Table

Before:
- verbose request about a React table
- mentions pagination, sorting, Tailwind, existing Button, and loading state

After:

```markdown
## Context
React + Tailwind, existing Button component, users API already exists

## Objective
Build a paginated sortable users table

## Constraints
- large dataset
- sort by name and signup date
- loading state

## Output
React + TypeScript component
```

## Example 2: Auth Refactor

```markdown
## Context
Next.js 15 + Prisma, existing auth code needs cleanup

## Objective
Implement credentials + OAuth auth flow

## Constraints
- JWT + refresh tokens
- graceful token expiry
- protected-route middleware

## Output
Auth module with middleware and hooks
```

## Example 3: Bug Report

```markdown
## Bug
Image uploads above 5MB hang and end with an unhelpful error

## Fix Required
- validate size before upload
- show a clear error
- show upload progress
```
