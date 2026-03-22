# PPTX Template-Based Creation Workflow

## Step-by-Step Process

### 1. Extract Template Text AND Create Visual Thumbnail Grid

```bash
# Extract text
python -m markitdown template.pptx > template-content.md

# Create thumbnail grids
python scripts/thumbnail.py template.pptx
```

### 2. Analyze Template and Save Inventory

Create `template-inventory.md`:
```markdown
# Template Inventory Analysis
**Total Slides: [count]**
**IMPORTANT: Slides are 0-indexed (first slide = 0, last slide = count-1)**

## [Category Name]
- Slide 0: [Layout code if available] - Description/purpose
- Slide 1: [Layout code] - Description/purpose
[... EVERY slide must be listed ...]
```

Reference thumbnails to identify:
- Layout patterns (title slides, content layouts, section dividers)
- Image placeholder locations
- Design consistency
- Visual hierarchy

### 3. Create Presentation Outline

- Choose intro/title template for first slide
- Choose safe, text-based layouts for other slides
- **CRITICAL: Match layout structure to actual content**:
  - Single-column: Use for unified narrative
  - Two-column: Use ONLY when there are exactly 2 items
  - Three-column: Use ONLY when there are exactly 3 items
  - Image + text: Use ONLY when images are available
  - Quote layouts: Use ONLY for actual quotes with attribution

Save `outline.md` with template mapping:
```python
template_mapping = [
    0,   # Use slide 0 (Title/Cover)
    34,  # Use slide 34 (B1: Title and body)
    34,  # Use slide 34 again (duplicate)
    50,  # Use slide 50 (E1: Quote)
    54,  # Use slide 54 (F2: Closing + Text)
]
```

### 4. Duplicate, Reorder, and Delete Slides

```bash
python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
```

### 5. Extract ALL Text Using Inventory Script

```bash
python scripts/inventory.py working.pptx text-inventory.json
```

Inventory JSON structure:
```json
{
  "slide-0": {
    "shape-0": {
      "placeholder_type": "TITLE",
      "left": 1.5,
// ... (14 lines trimmed)
    }
  }
}
```

### 6. Generate Replacement Text

Create `replacement-text.json`:
```json
{
  "slide-0": {
    "shape-0": {
      "paragraphs": [
        {
// ... (10 lines trimmed)
    }
  }
}
```

**Rules**:
- Include paragraph properties from original inventory
- When `bullet: true`, do NOT include bullet symbols in text
- Headers should typically have `"bold": true`
- Shapes not in JSON are automatically cleared

### 7. Apply Replacements

```bash
python scripts/replace.py working.pptx replacement-text.json output.pptx
```

---

## Creating Thumbnail Grids

```bash
python scripts/thumbnail.py template.pptx [output_prefix]
```

**Features**:
- Creates: `thumbnails.jpg` (or `thumbnails-1.jpg`, etc.)
- Default: 5 columns, max 30 slides per grid
- Custom columns: `--cols 4` (range: 3-6)
- Slides are zero-indexed

---

## Converting Slides to Images

```bash
# Convert PPTX to PDF
soffice --headless --convert-to pdf template.pptx

# Convert PDF pages to JPEG
pdftoppm -jpeg -r 150 template.pdf slide
```

Options:
- `-r 150`: Resolution (150 DPI)
- `-f N -l N`: First/last page range
