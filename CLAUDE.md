# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Lamella is the packaging and build system for shared coding-agent content. It turns Markdown resources, manifests, hooks, and subagents into Claude plugins and Codex exports. Lamella owns content packaging and validation; it does not own runtime execution, memory, or lifecycle capture.

---

## Operating Model

- Do not treat Lamella as a runtime. It builds artifacts that other tools load later.
- Do not execute skills or agents. Claude Code and Codex interpret the output.
- Do not assume install or reinstall happens automatically. Those flows stay explicit.
- Do not confuse structure validation with prompt-quality proof. Validation checks shape and references, not field effectiveness.
- Do not move setup or runtime capture into Lamella. Packaging hooks is not the same as owning setup or lifecycle behavior.

---

## Failure Modes

- **Validation failure**: `make validate` stops with the specific validator output that failed.
- **Missing manifest resources**: the build fails with the unresolved paths.
- **Broken cross-reference**: cross-reference validation fails and points at the bad link.
- **Frontmatter parse error**: the validator reports the parse issue instead of building around it.
- **Stale build output**: rebuilding after a clean fixes old generated artifacts.

---

## State Locations

| What | Path |
|------|------|
| Source resources | `resources/` |
| Manifests | `manifests/` |
| Generated output | `dist/` |
| Installed Claude plugins | `~/.claude/plugins/` |

---

## Build & Test Commands

```bash
make validate
make build-marketplace
make build PLUGIN=core

./lamella build-codex
./lamella install-codex --all
./lamella install core python typescript
```

---

## Architecture

```text
lamella/
├── resources/   source skills, commands, hooks, rules, subagents, templates
├── manifests/   Claude and Codex packaging metadata
├── builders/    build and export scripts
├── scripts/     validators and packaging helpers
├── tools/       support tooling such as skills-ref
├── docs/        authoring and reference docs
└── dist/        generated output
```

- **resources/**: the source of truth for packaged content.
- **manifests/**: plugin and export boundaries.
- **scripts/ci/**: structural validation.
- **builders/** and `./lamella`: the build pipeline and wrapper entry point.

---

## Key Design Decisions

- **One content tree, multiple outputs**: keeps Claude and Codex content from drifting apart.
- **Manifest-driven packaging**: makes plugin boundaries explicit instead of inferred from the filesystem.
- **Validation before build**: catches broken references and bad metadata early.
- **Authoring docs in-repo**: the build system and the writing rules live together.

---

## Key Files

| File | Purpose |
|------|---------|
| `docs/authoring/skills-spec.md` | canonical skill format rules |
| `docs/authoring/best-practices.md` | baseline authoring guidance |
| `docs/authoring/agent-style-guide.md` | agent-specific structure and voice rules |
| `manifests/claude/` | Claude plugin manifests |
| `scripts/ci/` | validation scripts |

---

## Communication Contracts

Lamella packages content and generated artifacts, but it is not a runtime transport boundary in the same way as Hyphae, Mycelium, or Rhizome. Most breaking changes here are packaging or build-shape changes rather than cross-tool wire-contract changes.

---

## Testing Strategy

- `make validate` is the primary gate; run it before treating a content or manifest change as done.
- Use the authoring docs before adding new skills, agents, commands, or hooks.
- Keep `SKILL.md` files short and push depth into adjacent references.
- Treat manifest changes as packaging changes, not just documentation edits.
