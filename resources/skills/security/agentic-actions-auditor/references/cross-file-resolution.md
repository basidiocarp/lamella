# Cross-File Resolution: Composite Actions and Reusable Workflows

Use this reference when an AI action may be hidden behind a local composite
action or a reusable workflow.

## What to Resolve

Treat `uses:` values as one of:
- local composite action
- local reusable workflow
- remote reusable workflow
- docker image or remote action that is out of scope for this pass

The point is to determine whether the caller is hiding an analyzable workflow
step behind another file boundary.

## Resolution Rule

Follow at most one level deep:
- resolve the referenced local or reusable workflow file
- inspect its steps for AI action usage
- trace input flow into the AI prompt or configuration
- stop there and log deeper nesting as unresolved

This catches the common real-world case without turning the audit into recursive
workflow crawling.

## What to Trace

For resolved files, map:
- caller `with:` values
- called `inputs.*`
- the eventual AI prompt or action fields

This makes prompt-injection and tainted-input paths visible across file
boundaries.

## Unresolved References

If a reference cannot be resolved:
- log the source location
- say why it could not be resolved
- continue the rest of the analysis

Unresolved references are findings context, not a reason to stop the audit.
