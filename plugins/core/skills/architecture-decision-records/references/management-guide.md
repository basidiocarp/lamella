# ADR Management Guide

Use this reference to keep ADRs discoverable, reviewable, and historically
trustworthy.

## Directory Shape

A typical ADR directory needs:
- an index or README
- a template
- numbered ADR files
- a clear way to mark deprecated or superseded decisions

Do not renumber historical ADRs after they are created.

## Numbering and Naming

Use stable numeric prefixes such as `0001`, `0002`, `0042`.

Filename pattern:

```text
NNNN-short-descriptive-title.md
```

Good names are:
- short
- decision-focused
- specific enough to scan in an index

## Review Workflow

Before approval:
- context explains the real problem
- options are compared honestly
- consequences include downsides
- related ADRs are linked

After approval:
- update the index
- notify affected teams
- create follow-up implementation work if needed

## Status Handling

Common statuses:
- proposed
- accepted
- rejected
- deprecated
- superseded

Do not rewrite accepted ADRs to reflect new reality. Write a new ADR that
supersedes or deprecates the earlier one.

## Tooling

ADR tooling can help with:
- initializing the directory
- creating numbered files
- listing or linking records

Use tools if they fit the repo, but the core requirement is a stable and
readable decision history.

## Common Failures

- ADR reads like an implementation plan instead of a decision record
- alternatives are omitted, making the record look pre-decided
- accepted ADRs are edited instead of superseded
- no index exists, so decisions become undiscoverable

The point of ADR management is durable decision memory, not document volume.
