---
name: modal-serverless
description: "Runs Python code in the cloud with serverless containers, GPUs, and autoscaling."
origin: lamella
---

# Modal

Use this skill when deploying Python workloads to Modal.

## When to Use

- GPU-backed inference or training
- batch processing and pipelines
- scheduled jobs
- serverless APIs or FastAPI endpoints

## Core Workflow

1. define the image and dependencies
2. define functions and resource needs
3. add volumes, secrets, schedules, or endpoints as needed
4. validate scaling and cold-start assumptions against the workload

## References

- [references/getting-started.md](references/getting-started.md)
- [references/images.md](references/images.md)
- [references/functions.md](references/functions.md)
- [references/gpu.md](references/gpu.md)
- [references/resources.md](references/resources.md)
- [references/scaling.md](references/scaling.md)
- [references/volumes.md](references/volumes.md)
- [references/secrets.md](references/secrets.md)
- [references/web-endpoints.md](references/web-endpoints.md)
- [references/scheduled-jobs.md](references/scheduled-jobs.md)
