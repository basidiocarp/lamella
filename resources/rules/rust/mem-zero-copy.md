# mem-zero-copy

> Use zero-copy patterns with slices and `Bytes`

Borrow or share backing storage when copying adds cost without value.

## Prefer

- slices, `Cow`, or shared byte buffers when data can outlive the consumer safely
- parsing and framing APIs that avoid needless ownership transfer
- owned copies when lifetime complexity would dominate the design

## Avoid

- cloning payloads just because the first API was easiest to write
- zero-copy designs that make lifetime reasoning fragile
- borrowing data past the true lifetime of the backing storage

## See Also

- [own-cow-conditional](./own-cow-conditional.md) - Borrow until ownership is needed
- [mem-boxed-slice](./mem-boxed-slice.md) - Own fixed-size data compactly when borrowing is not enough
