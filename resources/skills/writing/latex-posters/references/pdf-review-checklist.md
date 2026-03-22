# PDF Review and Quality Control Checklist

> Complete checklist for reviewing poster PDFs before printing. Return to [main SKILL](../SKILL.md).

**CRITICAL**: Always review the generated PDF before printing or presenting. Use this systematic checklist.

---

## Step 1: Page Size Verification

```bash
# Check PDF dimensions (should match poster size exactly)
pdfinfo poster.pdf | grep "Page size"

# Expected outputs:
# A0: 2384 x 3370 points (841 x 1189 mm)
# 36x48": 2592 x 3456 points
# A1: 1684 x 2384 points (594 x 841 mm)
```

---

## Step 2: OVERFLOW CHECK (CRITICAL)

**⚠️ THIS IS THE #1 CAUSE OF POSTER FAILURES. Check BEFORE proceeding.**

### Step 2a: Check LaTeX Log File

```bash
# Check for overflow warnings (these are ERRORS, not suggestions)
grep -i "overfull\|underfull\|badbox" poster.log

# ANY "Overfull" warning = content is cut off or extending beyond boundaries
# FIX ALL OF THESE before proceeding
```

**Common overflow warnings and what they mean:**
- `Overfull \hbox (15.2pt too wide)` → Text or graphic is 15.2pt wider than column
- `Overfull \vbox (23.5pt too high)` → Content is 23.5pt taller than available space
- `Badbox` → LaTeX struggling to fit content within boundaries

### Step 2b: Visual Edge Inspection (100% zoom in PDF viewer)

**Check ALL FOUR EDGES systematically:**

#### TOP EDGE:
- [ ] Title completely visible (not cut off)
- [ ] Author names fully visible
- [ ] No graphics touching top margin
- [ ] Header content within safe zone

#### BOTTOM EDGE:
- [ ] References fully visible (not cut off)
- [ ] Acknowledgments complete
- [ ] Contact info readable
- [ ] No graphics cut off at bottom

#### LEFT EDGE:
- [ ] No text touching left margin
- [ ] All bullet points fully visible
- [ ] Graphics have left margin (not bleeding off)
- [ ] Column content within bounds

#### RIGHT EDGE:
- [ ] No text extending beyond right margin
- [ ] Graphics not cut off on right
- [ ] Column content stays within bounds
- [ ] QR codes fully visible

#### BETWEEN COLUMNS:
- [ ] Content stays within individual columns
- [ ] No text bleeding into adjacent columns
- [ ] Figures respect column boundaries

### If ANY check fails, FIX IMMEDIATELY:

**Fix hierarchy (try in order):**

1. **Check AI-generated graphics first:**
   - Are they too complex (5+ elements)? → Regenerate simpler
   - Do they have tiny text? → Regenerate with "150pt+" fonts
   - Are there too many? → Reduce number of figures

2. **Reduce sections:**
   - More than 5-6 sections? → Combine or remove
   - Example: Merge "Discussion" into "Conclusions"

3. **Cut text content:**
   - More than 800 words total? → Cut to 300-500
   - More than 100 words per section? → Cut to 50-80

4. **Adjust figure sizing:**
   - Using `width=\linewidth`? → Change to `width=0.85\linewidth`
   - Using `width=1.0\columnwidth`? → Change to `width=0.9\columnwidth`

5. **Increase margins (last resort):**
   ```latex
   \documentclass[25pt, a0paper, portrait, margin=25mm]{tikzposter}
   ```

**DO NOT proceed to Step 3 if ANY overflow exists.**

---

## Step 3: Visual Inspection Checklist

Open PDF at 100% zoom and check:

### Layout and Spacing
- [ ] Content fills entire page (no large white margins)
- [ ] Consistent spacing between columns
- [ ] Consistent spacing between blocks/sections
- [ ] All elements aligned properly (use ruler tool)
- [ ] No overlapping text or figures
- [ ] White space evenly distributed

### Typography
- [ ] Title clearly visible and large (72pt+)
- [ ] Section headers readable (48-72pt)
- [ ] Body text readable at 100% zoom (24-36pt minimum)
- [ ] No text cutoff or running off edges
- [ ] Consistent font usage throughout
- [ ] All special characters render correctly (symbols, Greek letters)

### Visual Elements
- [ ] All figures display correctly
- [ ] No pixelated or blurry images
- [ ] Figure captions present and readable
- [ ] Colors render as expected (not washed out or too dark)
- [ ] Logos display clearly
- [ ] QR codes visible and scannable

### Content Completeness
- [ ] Title and authors complete
- [ ] All sections present (Intro, Methods, Results, Conclusions)
- [ ] References included
- [ ] Contact information visible
- [ ] Acknowledgments (if applicable)
- [ ] No placeholder text remaining (Lorem ipsum, TODO, etc.)

### Technical Quality
- [ ] No LaTeX compilation warnings in important areas
- [ ] All citations resolved (no [?] marks)
- [ ] All cross-references working
- [ ] Page boundaries correct (no content cut off)

---

## Step 4: Reduced-Scale Print Test

**Essential Pre-Printing Test**:
```bash
# Create reduced-size test print (25% of final size)
# This simulates viewing full poster from ~8-10 feet

# For A0 poster, print on A4 paper (24.7% scale)
# For 36x48" poster, print on letter paper (~25% scale)
```

**Print Test Checklist**:
- [ ] Title readable from 6 feet away
- [ ] Section headers readable from 4 feet away
- [ ] Body text readable from 2 feet away
- [ ] Figures clear and understandable
- [ ] Colors printed accurately
- [ ] No obvious design flaws

---

## Step 5: Digital Quality Checks

### Font Embedding Verification
```bash
# Check that all fonts are embedded (required for printing)
pdffonts poster.pdf

# All fonts should show "yes" in "emb" column
# If any show "no", recompile with:
pdflatex -dEmbedAllFonts=true poster.tex
```

### Image Resolution Check
```bash
# Extract image information
pdfimages -list poster.pdf

# Check that all images are at least 300 DPI
# Formula: DPI = pixels / (inches in poster)
# For A0 width (33.1"): 300 DPI = 9930 pixels minimum
```

### File Size Optimization
```bash
# For email/web, compress if needed (>50MB)
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=poster_compressed.pdf poster.pdf

# For printing, keep original (no compression)
```

---

## Step 6: Accessibility Check

### Color Contrast Verification
- [ ] Text-background contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Important elements contrast ratio ≥ 7:1 (WCAG AAA)
- Test online: https://webaim.org/resources/contrastchecker/

### Color Blindness Simulation
- [ ] View PDF through color blindness simulator
- [ ] Information not lost with red-green simulation
- [ ] Use Coblis (color-blindness.com) or similar tool

---

## Step 7: Content Proofreading

### Systematic Review
- [ ] Spell-check all text
- [ ] Verify all author names and affiliations
- [ ] Check all numbers and statistics for accuracy
- [ ] Confirm all citations are correct
- [ ] Review figure labels and captions
- [ ] Check for typos in headers and titles

### Peer Review
- [ ] Ask colleague to review poster
- [ ] 30-second test: Can they identify main message?
- [ ] 5-minute review: Do they understand conclusions?
- [ ] Note any confusing elements

---

## Step 8: Technical Validation

### LaTeX Compilation Log Review
```bash
# Check for warnings in .log file
grep -i "warning\|error\|overfull\|underfull" poster.log

# Common issues to fix:
# - Overfull hbox: Text extending beyond margins
# - Underfull hbox: Excessive spacing
# - Missing references: Citations not resolved
# - Missing figures: Image files not found
```

### Fix Common Warnings
```latex
% Overfull hbox (text too wide)
\usepackage{microtype}  % Better spacing
\sloppy  % Allow slightly looser spacing
\hyphenation{long-word}  % Manual hyphenation
// ... (5 lines trimmed)
% Ensure paths are correct and files exist
\graphicspath{{./figures/}{./images/}}
```

---

## Step 9: Final Pre-Print Checklist

### Before Sending to Printer
- [ ] PDF size exactly matches requirements (check with pdfinfo)
- [ ] All fonts embedded (check with pdffonts)
- [ ] Color mode correct (RGB for screen, CMYK for print if required)
- [ ] Bleed area added if required (usually 3-5mm)
- [ ] Crop marks visible if required
- [ ] Test print completed and reviewed
- [ ] File naming clear: [LastName]_[Conference]_Poster.pdf
- [ ] Backup copy saved

### Printing Specifications to Confirm
- [ ] Paper type (matte vs. glossy)
- [ ] Printing method (inkjet, large format, fabric)
- [ ] Color profile (provided to printer if required)
- [ ] Delivery deadline and shipping address
- [ ] Tube or flat packaging preference

### Digital Presentation Checklist
- [ ] PDF size optimized (<10MB for email)
- [ ] Tested on multiple PDF viewers (Adobe, Preview, etc.)
- [ ] Displays correctly on different screens
- [ ] QR codes tested and functional
- [ ] Alternative formats prepared (PNG for social media)

---

## Review Script

Available in `scripts/review_poster.sh`:

```bash
#!/bin/bash
# Automated poster PDF review script

echo "Poster PDF Quality Check"
echo "======================="
// ... (32 lines trimmed)
echo "- Reduced-scale print test (25%)"
echo "- Color contrast verification"
echo "- Proofreading for typos"
```

---

## Common PDF Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Large white margins | Incorrect margin settings | Reduce margin in documentclass |
| Content cut off | Exceeds page boundaries | Check total width/height calculations |
| Blurry images | Low resolution (<300 DPI) | Replace with higher resolution images |
| Missing fonts | Fonts not embedded | Compile with -dEmbedAllFonts=true |
| Wrong page size | Incorrect paper size setting | Verify documentclass paper size |
| Colors look wrong | RGB vs CMYK mismatch | Convert color space for print |
| File too large (>50MB) | Uncompressed images | Optimize images or compress PDF |
| QR codes don't work | Too small or low resolution | Minimum 2×2cm, high contrast |
