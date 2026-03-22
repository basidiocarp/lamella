# Track Operations

## Creating a Track

1. Run `/conductor:new-track`
2. Answer interactive questions
3. Review generated spec.md
4. Review generated plan.md
5. Confirm track creation

## Starting Implementation

1. Read spec.md and plan.md
2. Verify context artifacts are current
3. Mark first task as `[~]`
4. Begin TDD workflow

## Completing a Phase

1. Ensure all phase tasks are `[x]`
2. Complete verification tasks
3. Wait for checkpoint approval
4. Record checkpoint SHA
5. Proceed to next phase

## Completing a Track

1. Verify all phases complete
2. Verify all acceptance criteria met
3. Update product.md if needed
4. Mark track completed in tracks.md
5. Update metadata.json

## Reverting a Track

1. Run `/conductor:revert`
2. Select track to revert
3. Choose granularity (track/phase/task)
4. Confirm revert operation
5. Update status markers

## Handling Track Dependencies

### Identifying Dependencies

During track creation, identify:

- **Hard dependencies**: Must complete before this track can start
- **Soft dependencies**: Can proceed in parallel but may affect integration
- **External dependencies**: Third-party services, APIs, or team decisions

### Documenting Dependencies

In spec.md, list dependencies with:

- Dependency type (hard/soft/external)
- Current status (available/pending/blocked)
- Resolution path (what needs to happen)

### Managing Blocked Tracks

When a track is blocked:

1. Mark blocked tasks with `[!]` and reason
2. Update tracks.md status
3. Document blocker in metadata.json
4. Consider creating dependency track if needed

## Track Sizing Guidelines

### Right-Sized Tracks

Aim for tracks that:

- Complete in 1-5 days of work
- Have 2-4 phases
- Contain 8-20 tasks total
- Deliver a coherent, testable unit

### Too Large

Signs a track is too large:

- More than 5 phases
- More than 25 tasks
- Multiple unrelated features
- Estimated duration > 1 week

Solution: Split into multiple tracks with clear boundaries.

### Too Small

Signs a track is too small:

- Single phase with 1-2 tasks
- No meaningful verification needed
- Could be a sub-task of another track
- Less than a few hours of work

Solution: Combine with related work or handle as part of existing track.

## Common Track Patterns

### Feature Track Pattern

```
Phase 1: Foundation
- Data models
- Database migrations
- Basic API structure

Phase 2: Core Logic
- Business logic implementation
- Input validation
- Error handling

Phase 3: Integration
- UI integration
- API documentation
- End-to-end tests
```

### Bug Fix Track Pattern

```
Phase 1: Reproduction
- Write failing test capturing bug
- Document reproduction steps

Phase 2: Fix
- Implement fix
- Verify test passes
- Check for regressions

Phase 3: Verification
- Manual verification
- Update documentation if needed
```

### Refactor Track Pattern

```
Phase 1: Preparation
- Add characterization tests
- Document current behavior

Phase 2: Refactoring
- Apply changes incrementally
- Maintain green tests throughout

Phase 3: Cleanup
- Remove dead code
- Update documentation
```
