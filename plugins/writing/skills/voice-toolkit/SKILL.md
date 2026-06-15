---
name: voice-toolkit
description: "Extracts voice profiles from sample text and transforms voice dictation into structured prompts."
origin: lamella
---

# Voice Toolkit

Use this skill when either capturing a writing voice or refining dictated input into a structured prompt.

## Modes

| Mode | Use when |
|------|----------|
| Voice capture | someone says “write like this” or wants a reusable voice profile |
| Voice refine | dictated or rambling input needs compression and structure |

## Core Workflow

1. decide whether the task is voice capture or refinement
2. for capture, extract stable traits, channel guidance, and exemplars
3. for refinement, dedupe, extract, structure, and compress
4. preserve intent and constraints while removing filler

## References

- [references/extraction-templates.md](references/extraction-templates.md)
- [references/analysis-dimensions.md](references/analysis-dimensions.md)
- [references/example-profiles.md](references/example-profiles.md)
- [assets/voice-profile-template.yaml](assets/voice-profile-template.yaml)
- [examples/before-after.md](examples/before-after.md)
