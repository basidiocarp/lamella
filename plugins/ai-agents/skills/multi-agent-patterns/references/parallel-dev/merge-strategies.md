# Integration and Merge Strategies

## Integration Patterns

Direct Integration: All commit to the same branch. Use for small teams (2-3) with strict file ownership.

Sub-Branch Integration: Each implementer on a sub-branch; lead merges sequentially following the dependency graph. Use for larger teams (4+) or overlapping concerns.

Trunk-Based with Feature Flags: All commit to main behind a flag. Use for CI/CD environments and short-lived features.

## Verification Checklist

After all implementers complete:

1. Build/compile passes
2. Type checking passes
3. Linting passes
4. Unit tests pass
5. Integration tests pass
6. Interface contracts match implementations

## Conflict Resolution

- Prevention: Strict file ownership eliminates most conflicts. Interface contracts define boundaries before implementation. Shared type files owned by lead, modified sequentially.
- Detection: Git merge reports, TypeScript/lint errors, test failures.
- Resolution: Contract wins over code. Lead arbitrates disputes. Tests decide ambiguous cases.
