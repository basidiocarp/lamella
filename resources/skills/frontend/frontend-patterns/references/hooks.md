# Custom Hooks Patterns

Use custom hooks to extract reusable state or effect logic without hiding too
much component behavior.

## Good Hook Shapes

Good fits:
- simple state helpers such as toggles
- async data or mutation wrappers
- debounce or throttling helpers
- context-backed access hooks

Keep hooks:
- narrowly scoped
- explicit about inputs and outputs
- easy to test in isolation

## State Helpers

Small state hooks should return a predictable tuple or object and avoid hiding
unnecessary side effects.

## Async Hooks

Async hooks should make:
- loading state
- success data
- error state
- cancellation or cleanup

clear at the call site. If the hook becomes a full data layer, move that logic
to a dedicated query library or state module.

## Debounce and Timing Hooks

Use hooks for:
- debounced search
- delayed UI reactions
- timer-driven state transitions

Always handle cleanup so stale timers do not leak or update unmounted
components.

## Context + Reducer Hooks

Context-backed hooks work well when:
- state is shared across a feature boundary
- updates need a small command surface
- the provider boundary is obvious

Do not use context reducers for every local component state problem.

## Authoring Rule

If a hook makes the component easier to read and reuse, it is helping. If it
makes simple state feel hidden or indirect, keep the logic inline.
