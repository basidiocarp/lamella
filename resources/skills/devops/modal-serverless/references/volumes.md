# Modal Volumes

Use Modal Volumes for shared file state across Modal functions, especially for
write-once or infrequently updated artifacts.

## Good Fits

- model weights
- checkpoints
- shared datasets
- cached generated artifacts

Volumes are usually better for durable file state than trying to rebuild the
same data in every container.

## Core Operations

- create or look up a volume
- mount it into a function
- write or read files
- `commit()` after writes
- `reload()` when another container may have changed the volume

The critical rule is visibility: writes are not guaranteed visible elsewhere
until committed.

## Upload and Download

Typical patterns:
- batch upload for many files
- CLI access for manual inspection or transfer
- code-based streaming or file reads for runtime use

Use batch uploads when seeding a volume with many files.

## Performance Guidance

Choose the volume mode that matches the workload:
- simpler, smaller shared datasets
- many-file or higher-concurrency workloads
- larger artifacts such as model or checkpoint storage

Do not assume the same performance profile for every volume version or workload
shape.

## Operational Rules

- commit after meaningful writes
- reload before reading data that another container may have updated
- keep concurrent-writer assumptions explicit
- use ephemeral volumes only when the data is intentionally temporary

Volumes work best when the read/write lifecycle is deliberate rather than
implicit.
