# Modal Example Patterns

Use this page as the routing layer for common Modal workload shapes.

## Load Order

| Need | Reference |
| --- | --- |
| model serving, GPU use, and stateful services | `inference-and-gpu.md` |
| batch processing, ETL, and data pipelines | `batch-and-pipelines.md` |
| web endpoints, schedules, and operational patterns | `apis-and-schedules.md` |

## Core Rules

- keep images and resource requests close to the workload
- use classes for stateful model loading
- use volumes for persistent datasets, not baked images
- batch similar work instead of spawning tiny remote calls
