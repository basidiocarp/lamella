# Profiling and Maintenance

Use this reference after a query change is drafted.

## Monitoring Loop

1. Capture baseline runtime and plan.
2. Apply the query or index change.
3. Re-run the same workload.
4. Confirm latency, plan shape, and write-side cost all improved.

## Maintenance Checks

- Refresh statistics if estimates are stale.
- Revisit index bloat and overlapping indexes.
- Check whether the new index hurts writes more than it helps reads.
