# Payload Collections

Use this reference for the common collection shapes Payload supports.

## Main Collection Types

- basic collections
- auth collections
- upload collections
- globals for singleton content
- versioned or draft-enabled collections

## Rules

- use auth collections only when the content really represents identities
- keep upload config explicit about MIME and sizing constraints
- enable drafts or versions only when editorial workflow needs them
- treat globals as singleton documents, not faux collections
