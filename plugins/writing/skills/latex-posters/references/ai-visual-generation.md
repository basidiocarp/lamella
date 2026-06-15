# AI-Powered Visual Element Generation

**STANDARD WORKFLOW: Generate ALL major visual elements using AI before creating the LaTeX poster.**

This is the recommended approach for creating visually compelling posters:
1. Plan all visual elements needed (title, intro, methods, results, conclusions)
2. Generate each element using the diagram or image-generation tool available in your environment
3. Assemble generated images in the LaTeX template
4. Add text content around the visuals

**Target: 60-70% of poster area should be AI-generated visuals, 30-40% text.**

---

## CRITICAL: Preventing Content Overflow

**⚠️ POSTERS MUST NOT HAVE TEXT OR CONTENT CUT OFF AT EDGES.**

**Common Overflow Problems:**
1. **Title/footer text extending beyond page boundaries**
2. **Too many sections crammed into available space**
3. **Figures placed too close to edges**
4. **Text blocks exceeding column widths**

**Prevention Rules:**

**1. Limit Content Sections (MAXIMUM 5-6 sections for A0):**
```
✅ GOOD - 5 sections with room to breathe:
   - Title/Header
   - Introduction/Problem
   - Methods
   - Results (1-2 key findings)
   - Conclusions

❌ BAD - 8+ sections crammed together:
   - Overview, Introduction, Background, Methods,
   - Results 1, Results 2, Discussion, Conclusions, Future Work
```

**2. Set Safe Margins in LaTeX:**
```latex
% tikzposter - add generous margins
\documentclass[25pt, a0paper, portrait, margin=25mm]{tikzposter}

% baposter - ensure content doesn't touch edges
\begin{poster}{
  columns=3,
  colspacing=2em,           % Space between columns
  headerheight=0.1\textheight,  % Smaller header
  % Leave space at bottom
}
```

**3. Figure Sizing - Never 100% Width:**
```latex
% Leave margins around figures
\includegraphics[width=0.85\linewidth]{figure.png}  % NOT 1.0\linewidth
```

**4. Check for Overflow Before Printing:**
```bash
# Compile and check PDF at 100% zoom
pdflatex poster.tex

# Look for:
# - Text cut off at any edge
# - Content touching page boundaries
# - Overfull hbox warnings in .log file
grep -i "overfull" poster.log
```

**5. Word Count Limits:**
- **A0 poster**: 300-800 words MAXIMUM
- **Per section**: 50-100 words maximum
- **If you have more content**: Cut it or make a handout

---

## CRITICAL: Poster-Size Font Requirements

**⚠️ ALL text within AI-generated visualizations MUST be poster-readable.**

When generating graphics for posters, you MUST include font size specifications in EVERY prompt. Poster graphics are viewed from 4-6 feet away, so text must be LARGE.

**⚠️ COMMON PROBLEM: Content Overflow and Density**

The #1 issue with AI-generated poster graphics is **TOO MUCH CONTENT**. This causes:
- Text overflow beyond boundaries
- Unreadable small fonts
- Cluttered, overwhelming visuals
- Poor white space usage

**SOLUTION: Generate SIMPLE graphics with MINIMAL content.**

**MANDATORY prompt requirements for EVERY poster graphic:**

```
POSTER FORMAT REQUIREMENTS (STRICTLY ENFORCE):
- ABSOLUTE MAXIMUM 3-4 elements per graphic (3 is ideal)
- ABSOLUTE MAXIMUM 10 words total in the entire graphic
- NO complex workflows with 5+ steps (split into 2-3 simple graphics instead)
- NO multi-level nested diagrams (flatten to single level)
- NO case studies with multiple sub-sections (one key point per case)
- ALL text GIANT BOLD (80pt+ for labels, 120pt+ for key numbers)
- High contrast ONLY (dark on white OR white on dark, NO gradients with text)
- MANDATORY 50% white space minimum (half the graphic should be empty)
- Thick lines only (5px+ minimum), large icons (200px+ minimum)
- ONE SINGLE MESSAGE per graphic (not 3 related messages)
```

**⚠️ BEFORE GENERATING: Review your prompt and count elements**
- If your description has 5+ items → STOP. Split into multiple graphics
- If your workflow has 5+ stages → STOP. Show only 3-4 high-level steps
- If your comparison has 4+ methods → STOP. Show only top 3 or Our vs Best Baseline

**Content limits per graphic type (STRICT):**

| Graphic Type | Max Elements | Max Words | Reject If | Good Example |
|--------------|--------------|-----------|-----------|--------------|
| Flowchart | **3-4 boxes MAX** | **8 words** | 5+ stages, nested steps | "DISCOVER → VALIDATE → APPROVE" (3 words) |
| Key findings | **3 items MAX** | **9 words** | 4+ metrics, paragraphs | "95% ACCURATE" "2X FASTER" "FDA READY" (6 words) |
| Comparison chart | **3 bars MAX** | **6 words** | 4+ methods, legend text | "OURS: 95%" "BEST: 85%" (4 words) |
| Case study | **1 case, 3 elements** | **6 words** | Multiple cases, substories | Logo + "18 MONTHS" + "to discovery" (2 words) |
| Timeline | **3-4 points MAX** | **8 words** | Year-by-year detail | "2020 START" "2022 TRIAL" "2024 APPROVED" (6 words) |

---

## CRITICAL: AI-Generated Graphic Sizing

**⚠️ Each AI-generated graphic should focus on ONE concept with MINIMAL content.**

**Problem**: Generating complex diagrams with many elements leads to small text.

**Solution**: Generate SIMPLE graphics with FEW elements and LARGE text.

**Example - WRONG (too complex, text will be small):**
```text
Prompt to avoid:
Complete ML pipeline showing data collection, preprocessing with 5 steps,
feature engineering with 8 techniques, model training with hyperparameter
tuning, validation with cross-validation, and deployment with monitoring.
Include all labels and descriptions.
```

**Example - CORRECT (simple, focused, large text):**
```text
Graphic 1 prompt for figures/overview.png:
POSTER FORMAT for A0: Simple 4-step pipeline. Four large boxes:
DATA → PROCESS → MODEL → RESULTS. GIANT labels (80pt+), thick arrows,
lots of white space. Only 4 words total. Readable from 8 feet.

Graphic 2 prompt for figures/accuracy.png:
POSTER FORMAT for A0: Single key metric display. Giant '95%' text (150pt+)
with 'ACCURACY' below (60pt+). Checkmark icon. Minimal design, high contrast.
Readable from 10 feet.
```

**Rules for AI-generated poster graphics:**

| Rule | Limit | Reason |
|------|-------|--------|
| **Elements per graphic** | 3-5 maximum | More elements = smaller text |
| **Words per graphic** | 10-15 maximum | Minimal text = larger fonts |
| **Flowchart steps** | 4-5 maximum | Keeps labels readable |
| **Chart categories** | 3-4 maximum | Prevents crowding |
| **Nested levels** | 1-2 maximum | Avoids complexity |

**Split complex content into multiple simple graphics:**
```
Instead of 1 complex diagram with 12 elements:
→ Create 3 simple diagrams with 4 elements each
→ Each graphic can have LARGER text
→ Arrange in poster with clear visual flow
```

---

## Font Size Reference

**Font size reference for poster prompts:**

| Element | Minimum Size | Prompt Keywords |
|---------|--------------|-----------------|
| Main numbers/metrics | 72pt+ | "huge", "very large", "giant", "poster-size" |
| Section titles | 60pt+ | "large bold", "prominent" |
| Labels/captions | 36pt+ | "readable from 6 feet", "clear labels" |
| Body text | 24pt+ | "poster-readable", "large text" |

**Always include in prompts:**
- "POSTER FORMAT" or "for A0 poster" or "readable from 6 feet"
- "VERY LARGE TEXT" or "huge bold fonts"
- Specific text that should appear (so it's baked into the image)
- "minimal text, maximum impact"
- "high contrast" for readability
- "generous margins" and "no text near edges"

---

## Pre-Generation Review Checklist

**⚠️ BEFORE generating ANY graphics, review your content plan:**

**For EACH planned graphic, ask these questions:**
1. **Element count**: Can I describe this in 3-4 items or less?
   - ❌ NO → Simplify or split into multiple graphics
   - ✅ YES → Continue

2. **Complexity check**: Is this a multi-stage workflow (5+ steps) or nested diagram?
   - ❌ YES → Flatten to 3-4 high-level steps only
   - ✅ NO → Continue

3. **Word count**: Can I describe all text in 10 words or less?
   - ❌ NO → Cut text, use single-word labels
   - ✅ YES → Continue

4. **Message clarity**: Does this graphic convey ONE clear message?
   - ❌ NO → Split into multiple focused graphics
   - ✅ YES → Continue to generation

**Common patterns that ALWAYS fail (reject these):**
- "Show stages 1 through 7..." → Split into high-level overview (3 stages) + detail graphics
- "Multiple case studies..." → One case per graphic
- "Timeline from 2015 to 2024 with annual milestones..." → Show only 3-4 key years
- "Comparison of 6 methods..." → Show only top 3 or Our method vs Best baseline
- "Architecture with all layers and connections..." → High-level only (3-4 components)

---

## Planning Your Poster Elements

After passing the pre-generation review, identify visual elements needed:

1. **Title Block** - Stylized title with institutional branding (optional - can be LaTeX text)
2. **Introduction Graphic** - Conceptual overview (3 elements max)
3. **Methods Diagram** - High-level workflow (3-4 steps max)
4. **Results Figures** - Key findings (3 metrics max per figure, may need 2-3 separate figures)
5. **Conclusion Graphic** - Summary visual (3 takeaways max)
6. **Supplementary Icons** - Simple icons, QR codes, logos (minimal)
