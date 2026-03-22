# PPTX Creation Workflow (Without Template)

When creating a new PowerPoint presentation from scratch, use the **html2pptx** workflow.

## Design Principles

**CRITICAL**: Before creating any presentation:
1. **Consider the subject matter**: What is this presentation about?
2. **Check for branding**: If the user mentions a company/organization, consider their brand colors
3. **Match palette to content**: Select colors that reflect the subject
4. **State your approach**: Explain your design choices before writing code

**Requirements**:
- ✅ State your content-informed design approach BEFORE writing code
- ✅ Use web-safe fonts only: Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Tahoma, Trebuchet MS, Impact
- ✅ Create clear visual hierarchy through size, weight, and color
- ✅ Ensure readability: strong contrast, appropriately sized text, clean alignment
- ✅ Be consistent: repeat patterns, spacing, and visual language across slides

---

## Color Palette Selection

**Choosing colors creatively**:
- **Think beyond defaults**: What colors genuinely match this specific topic?
- **Consider multiple angles**: Topic, industry, mood, energy level, target audience
- **Be adventurous**: Try unexpected combinations
- **Build your palette**: Pick 3-5 colors that work together
- **Ensure contrast**: Text must be clearly readable on backgrounds

**Example palettes**:

1. **Classic Blue**: Deep navy (#1C2833), slate gray (#2E4053), silver (#AAB7B8), off-white (#F4F6F6)
2. **Teal & Coral**: Teal (#5EA8A7), deep teal (#277884), coral (#FE4447), white (#FFFFFF)
3. **Bold Red**: Red (#C0392B), bright red (#E74C3C), orange (#F39C12), yellow (#F1C40F)
4. **Warm Blush**: Mauve (#A49393), blush (#EED6D3), rose (#E8B4B8), cream (#FAF7F2)
5. **Burgundy Luxury**: Burgundy (#5D1D2E), crimson (#951233), rust (#C15937), gold (#997929)
6. **Deep Purple & Emerald**: Purple (#B165FB), dark blue (#181B24), emerald (#40695B)
7. **Cream & Forest Green**: Cream (#FFE1C7), forest green (#40695B), white (#FCFCFC)
8. **Pink & Purple**: Pink (#F8275B), coral (#FF574A), rose (#FF737D), purple (#3D2F68)
9. **Lime & Plum**: Lime (#C5DE82), plum (#7C3A5F), coral (#FD8C6E), blue-gray (#98ACB5)
10. **Black & Gold**: Gold (#BF9A4A), black (#000000), cream (#F4F6F6)
11. **Sage & Terracotta**: Sage (#87A96B), terracotta (#E07A5F), cream (#F4F1DE)
12. **Charcoal & Red**: Charcoal (#292929), red (#E33737), light gray (#CCCBCB)
13. **Vibrant Orange**: Orange (#F96D00), light gray (#F2F2F2), charcoal (#222831)
14. **Forest Green**: Black (#191A19), green (#4E9F3D), dark green (#1E5128)
15. **Retro Rainbow**: Purple (#722880), pink (#D72D51), orange (#EB5C18), amber (#F08800)

---

## Visual Details Options

**Geometric Patterns**:
- Diagonal section dividers
- Asymmetric column widths (30/70, 40/60)
- Rotated text headers at 90° or 270°
- Circular/hexagonal frames for images
- Triangular accent shapes in corners

**Border & Frame Treatments**:
- Thick single-color borders (10-20pt) on one side
- Double-line borders with contrasting colors
- Corner brackets instead of full frames
- L-shaped borders
- Underline accents beneath headers (3-5pt)

**Typography Treatments**:
- Extreme size contrast (72pt headlines vs 11pt body)
- All-caps headers with wide letter spacing
- Numbered sections in oversized display type
- Monospace (Courier New) for data/stats
- Outlined text for emphasis

**Chart & Data Styling**:
- Monochrome charts with single accent color
- Horizontal bar charts instead of vertical
- Dot plots instead of bar charts
- Minimal gridlines or none
- Data labels directly on elements

**Layout Innovations**:
- Full-bleed images with text overlays
- Sidebar column (20-30% width)
- Modular grid systems (3×3, 4×4)
- Z-pattern or F-pattern content flow
- Magazine-style multi-column layouts

**Background Treatments**:
- Solid color blocks (40-60% of slide)
- Gradient fills (vertical or diagonal)
- Split backgrounds (two colors)
- Negative space as design element

---

## Layout Tips

**For slides with charts or tables:**
- **Two-column layout (PREFERRED)**: Header spanning full width, then two columns below - text in one, content in the other
- **Full-slide layout**: Let featured content take entire slide
- **NEVER vertically stack**: Don't place charts/tables below text in a single column

---

## Workflow Steps

1. **MANDATORY - READ ENTIRE FILE**: Read `html2pptx.md` completely
2. Create HTML file for each slide with proper dimensions (e.g., 720pt × 405pt for 16:9)
   - Use `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` for text
   - Use `class="placeholder"` for chart/table areas
   - **CRITICAL**: Rasterize gradients and icons as PNG images FIRST using Sharp
3. Create and run JavaScript using `html2pptx.js` library
4. **Visual validation**: Generate thumbnails and inspect for layout issues
   - Create grid: `python scripts/thumbnail.py output.pptx workspace/thumbnails --cols 4`
   - Check for: text cutoff, overlap, positioning issues, contrast issues
   - Repeat until all slides are correct
