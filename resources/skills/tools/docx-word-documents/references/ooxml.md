# Office Open XML Technical Reference

Use this file as the routing page for low-level DOCX editing.

## Open These References By Task

1. [ooxml-schema-and-content-patterns.md](./ooxml-schema-and-content-patterns.md)
   Use for paragraph structure, lists, tables, text runs, and basic schema
   rules.
2. [relationships-links-and-images.md](./relationships-links-and-images.md)
   Use for relationships, hyperlinks, media, content types, and image wiring.
3. [document-library-usage.md](./document-library-usage.md)
   Use for the Python `Document` helper and edit workflow.
4. [tracked-changes-and-comments.md](./tracked-changes-and-comments.md)
   Use for tracked changes, comments, rejection flows, and validation rules.

## Core Rules

- keep paragraph-level XML valid and ordered
- preserve whitespace with `xml:space="preserve"` when needed
- keep RSIDs as eight-digit hex values
- do not edit another author's tracked change content directly
- update relationships and content types when adding linked assets

## When To Prefer The Library

If the change can be expressed through the `Document` helper in
`scripts/document.py`, use that instead of hand-assembling raw XML. Drop to
direct XML only for cases the helper cannot cover cleanly.
