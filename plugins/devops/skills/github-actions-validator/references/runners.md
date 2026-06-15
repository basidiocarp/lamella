# GitHub-Hosted Runners Reference

Use this reference to choose a runner label that matches platform, architecture,
and cost constraints.

## Standard Families

Common labels:
- Ubuntu: `ubuntu-latest`, `ubuntu-24.04`, `ubuntu-22.04`
- Windows: `windows-latest`, `windows-2025`, `windows-2022`
- macOS: `macos-latest`, `macos-15`, `macos-14`

Prefer explicit version labels when runner stability matters more than automatic
upgrades.

## Architecture Considerations

Runner choice is not only OS choice:
- Apple Silicon vs Intel on macOS
- ARM64 vs x86_64 on Linux and Windows
- larger runners vs standard runners

Check architecture assumptions before:
- native builds
- Docker or VM tooling
- emulator or simulator jobs
- language toolchains with platform-specific binaries

## Special Runners

Use specialized runners only when the workload justifies them:
- GPU runners for ML or CUDA work
- larger macOS runners for expensive iOS or macOS builds
- ARM64 runners for native multi-arch validation

## Selection Rules

- avoid retired or deprecated labels
- do not assume `*-latest` means the same environment forever
- validate marketplace and third-party actions against the chosen architecture
- document non-default runner choices in the workflow

## Practical Default

Pick the cheapest stable runner that matches the workload. Upgrade only when the
job actually needs a different architecture, GPU, or larger machine size.
