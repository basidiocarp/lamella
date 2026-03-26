---
name: latex-posters
description: >-
  Creates professional research posters in LaTeX using beamerposter, tikzposter, or baposter. Use when creating research posters for conferences, academic presentations, or scientific communication in LaTeX format.
---
# LaTeX Research Posters

## Contents

- [Overview](#overview)
- [When to Use This Skill](#when-to-use-this-skill)
- [Quick Start Workflow](#quick-start-workflow)
- [Key Rules Summary](#key-rules-summary)
- [Minimal Template](#minimal-template)
- [Reference Documents](#reference-documents)

---

## Overview

Research posters are a critical medium for scientific communication at conferences, symposia, and academic events. This skill provides comprehensive guidance for creating professional, visually appealing research posters using LaTeX packages. Generate publication-quality posters with proper layout, typography, color schemes, and visual hierarchy.

---

## When to Use This Skill

This skill should be used when:
- Creating research posters for conferences, symposia, or poster sessions
- Designing academic posters for university events or thesis defenses
- Preparing visual summaries of research for public engagement
- Converting scientific papers into poster format
- Creating template posters for research groups or departments
- Designing posters that comply with specific conference size requirements (A0, A1, 36×48", etc.)
- Building posters with complex multi-column layouts
- Integrating figures, tables, equations, and citations in poster format

---

## Quick Start Workflow

**STANDARD WORKFLOW: Generate AI visuals FIRST, then assemble in LaTeX.**

```bash
# 1. Create figures directory
mkdir -p figures

# 2. Generate SIMPLE AI graphics (3-4 elements max each)


# 3. Review at 25% zoom - all text readable? → Proceed
#    Text too small? → Regenerate with larger fonts

# 4. Compile LaTeX poster
pdflatex poster.tex

# 5. Check for overflow
grep "Overfull" poster.log
```

**Target: 60-70% AI-generated visuals, 30-40% text. Max 300-800 words total.**

---

## Key Rules Summary

### AI Graphics - HARD LIMITS

| Rule | Limit |
|------|-------|
| Elements per graphic | **3-4 maximum** |
| Words per graphic | **10 maximum** |
| White space | **50% minimum** |
| Key numbers | **120pt+ font** |
| Labels | **80pt+ font** |

### Poster Content Limits

| Element | Limit |
|---------|-------|
| Sections | **5-6 maximum for A0** |
| Total words | **300-800** |
| Words per section | **50-100** |

### Prompt Requirements (ALL mandatory)

```
Every AI graphic prompt MUST include:
1. "POSTER FORMAT for A0"
2. "ULTRA-SIMPLE" or "ONLY X elements"
3. "GIANT (120pt+)" for numbers
4. "60% white space"
5. "readable from 10-12 feet"
```

### Patterns That FAIL → Fix

| Bad Pattern | Fix |
|-------------|-----|
| 7-stage workflow | 3 mega-stages only |
| 5+ comparison bars | 2-3 bars max |
| Multiple case studies | 1 case per graphic |
| Timeline 2015-2024 | Only 3 key years |
| Architecture all layers | 3 components max |

---

## Minimal Template

### tikzposter (recommended)

```latex
\documentclass[25pt, a0paper, portrait, margin=25mm]{tikzposter}

\title{Your Research Title Here}
\author{Author Names}
\institute{Institution}
// ... (33 lines trimmed)
\end{columns}

\end{document}
```

### Package Comparison

| Package | Best For |
|---------|----------|
| **beamerposter** | Traditional academic, institutional branding |
| **tikzposter** | Modern, colorful, flexible designs |
| **baposter** | Multi-column, consistent spacing |

### Compilation

```bash
pdflatex poster.tex   # Basic
lualatex poster.tex   # Better fonts
xelatex poster.tex    # Unicode support
```

---

## Reference Documents

Detailed guidance is available in the `references/` folder:

| Document | Contents |
|----------|----------|
| [references/ai-visual-generation.md](references/ai-visual-generation.md) | Critical rules for AI graphics, overflow prevention, font requirements, pre-generation checklist |
| [references/generation-workflow.md](references/generation-workflow.md) | Step-by-step generation process, example commands, post-generation review, assembly |
| [references/core-capabilities.md](references/core-capabilities.md) | LaTeX packages, templates, layout, typography, colors, QR codes, compilation |
| [references/pdf-review-checklist.md](references/pdf-review-checklist.md) | Complete PDF review process, overflow checking, quality validation |
| [references/content-patterns.md](references/content-patterns.md) | Content organization by research type, accessibility, presentation tips |
| [references/workflow-stages.md](references/workflow-stages.md) | 6-stage creation workflow, skill integrations |
| [references/troubleshooting.md](references/troubleshooting.md) | Common pitfalls, fixes, package installation, scripts |

---

## Quick Troubleshooting

**Problem: Text cut off at edges**
```bash
grep "Overfull" poster.log  # Any matches = overflow
# Fix: Reduce content, use width=0.85\linewidth, increase margins
```

**Problem: AI graphics have tiny text**
```bash
# Regenerate with explicit sizes:
"GIANT (150pt+)" "HUGE BOLD" "readable from 12 feet"
```

**Problem: Too cluttered**
```bash
# Reduce elements:
"ONLY 3 elements" "60% white space" "ULTRA-SIMPLE"
```

**Problem: PDF file issues**
```bash
pdfinfo poster.pdf | grep "Page size"  # Verify dimensions
pdffonts poster.pdf                     # Check font embedding
```

---

## Integration with Other Skills

- **content-writer**: Shape poster copy from research notes, abstracts, or source material
- **writing-voice**: Tighten the prose so headings and callouts stay concise and readable
- **Available diagram or image-generation tooling**: Create visual elements before assembling the poster

**Recommended**: Generate visuals before creating the LaTeX poster.
### Additional Resources


| File | Path |
|------|------|
| [Baposter Template](assets/baposter_template.tex) | `assets/baposter_template.tex` |
| [Beamerposter Template](assets/beamerposter_template.tex) | `assets/beamerposter_template.tex` |
| [Poster Quality Checklist](assets/poster_quality_checklist.md) | `assets/poster_quality_checklist.md` |
| [Tikzposter Template](assets/tikzposter_template.tex) | `assets/tikzposter_template.tex` |
- [Review Poster](scripts/review_poster.sh)
