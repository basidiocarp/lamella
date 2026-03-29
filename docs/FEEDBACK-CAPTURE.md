# Feedback Capture Hooks

The Lamella plugin now ships a Cortina-first capture path for Claude lifecycle hooks. Lamella still packages the hook catalog and related docs, but the shared runtime for lifecycle capture lives in Cortina rather than the older standalone JavaScript capture scripts.

See the [ecosystem LLM Training Guide](https://github.com/basidiocarp/.github/blob/main/docs/LLM-TRAINING.md) for how this data feeds into fine-tuning.

## Data Flow

```mermaid
flowchart TD
    subgraph Agent["Agent Session"]
        Bash["Bash tool call"]
        Write["Write/Edit tool call"]
        Build["Build command"]
    end

    subgraph Hooks["Shared Runtime"]
        CPT["cortina adapter claude-code post-tool-use"]
        CCH["capture-code-changes.js (legacy/inactive)"]
    end

    subgraph Hyphae["Hyphae Memory Store"]
        EA["errors/active"]
        ER["errors/resolved"]
        CO["corrections"]
        TF["tests/failed"]
        TR["tests/resolved"]
    end

    subgraph Output["Downstream"]
        Lessons["hyphae_extract_lessons"]
        Training["Training Data Export"]
        Cap["Cap Dashboard"]
    end

    Bash --> CPT
    Write --> CPT
    Write --> CCH
    Build --> CCH

    CPT --> EA
    CPT --> ER
    CPT --> CO
    CPT --> TF
    CPT --> TR

    EA --> Lessons
    ER --> Lessons
    CO --> Lessons
    TF --> Lessons
    TR --> Lessons

    ER --> Training
    CO --> Training
    TR --> Training

    EA --> Cap
    ER --> Cap
    CO --> Cap

    style Agent fill:#505f79,stroke:#344563,color:#fff
    style Hooks fill:#00b8d9,stroke:#0095b3,color:#fff
    style Hyphae fill:#36b37e,stroke:#1f8a5a,color:#fff
    style Output fill:#6554c0,stroke:#403294,color:#fff
```

## Hook Details

### Cortina PostToolUse Runtime

Watches Bash, Edit, Write, and MultiEdit results through `cortina adapter claude-code post-tool-use`. Cortina normalizes the host envelope, applies capture policy, dedupes repeated outcomes, and stores structured lifecycle signals in Hyphae or Rhizome.

**What it stores:**
- `errors/active` — command and error output (medium importance)
- `errors/resolved` — command, original error, and successful output (high importance)
- `corrections` — file path, original change, correction (high importance)
- validation outcomes for successful build or test commands
- export and ingest outcomes for pending code or document batches

**Training value:** Error/resolution pairs are natural SFT training data. "Given this error, here's the fix."

```mermaid
sequenceDiagram
    participant A as Agent
    participant H as Cortina
    participant DB as Hyphae

    A->>H: Write file.rs (version 1)
    H->>H: Track file edit in temp state
    A->>H: Edit file.rs (version 2)
    H->>H: Detect self-correction
    H->>DB: Store correction (v1 → v2)
    Note over DB: topic: corrections<br/>importance: high
```

### capture-code-changes.js

Tracks file edits across a session. Triggers two actions:
1. After 5+ code file edits and a successful build → `rhizome export` (code graph update)
2. After 3+ document file edits → `hyphae ingest-file` for each (RAG re-indexing)

**What it triggers (not stores):**
- Rhizome code graph export (keeps knowledge graphs current)
- Hyphae document ingestion (keeps RAG index current)

## Error Observability

All hooks write failures to `/tmp/hyphae-hook-errors.log` via the `logHookError()` utility. The log is capped at 100 lines. Cap's Status page reads this log and shows hook health.

If hooks silently fail (e.g., Hyphae binary not found), check:

```bash
cat /tmp/hyphae-hook-errors.log
```

## Installation

Hooks are installed automatically by Lamella or Stipe. The shared Claude catalog now registers `cortina adapter claude-code post-tool-use` for the main lifecycle capture path and keeps the remaining Lamella hooks for packaging, evaluation, and local workflow behavior.

To verify installation:

```bash
cat ~/.claude/settings.json | grep -A3 "cortina adapter claude-code post-tool-use"
```

## Related

- [Hyphae: Training Data](https://github.com/basidiocarp/hyphae/blob/main/docs/TRAINING-DATA.md) — how captured data maps to training formats
- [Hyphae: Feedback Signals](https://github.com/basidiocarp/hyphae#feedback-signals) — what topics store what
- [Mycelium: Ecosystem Setup](https://github.com/basidiocarp/mycelium/blob/main/docs/ECOSYSTEM-SETUP.md) — how hooks get installed
- [Cap: Sessions & Lessons](https://github.com/basidiocarp/cap/blob/main/docs/GETTING-STARTED.md) — viewing captured data in the dashboard
