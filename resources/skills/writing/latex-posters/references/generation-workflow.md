# AI Visual Generation Workflow

This document covers the step-by-step process for generating AI visuals for LaTeX posters.

## Step 2: Generate Each Element

**⚠️ CRITICAL: Review pre-generation checklist before proceeding.**

Use the appropriate tool for each element type:

### For Schematics and Diagrams (scientific-schematics)

```bash
# Create figures directory
mkdir -p figures

# Drug discovery workflow - HIGH-LEVEL ONLY, 3 stages
# BAD: "Stage 1: Target ID, Stage 2: Molecular Synthesis, Stage 3: Virtual Screening, Stage 4: AI Lead Opt..."
// ... (14 lines trimmed)
python scripts/generate_schematic.py "POSTER FORMAT for A0. ONE case study: Large logo + '18 MONTHS' (150pt bold) + 'to discovery' (60pt). 3 elements total. 60% white space. Readable from 12 feet." -o figures/case1.png

# If you need 3 cases → make 3 separate simple graphics (not one complex graphic)
```

### For Stylized Blocks and Graphics (Nano Banana Pro)

```bash
# Title block - SIMPLE
python scripts/generate_schematic.py "POSTER FORMAT for A0. Title block: 'ML FOR DRUG DISCOVERY' in HUGE bold text (120pt+). Dark blue background. ONE subtle icon. NO other text. 40% white space. Readable from 15 feet." -o figures/title_block.png

# Introduction visual - SIMPLE, 3 elements only
python scripts/generate_schematic.py "POSTER FORMAT for A0. SIMPLE problem visual with ONLY 3 icons: drug icon, arrow, target icon. ONE label per icon (80pt+). 50% white space. NO detailed text. Readable from 8 feet." -o figures/intro_visual.png

# Conclusion/summary - ONLY 3 items, GIANT numbers
python scripts/generate_schematic.py "POSTER FORMAT for A0. KEY FINDINGS with EXACTLY 3 cards only. Card 1: '95%' (150pt font) with 'ACCURACY' (60pt). Card 2: '2X' (150pt) with 'FASTER' (60pt). Card 3: checkmark icon with 'READY' (60pt). 50% white space. NO other text. Readable from 10 feet." -o figures/conclusions_graphic.png

# Background visual - SIMPLE, 3 icons only
python scripts/generate_schematic.py "POSTER FORMAT for A0. SIMPLE visual with ONLY 3 large icons in a row: problem icon → challenge icon → impact icon. ONE word label each (80pt+). 50% white space. NO detailed text. Readable from 8 feet." -o figures/background_visual.png
```

### For Data Visualizations

```bash
# SIMPLE chart with ONLY 3 bars, GIANT labels
python scripts/generate_schematic.py "POSTER FORMAT for A0. SIMPLE bar chart with ONLY 3 bars: BASELINE (70%), EXISTING (85%), OURS (95%). GIANT percentage labels ON the bars (100pt+). NO axis labels, NO legend, NO gridlines. Our bar highlighted in different color. 40% white space. Readable from 8 feet." -o figures/comparison_chart.png
```

---

## Step 2b: Post-Generation Review (MANDATORY)

**⚠️ CRITICAL: Review EVERY generated graphic before adding to poster.**

**For each generated figure, open at 25% zoom and check:**

### PASS Criteria (all must be true)

- ✅ Can read ALL text clearly at 25% zoom
- ✅ Count elements: 3-4 or fewer
- ✅ White space: 50%+ of image is empty
- ✅ Simple enough to understand in 2 seconds
- ✅ NOT a complex workflow with 5+ stages
- ✅ NOT multiple nested sections

### FAIL Criteria (regenerate if ANY are true)

- ❌ Text is small or hard to read at 25% zoom → REGENERATE with "150pt+" fonts
- ❌ More than 4 elements → REGENERATE with "ONLY 3 elements"
- ❌ Less than 50% white space → REGENERATE with "60% white space"
- ❌ Complex multi-stage workflow → SPLIT into 2-3 simple graphics
- ❌ Multiple case studies cramped together → SPLIT into separate graphics
- ❌ Takes more than 3 seconds to understand → SIMPLIFY and regenerate

### Common Failures and Fixes

- "7-stage workflow with tiny text" → Regenerate as "3 high-level stages only"
- "3 case studies in one graphic" → Generate 3 separate simple graphics
- "Timeline with 8 years" → Regenerate with "ONLY 3 key milestones"
- "Comparison of 5 methods" → Regenerate with "ONLY Our method vs Best baseline (2 bars)"

**DO NOT PROCEED to assembly if ANY graphic fails the checks above.**

---

## Step 3: Assemble in LaTeX Template

After all figures pass the post-generation review, include them in your poster template:

### tikzposter Example

```latex
\documentclass[25pt, a0paper, portrait]{tikzposter}

\begin{document}

\maketitle
// ... (39 lines trimmed)
\end{columns}

\end{document}
```

### baposter Example

```latex
\headerbox{Methods}{name=methods,column=0,row=0}{
  \centering
  \includegraphics[width=0.95\linewidth]{figures/methods_flowchart.png}
}

\headerbox{Results}{name=results,column=1,row=0}{
  \includegraphics[width=\linewidth]{figures/comparison_chart.png}
  \vspace{0.3em}

  Key finding: Our method achieves 92% accuracy.
}
```

---

## Complete Poster Generation Workflow Example

**Full workflow with ALL quality checks:**

```bash
# STEP 0: Pre-Generation Review (MANDATORY)
# Content plan: Drug discovery poster
# - Workflow: 7 stages → ❌ TOO MANY → Reduce to 3 mega-stages ✅
# - 3 case studies → ❌ TOO MANY → One case per graphic (make 3 graphics) ✅
# - Timeline 2018-2024 → ❌ TOO DETAILED → Only 3 key years ✅
// ... (35 lines trimmed)
# STEP 4: PDF Overflow Check (see PDF Review reference)
grep "Overfull" poster.log
# Open at 100% and check all 4 edges
```

---

## Fixing Failed Graphics

**If ANY graphic fails Step 2b review:**
- Too many elements → Regenerate with "ONLY 3 elements"
- Small text → Regenerate with "150pt+" or "GIANT BOLD (150pt+)"
- Cluttered → Regenerate with "60% white space" and "ULTRA-SIMPLE"
- Complex workflow → SPLIT into multiple simple 3-element graphics

---

## Visual Element Guidelines

**⚠️ CRITICAL: Each graphic must have ONE message and MAXIMUM 3-4 elements.**

**ABSOLUTE LIMITS - These are NOT guidelines, these are HARD LIMITS:**
- **MAXIMUM 3-4 elements** per graphic (3 is ideal)
- **MAXIMUM 10 words** total per graphic
- **MINIMUM 50% white space** (60% is better)
- **MINIMUM 120pt** for key numbers/metrics
- **MINIMUM 80pt** for labels

### Per-Section Requirements

| Section | Max Elements | Max Words | Example Prompt (REQUIRED PATTERN) |
|---------|--------------|-----------|-------------------------------------|
| **Introduction** | 3 icons | 6 words | "POSTER FORMAT for A0: ULTRA-SIMPLE 3 icons: [icon1] [icon2] [icon3]. ONE WORD labels (100pt bold). 60% white space. 3 words total." |
| **Methods** | 3 boxes | 6 words | "POSTER FORMAT for A0: ULTRA-SIMPLE 3-box workflow: 'STEP1' → 'STEP2' → 'STEP3'. GIANT labels (120pt+). 60% white space. 3 words only." |
| **Results** | 2-3 bars | 6 words | "POSTER FORMAT for A0: TWO bars: 'BASELINE 70%' 'OURS 95%'. GIANT percentages (150pt+) ON bars. NO axis. 60% white space." |
| **Conclusions** | 3 cards | 9 words | "POSTER FORMAT for A0: THREE cards: '95%' (150pt) 'ACCURATE', '2X' (150pt) 'FASTER', checkmark 'READY'. 60% white space." |
| **Case Study** | 3 elements | 5 words | "POSTER FORMAT for A0: ONE case: logo + '18 MONTHS' (150pt) + 'to discovery' (60pt). 60% white space." |
| **Timeline** | 3 points | 3 words | "POSTER FORMAT for A0: THREE years only: '2018' '2021' '2024' (150pt each). Large icons. 60% white space. NO details." |

### MANDATORY Prompt Elements (ALL required)

1. **"POSTER FORMAT for A0"** - MUST be first
2. **"ULTRA-SIMPLE"** or **"ONLY X elements"** - content limit
3. **"GIANT (120pt+)"** or specific font sizes - readability
4. **"60% white space"** - mandatory breathing room
5. **"readable from 10-12 feet"** - viewing distance
6. **Exact count** of words/elements - "3 words total" or "ONLY 3 icons"

### Patterns That ALWAYS Fail (REJECT IMMEDIATELY)

- ❌ "7-stage drug discovery workflow" → Split to "3 mega-stages"
- ❌ "Timeline from 2015-2024 with annual updates" → "ONLY 3 key years"
- ❌ "3 case studies with details" → Make 3 separate simple graphics
- ❌ "Comparison of 5 methods with metrics" → "ONLY 2: ours vs best"
- ❌ "Complete architecture showing all layers" → "3 components only"
- ❌ "Show stages 1,2,3,4,5,6" → "3 high-level stages"

### Patterns That Work

- ✅ "3 mega-stages collapsed from 7" → Proper simplification
- ✅ "ONE case with ONE metric" → Will make multiple if needed
- ✅ "ONLY 3 milestones" → Selective, focused
- ✅ "2 bars: ours vs baseline" → Direct comparison
- ✅ "3-component high-level view" → Appropriately simplified

---

## Scientific Schematics Integration

For detailed guidance on creating schematics, refer to the **scientific-schematics** skill documentation.

**Key capabilities:**
- Nano Banana Pro automatically generates, reviews, and refines diagrams
- Creates publication-quality images with proper formatting
- Ensures accessibility (colorblind-friendly, high contrast)
- Supports iterative refinement for complex diagrams
