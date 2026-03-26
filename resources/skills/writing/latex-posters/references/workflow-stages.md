# Workflow Stages

> Detailed step-by-step workflow for creating research posters. Return to [main SKILL](../SKILL.md).

## Stage 1: Planning and Content Development

1. **Determine poster requirements**:
   - Conference size specifications (A0, 36×48", etc.)
   - Orientation (portrait vs. landscape)
   - Submission deadlines and format requirements

2. **Develop content outline**:
   - Identify 1-3 core messages
   - Select key figures (typically 3-6 main visuals)
   - Draft concise text for each section (bullet points preferred)
   - Aim for 300-800 words total

3. **Choose LaTeX package**:
   - beamerposter: If familiar with Beamer, need institutional themes
   - tikzposter: For modern, colorful designs with flexibility
   - baposter: For structured, professional multi-column layouts

---

## Stage 2: Generate Visual Elements (AI-Powered)

**CRITICAL: Generate SIMPLE figures with MINIMAL content. Each graphic = ONE message.**

**Content limits:**
- Maximum 4-5 elements per graphic
- Maximum 15 words total per graphic
- 50% white space minimum
- GIANT fonts (80pt+ for labels, 120pt+ for key numbers)

1. **Create figures directory**:
   ```bash
   mkdir -p figures
   ```

2. **Generate SIMPLE visual elements**:
   ```text
   figures/intro.png
   POSTER FORMAT for A0. SIMPLE visual with ONLY 3 elements: [icon1] [icon2] [icon3].
   ONE word labels (80pt+). 50% white space. Readable from 8 feet.

   figures/methods.png
   POSTER FORMAT for A0. SIMPLE flowchart with ONLY 4 boxes:
   STEP1 → STEP2 → STEP3 → STEP4. GIANT labels (100pt+). 50% white space.
   NO sub-steps.

   figures/results.png
   POSTER FORMAT for A0. SIMPLE chart with ONLY 3 bars. GIANT percentages ON bars
   (120pt+). NO axis, NO legend. 50% white space.

   figures/conclusions.png
   POSTER FORMAT for A0. EXACTLY 3 key findings: '[NUMBER]' (150pt) '[LABEL]' (60pt)
   for each. 50% white space. NO other text.
   ```

3. **Review generated figures - check for overflow:**
   - **View at 25% zoom**: All text still readable?
   - **Count elements**: More than 5? → Regenerate simpler
   - **Check white space**: Less than 40%? → Add "60% white space" to prompt
   - **Font too small?**: Add "EVEN LARGER" or increase pt sizes
   - **Still overflowing?**: Reduce to 3 elements instead of 4-5

---

## Stage 3: Design and Layout

1. **Select or create template**:
   - Start with provided templates in `assets/`
   - Customize color scheme to match branding
   - Configure page size and orientation

2. **Design layout structure**:
   - Plan column structure (2, 3, or 4 columns)
   - Map content flow (typically left-to-right, top-to-bottom)
   - Allocate space for title (10-15%), content (70-80%), footer (5-10%)

3. **Set typography**:
   - Configure font sizes for different hierarchy levels
   - Ensure minimum 24pt body text
   - Test readability from 4-6 feet distance

---

## Stage 4: Content Integration

1. **Create poster header**:
   - Title (concise, descriptive, 10-15 words)
   - Authors and affiliations
   - Institution logos (high-resolution)
   - Conference logo if required

2. **Integrate AI-generated figures**:
   - Add all figures from Stage 2 to appropriate sections
   - Use `\includegraphics` with proper sizing
   - Ensure figures dominate each section (visuals first, text second)
   - Center figures within blocks for visual impact

3. **Add minimal supporting text**:
   - Keep text minimal and scannable (300-800 words total)
   - Use bullet points, not paragraphs
   - Write in active voice
   - Text should complement figures, not duplicate them

4. **Add supplementary elements**:
   - QR codes for supplementary materials
   - References (cite key papers only, 5-10 typical)
   - Contact information and acknowledgments

---

## Stage 5: Refinement and Testing

1. **Review and iterate**:
   - Check for typos and errors
   - Verify all figures are high resolution
   - Ensure consistent formatting
   - Confirm color scheme works well together

2. **Test readability**:
   - Print at 25% scale and read from 2-3 feet (simulates poster from 8-12 feet)
   - Check color on different monitors
   - Verify QR codes function correctly
   - Ask colleague to review

3. **Optimize for printing**:
   - Embed all fonts in PDF
   - Verify image resolution
   - Check PDF size requirements
   - Include bleed area if required

---

## Stage 6: Compilation and Delivery

1. **Compile final PDF**:
   ```bash
   pdflatex poster.tex
   # Or for better font support:
   lualatex poster.tex
   ```

2. **Verify output quality**:
   - Check all elements are visible and correctly positioned
   - Zoom to 100% and inspect figure quality
   - Verify colors match expectations
   - Confirm PDF opens correctly on different viewers

3. **Prepare for printing**:
   - Export as PDF/X-1a if required
   - Save backup copies
   - Get test print on regular paper first
   - Order professional printing 2-3 days before deadline

4. **Create supplementary materials**:
   - Save PNG/JPG version for social media
   - Create handout version (8.5×11" summary)
   - Prepare digital version for email sharing

---

## Integration with Other Skills

This skill works effectively with:

- **content-writer**: Develop poster copy from papers, notes, or research artifacts
- **writing-voice**: Tighten headings and body text so they stay concise at poster scale
- **Available diagram or image-generation tooling**: Create stylized graphics, conceptual illustrations, and summary visuals

**Recommended workflow**: Generate all visuals before creating the LaTeX poster so layout and copy can adapt to the final assets.
