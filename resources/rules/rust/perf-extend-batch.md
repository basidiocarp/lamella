# perf-extend-batch

> Use extend for batch insertions

Use batch insertion APIs when many items are appended at once.

## Prefer

- `extend` from iterators or slices instead of repeated single pushes when batching
- preallocation when the batch size is known
- clear ownership boundaries when extending from borrowed sources

## Avoid

- repeated individual insertions in obvious batch paths
- extending one item at a time just to mirror source iteration structure
- complexity beyond the actual performance win

## See Also

- [mem-with-capacity](./mem-with-capacity.md) - Preallocate before extending
- [perf-entry-api](./perf-entry-api.md) - Use single-pass map updates
