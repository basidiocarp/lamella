# Lamella Roadmap

This page is the Lamella-specific backlog. The workspace [ROADMAP.md](../../docs/workspace/ROADMAP.md) keeps the ecosystem sequencing and cross-repo priorities.

Lamella is past the "prove the build works" stage. The backlog now centers on packaging, validation, dependency handling, host parity, and keeping the distribution story aligned with the actual shape of the library.

## Recently Shipped

- Lamella now ships official Claude plugin packaging and local marketplace builds instead of a loose collection of source files. The Claude and Codex export paths are both part of the supported product surface.
- Packaging is manifest-driven across skills, agents, commands, hooks, and support resources. That gives the build a clearer source of truth and makes validation much more useful.
- Validation now covers manifests, cross-references, source files, and built output. The packaging story is far less guess-driven than the early versions.
- Repo-root marketplace metadata, hosted publishing support, and dependency-aware Claude installs are in place. Lamella can now act like a distribution layer, not just a content repo.
- The audit and naming pass is complete, and the remaining personal host-maintenance helpers were pushed out to Stipe. Lamella is carrying less boundary drift than it was before.

## Next

### Plugin layering migration

Lamella needs to execute the staged split in [plans/plugin-layering-migration.md](plans/plugin-layering-migration.md). The goal is to break oversized bundles into cleaner layers without breaking install compatibility for people already using the current package names.

### Dependency and install parity

Install behavior still needs to line up everywhere it matters: source validation, local install, and built output. This is the work that keeps packaging semantics from drifting apart again as the library changes.

### Wrapper-first CLI

The thin `./lamella` wrapper should stay the main user-facing surface for build, install, list, update, and Codex export flows. Users should not need to know the internal script layout to do routine packaging work.

### Claude and Codex parity

Lamella should keep tightening parity across manifests, exports, profiles, and docs. The right standard is one content model with host-specific packaging details, not two divergent product stories.

### Validation alignment

Source validators and post-build validators need to keep moving together. Packaging changes are safer when both layers describe the same rules and fail for the same reasons.

### Cortina and Stipe boundary cleanup

Lamella still carries a few responsibilities that belong elsewhere. The cleanup plan in [maintainers/tool-boundary-cleanup.md](maintainers/tool-boundary-cleanup.md) should keep pushing runtime lifecycle work toward Cortina and host-maintenance work toward Stipe.

## Later

### Prebuilt releases

Local builds should become optional for common installs. Prebuilt releases matter because the ecosystem is easier to adopt when Lamella does not require a full source checkout and local toolchain.

### Profile-based bundles

Curated operating modes and profile bundles are the natural next step after plugin layering settles down. They let Lamella distribute working combinations instead of only individual plugin parts.

### Release-channel semantics

Stable and snapshot content needs a clearer story. This belongs after install and validation semantics settle, because release channels are only useful if the underlying package behavior is predictable.

### Package health reporting

Quality scoring and stronger package health signals make sense once build, install, and validation semantics are stable enough that a health score would mean something real.

## Research

### Marketplace backend

Hosted distribution can go further than the current publishing path, but the open question is how much backend infrastructure Lamella should own versus how much should stay as static packaging and metadata.

### Offline bundles

Offline and air-gapped bundle formats are clearly useful for some environments. The design question is how to keep those formats simple without creating a second packaging system beside the online path.

### More host-agnostic package descriptors

Lamella may eventually need package descriptors that are less tied to today's hosts. That only moves up if future runtimes justify broader abstraction instead of thin export adapters.

## Not Planned

- Long-term ownership of runtime lifecycle capture: Cortina owns that boundary.
- Long-term ownership of host repair and personal setup helpers: Stipe owns machine maintenance and recovery flows.
