# Lamella Roadmap

Current documented shape:

- **52 plugins**
- **286 skills**
- official Claude plugin builds
- Codex skill exports
- marketplace packaging and hosted distribution support

Lamella is no longer in the “prove the build works” stage. The next work is
about keeping packaging, validation, dependency resolution, and host parity
reliable as the library continues to evolve.

## Shipped

- Official Claude plugin packaging with `.claude-plugin/plugin.json`.
- Local Claude marketplace builds under `dist/claude/`.
- Codex export pipeline under `dist/codex/`.
- Manifest-driven packaging for skills, agents, commands, hooks, and support
  resources.
- Validation coverage for manifests, cross-references, source files, and built
  output.
- Repo-root marketplace metadata and hosted marketplace publishing support.
- Dependency-aware Claude install flow through the wrapper command surface.
- The Lamella audit and naming pass is complete, with the docs now aligned to
  the current 52-plugin layered product story.
- The remaining Claude host-maintenance scripts moved to `stipe`, and Lamella
  dropped the leftover personal config-sync and stale release helper scripts.

## Next

- Execute the staged plugin-layering plan in
  [plans/plugin-layering-migration.md](plans/plugin-layering-migration.md) so
  oversized plugin bundles can split without breaking install compatibility.
- Finish dependency resolution and installation behavior anywhere it still
  diverges between local source validation, local install, and built outputs.
- Keep the thin `./lamella` wrapper as the primary user-facing interface for:
  - build
  - install
  - list
  - update
  - Codex export flows
- Improve Claude/Codex parity in manifests, exports, profiles, and docs.
- Keep source validators and post-build validators aligned as packaging changes
  continue.
- Hand off lifecycle and capture-hook ownership to Cortina wherever Lamella is
  still carrying runtime responsibilities.
- Execute the per-file cleanup plan in [tool-boundary-cleanup.md](tool-boundary-cleanup.md)
  so Lamella stops carrying host-maintenance and miscellaneous utility scripts
  that no longer match its packaging boundary.

## Later

- Prebuilt releases so local builds become optional for common installs.
- Profile-based bundles and curated operating modes.
- Better release-channel semantics for stable vs. snapshot content.
- Quality scoring and more explicit package health reporting once install and
  validation semantics settle down.

## Research

- Marketplace backend and richer distribution surfaces.
- Offline and air-gapped bundle formats.
- More host-agnostic package descriptors if future hosts justify them.

## Notes

The Lamella audit pass is no longer the blocker. The next risk is letting
packaging semantics drift again while content and manifests continue to evolve.
The right response is to keep the package story, wrapper commands, and
validation behavior aligned with the actual repo state.
