---
name: pptx-presentations
description: "Creates, edits, and analyzes PowerPoint presentations (.pptx)."
origin: lamella
---

# PPTX creation, editing, and analysis


## Contents

- [Overview](#overview)
- [Visual Enhancement with Scientific Schematics](#visual-enhancement-with-scientific-schematics)
- [Reading and Analyzing Content](#reading-and-analyzing-content)
- [Creating New Presentations](#creating-new-presentations)
- [Editing Existing Presentations](#editing-existing-presentations)
- [Using Templates](#using-templates)
- [Creating Thumbnail Grids](#creating-thumbnail-grids)
- [Reference Files](#reference-files)
- [Dependencies](#dependencies)


## Overview

A .pptx file is a ZIP archive containing XML files and resources. Create, edit, or analyze PowerPoint presentations using text extraction, raw XML access, or html2pptx workflows.

## Visual Enhancement with Scientific Schematics

**When creating documents, always consider adding scientific diagrams:**

```bash
```

The AI will automatically create publication-quality, accessible images.

**When to add schematics:**
- Presentation workflow diagrams
- Content organization diagrams
- System architecture illustrations
- Process flow visualizations

---

## Reading and Analyzing Content

### Text Extraction
```bash
python -m markitdown path-to-file.pptx
```

### Raw XML Access
Required for: comments, speaker notes, layouts, animations, design elements.

```bash
python ooxml/scripts/unpack.py <office_file> <output_dir>
```

### Key File Structures
* `ppt/presentation.xml` - Main presentation metadata
* `ppt/slides/slide{N}.xml` - Individual slide contents
* `ppt/notesSlides/notesSlide{N}.xml` - Speaker notes
* `ppt/theme/` - Theme and styling

---

## Creating New Presentations

Use the **html2pptx** workflow.

### Design Requirements
- ✅ State design approach BEFORE writing code
- ✅ Use web-safe fonts: Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Tahoma, Trebuchet MS, Impact
- ✅ Create clear visual hierarchy
- ✅ Ensure readability with strong contrast
- ✅ Be consistent across slides

### Workflow
1. **MANDATORY**: Read `html2pptx.md` completely
2. Create HTML file for each slide (e.g., 720pt × 405pt for 16:9)
3. Create JavaScript using `html2pptx.js` library
4. **Visual validation**: Generate thumbnails and inspect

For deeper HTML conversion details, use the focused references linked from
`references/html2pptx.md`.

```bash
python scripts/thumbnail.py output.pptx workspace/thumbnails --cols 4
```

### Layout Tips
- **Two-column (PREFERRED)**: Header full width, then text + content columns
- **Full-slide**: Featured content takes entire slide
- **NEVER vertically stack** charts/tables below text

**Reference:** See `references/creation-workflow.md` for color palettes and visual details

---

## Editing Existing Presentations

### Workflow
1. **MANDATORY**: Read `ooxml.md` (~500 lines) completely
2. Unpack: `python ooxml/scripts/unpack.py <file> <output_dir>`
3. Edit XML files (primarily `ppt/slides/slide{N}.xml`)
4. **CRITICAL**: Validate after each edit: `python ooxml/scripts/validate.py <dir> --original <file>`
5. Pack: `python ooxml/scripts/pack.py <input_dir> <file>`

**Reference:** See `references/editing-workflow.md`

---

## Using Templates

### Workflow Overview
1. Extract template text + create thumbnails
2. Analyze template and save inventory
3. Create presentation outline with template mapping
4. Duplicate/reorder slides: `python scripts/rearrange.py template.pptx working.pptx 0,34,34,50`
5. Extract text inventory: `python scripts/inventory.py working.pptx text-inventory.json`
6. Generate replacement text JSON
7. Apply replacements: `python scripts/replace.py working.pptx replacement-text.json output.pptx`

**Reference:** See `references/template-workflow.md` for complete details

---

## Creating Thumbnail Grids

```bash
python scripts/thumbnail.py template.pptx [output_prefix]
```

- Creates: `thumbnails.jpg` (or multiple for large decks)
- Default: 5 columns, max 30 slides per grid
- Custom columns: `--cols 4` (range: 3-6)
- Slides are zero-indexed

---

## Reference Files

- `references/creation-workflow.md` - Design principles, color palettes, visual details, html2pptx workflow
- `references/editing-workflow.md` - OOXML editing, file structures, typography extraction
- `references/template-workflow.md` - Template-based creation, inventory, replacement process
- `references/html2pptx.md` - Routing page for HTML authoring, raster assets, converter API, and PptxGenJS post-processing

---

## Dependencies

- **markitdown-converter**: `pip install "markitdown[pptx]"` (text extraction)
- **pptxgenjs**: `npm install -g pptxgenjs` (creating presentations)
- **playwright**: `npm install -g playwright` (HTML rendering)
- **react-icons**: `npm install -g react-icons react react-dom` (icons)
- **sharp**: `npm install -g sharp` (SVG rasterization)
