# Observation Format

Use this structure for each new record:

```markdown
## OBS-NNN - [Short descriptive title]

**Observed:** YYYY-MM-DD
**Affects:** [component, component]
**Status:** Open
**Priority:** [High | Medium | Low]

### Observation

[2-4 sentences describing the gap. State what happened and what should have
happened instead.]

### Concrete Example

[Paste or paraphrase the specific output, interaction, or situation from the
raw notes. Omit this section if the source note does not contain one.]

### Possible Solutions

[List only solutions already present in the raw notes. Omit this section if the
source note does not suggest any.]

### Open Questions

[Questions that must be answered before implementation starts. Omit if the path
is already clear.]

### Next Action

[One concrete first step. Usually a plan, targeted read, or owner handoff.]
```

Add this header once per daily file:

```markdown
# Observations - YYYY-MM-DD

Formatted from raw notes in `.notes/intake/`. Each entry is a structured OBS-NNN
record ready for planning.
```

## Ownership Hints

Use the note content to infer ownership. When the boundary is real, list more than one component.

| Component | Typical ownership |
| --- | --- |
| `canopy` | multi-agent coordination, handoffs, task ownership |
| `cortina` | session hooks, enforcement gates, event capture |
| `hyphae` | episodic memory, recall, knowledge graph |
| `rhizome` | code intelligence, tree-sitter, LSP |
| `mycelium` | CLI token compression, output filtering |
| `lamella` | skills, agents, slash commands, plugin packaging |
| `stipe` | install, repair, doctor, bootstrap |
| `cap` | dashboard, analytics, memory browsing |
| `spore` | shared Rust primitives, discovery, JSON-RPC |
| `volva` | runtime and host layer, OAuth, CLI compatibility |

## Priority Hints

- `High`: blocks work, causes incorrect behavior, or loses data
- `Medium`: creates friction, misroutes work, or needs a human workaround
- `Low`: polish, nudging, or follow-up cleanup

Default to `Medium` when the source note does not justify a stronger claim.

## Edge Cases

- Skip notes that are too short to identify a real observation.
- Skip notes already written in OBS format.
- De-duplicate against existing formatted observations when the note is clearly the same issue.
- One raw file can produce multiple observations; do not stop after the first.
