# Schema, Cluster, and Reporting

## Schema Validation

- validate rendered manifests against Kubernetes schemas
- treat CRD schema gaps separately from normal validation failures
- use CRD docs or local manifests when public schemas are unavailable

## Cluster Dry Run

- use server-side dry run when cluster access exists
- report access limitations instead of pretending the stage passed

## Reporting

Summarize:

- passed stages
- skipped stages and why
- concrete template fixes needed before deployment
