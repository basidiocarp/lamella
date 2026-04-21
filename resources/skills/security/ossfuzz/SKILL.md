---
name: ossfuzz
description: "Sets up OSS-Fuzz for continuous fuzzing of open source projects."
origin: lamella
---

# OSS-Fuzz

Use OSS-Fuzz when the project is open source, important enough to justify continuous fuzzing, and you want managed build, crash, and coverage infrastructure.

## When to Use

- Enrolling an eligible open-source project in OSS-Fuzz
- Reproducing OSS-Fuzz crashes locally
- Building or validating an OSS-Fuzz `project.yaml`, `Dockerfile`, and `build.sh`
- Running coverage or sanitizer builds through `infra/helper.py`

## Quick Reference

```bash
git clone https://github.com/google/oss-fuzz
cd oss-fuzz
python3 infra/helper.py build_image --pull <project>
python3 infra/helper.py build_fuzzers --sanitizer=address <project>
python3 infra/helper.py run_fuzzer <project> <harness>
python3 infra/helper.py coverage <project>
```

## Core Workflow

1. Build the project image.
2. Build fuzzers with the target sanitizer.
3. Run one harness locally and confirm corpus loading.
4. Add coverage mode only after the basic run works.
5. For new projects, prepare `project.yaml`, `Dockerfile`, and `build.sh`.

## What Good OSS-Fuzz Integration Looks Like

- `project.yaml` has accurate metadata and supported engines
- `Dockerfile` installs only the build dependencies needed by the harnesses
- `build.sh` emits fuzzers, seed corpora, and dictionaries into `$OUT`
- Crashes reproduce locally through `infra/helper.py run_fuzzer`

## References

- [references/libfuzzer-examples.md](references/libfuzzer-examples.md)
- [references/coverage-advanced-usage.md](references/coverage-advanced-usage.md)
- [references/tool-specific.md](references/tool-specific.md)
