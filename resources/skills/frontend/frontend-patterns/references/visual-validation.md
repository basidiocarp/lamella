# Visual Validation

Treat visual review as evidence gathering, not as a vibe check.

## Core Stance

- Start from the assumption that the change did not succeed yet.
- Trust screenshots, recordings, or live UI evidence over code claims.
- Look for failure evidence before you look for confirmation.

## Review Flow

1. Describe what is visible without interpreting intent.
2. Compare the visible result to the stated goal.
3. Check layout, spacing, alignment, and hierarchy.
4. Check responsive states, loading states, and error states.
5. Check that focus, keyboard affordances, and contrast still hold.

## Short Checklist

- [ ] Is the intended change actually visible?
- [ ] Does the change still work at the key breakpoints?
- [ ] Do animations support clarity rather than hide defects?
- [ ] Are focus states, contrast, and readable hierarchy still present?
- [ ] Did the change introduce layout shift, overlap, clipping, or dead space?

## Output Contract

When doing visual validation, report:

1. what the evidence shows
2. whether the goal is met, partly met, or not met
3. the concrete defects or doubts
4. the next verification step if evidence is incomplete
