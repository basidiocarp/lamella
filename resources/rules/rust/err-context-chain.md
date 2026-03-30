# err-context-chain

> Add context as errors cross important boundaries

Add context when an error moves through a boundary that changes what the
failure means to the caller.

## Prefer

- context on file paths, URLs, ids, and operation names
- one clear layer of context per meaningful boundary
- preserving the original source error beneath that context

## Avoid

- repeating the same context string at every call site
- adding generic noise like “operation failed” with no useful detail
- swallowing the underlying cause while adding context

## See Also

- [err-source-chain](./err-source-chain.md) - Preserve causal chains
- [err-anyhow-app](./err-anyhow-app.md) - Add context in app code
