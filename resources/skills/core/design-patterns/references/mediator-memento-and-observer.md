# Mediator, Memento, and Observer

## Mediator

Use when components interact in too many direct pairwise ways and need a
coordination hub.

## Memento

Use when you need save-and-restore snapshots without exposing the whole object
internals.

## Observer

Use when state changes should fan out to multiple listeners without the source
knowing who they are.

## Watch For

- Mediator becoming a god object
- Memento storing too much state
- Observer leaks from forgotten unsubscription
