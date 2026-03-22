---
name: voice-toolkit
description: Extract voice profiles from sample text and transform voice dictation into structured prompts. Use when capturing writing style, creating voice documentation, or cleaning up dictated input.
---

# Voice Toolkit

## Contents

- [When to Use](#when-to-use)
- [Part 1: Voice Capture](#part-1-voice-capture)
- [Part 2: Voice Refine](#part-2-voice-refine)
- [References](#references)

Extract and encode writing voices into reusable profiles, and transform raw voice dictation into structured, token-efficient prompts.

## When to Use

**Voice Capture:**
- A user provides sample text and asks "write like this"
- Creating a voice profile from existing content
- Documenting a brand voice for consistency
- Capturing an author's style for future reference

**Voice Refine:**
- Input from voice dictation (Wispr Flow, Superwhisper, macOS Dictation)
- Verbose text >150 words with filler, repetitions, or tangents
- Natural speech patterns that need structure

---

## Part 1: Voice Capture

Extract writing voice from sample text into reusable profiles.

### Voice Profile Structure

A complete profile has three layers. See [assets/voice-profile-template.yaml](assets/voice-profile-template.yaml) for the full template.

#### Layer 1: Immutable Traits

```yaml
traits:
  - direct           # vs. indirect, circumspect
  - conversational   # vs. formal, academic
  - technically-informed  # level of assumed expertise

register: informal   # formal / semiformal / informal

prohibited:
  - "synergy"
  - passive voice in openings
  - exclamation marks (except in quotes)
```

#### Layer 2: Channel Guidance

```yaml
channels:
  blog:
    length: "1000-2000 words"
    personality: "full"
    storytelling: "encouraged"
  newsletter:
    length: "300-500 words"
    personality: "high - direct address okay"
  social:
    length: "280 chars or thread"
    personality: "punchy, hooks required"
  documentation:
    length: "as needed"
    personality: "minimal"
    storytelling: "none - clarity first"
```

#### Layer 3: Example Library

```yaml
exemplars:
  - path: "samples/great-opening.md"
    why: "Concrete example first, theory second"
    demonstrates: ["hook", "pacing"]
  - path: "samples/transition.md"
    why: "Invisible transition technique"
    demonstrates: ["flow", "structure"]
```

### Extraction Process

1. **Collect Samples** — Minimum 3 samples (ideally 5-10), at least 2,000 words total, different topics same author/brand
2. **Analyze Dimensions** — See [references/analysis-dimensions.md](references/analysis-dimensions.md)
   - Vocabulary: complexity, formality, jargon level, signature words
   - Sentences: average length, variety, structure ratios, fragment usage
   - Paragraphs: length, opening/closing patterns
   - Rhythm: pacing, punctuation style, white space density
   - Emotion: tone, distance (I/you vs. one/they), stakes level
3. **Document Patterns** — For each dimension: observed pattern, concrete example, counter-example
4. **Create Profile** — Output to `.claude/voice-profiles/[name].yaml`

### Quick Extraction

For rapid voice capture:

```markdown
## Quick Profile: [Name]
**Based on**: [X] samples totaling [Y] words

### Core Traits
- [Trait 1] - [Trait 2] - [Trait 3]
// ... (12 lines trimmed)
### Quick Examples
Good: "[example that nails the voice]"
Bad: "[example that would violate it]"
```

### Common Challenges

| Challenge | Solution |
|-----------|----------|
| Too few samples | Ask for more content or analyze published work |
| Inconsistent source | Document variation or focus on most recent/best |
| Style vs. voice confusion | Analyze across topics — constants = voice |
| Unconscious patterns | Compare to other writers — differences = key |

### Profile Quality Checklist
- [ ] All three layers populated
- [ ] At least 3 exemplars documented
- [ ] Prohibited patterns explicit
- [ ] Channel variations noted
- [ ] A test passage can be evaluated against it

---

## Part 2: Voice Refine

Transform verbose voice dictation into structured, token-efficient prompts.

### Transformation Pipeline

```
1. DEDUPE    → Remove repetitions and filler words
2. EXTRACT   → Identify core requirements and constraints
3. STRUCTURE → Organize into standard sections
4. COMPRESS  → Reduce to ~30% of original while preserving intent
```

### Output Format

```markdown
## Context
[Project context, existing stack, relevant files]

## Objective
[Single sentence: what needs to be built/changed]

## Constraints
- [Constraint 1]
- [Constraint 2]

## Expected Output
[Expected deliverables: files, format, tests]
```

### What Gets Removed
- Filler words: "um", "like", "you know", "basically"
- Repetitions: same concept stated multiple ways
- Tangents: off-topic thoughts
- Hedging: "maybe", "I think", "probably" (unless relevant)
- Politeness padding: "please", "could you", "I'd like"

### What Gets Preserved
- Technical requirements
- Constraints and limitations
- Context about existing code
- Expected output format
- Edge cases mentioned
- Business logic rules

### Compression Metrics

| Metric | Target |
|--------|--------|
| Token reduction | 60-70% |
| Information retention | >95% |
| Structure clarity | High |

### Voice Tool Integration

| Tool | Workflow |
|------|----------|
| Wispr Flow | `Cmd+Shift+Space` → dictate → paste → refine |
| Superwhisper | Record with hotkey → text appears → refine |
| macOS Dictation | `Fn Fn` → speak → refine |

## References

- [references/extraction-templates.md](references/extraction-templates.md) - Templates for structured extraction
- [references/analysis-dimensions.md](references/analysis-dimensions.md) - All dimensions to analyze
- [references/example-profiles.md](references/example-profiles.md) - Sample voice profiles
- [assets/voice-profile-template.yaml](assets/voice-profile-template.yaml) - The YAML template
- [examples/before-after.md](examples/before-after.md) - Voice refine transformation examples
