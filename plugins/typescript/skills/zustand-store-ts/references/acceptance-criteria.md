# Zustand Store Acceptance Criteria

Use this file to quickly judge whether a generated Zustand store follows the
intended TypeScript patterns.

## Required Checks

- correct named imports from Zustand and middleware packages
- store created with the intended middleware shape
- state and actions separated clearly
- selectors subscribe narrowly instead of pulling the whole store
- persistence or Immer middleware used deliberately, not by default

## Common Failures

- old `import create from 'zustand'` syntax
- missing selector middleware when the store depends on it
- whole-store destructuring inside components
- unstable selector objects without shallow comparison

## Pass Condition

The generated store should be type-safe, selector-friendly, and explicit about
middleware rather than merely compiling.
