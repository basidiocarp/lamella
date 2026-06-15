---
name: excalidraw-diagram-generator
description: "Generates Excalidraw diagrams as .excalidraw JSON files."
origin: lamella
---

# Excalidraw Diagram Generator

Generate `.excalidraw` JSON files from descriptions.

## File Structure

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "https://excalidraw.com",
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": 20
  },
  "files": {}
}
```

## Critical Rules

- **All text elements must use `fontFamily: 5`** (Excalifont). No exceptions.
- Element types: `rectangle`, `ellipse`, `diamond`, `arrow`, `text`
- All elements need unique IDs
- Max ~20 elements per diagram. Split if larger.

## Layout

- Horizontal gap: 200-300px between elements
- Vertical gap: 100-150px between rows
- Text size: 16-24px
- Color palette:
  - Primary: `#a5d8ff` (light blue)
  - Secondary: `#b2f2bb` (light green)
  - Emphasis: `#ffd43b` (yellow)
  - Warning: `#ffc9c9` (light red)

## Icon Libraries

For architecture diagrams with professional icons (AWS, GCP, etc.):

**Check availability:** Look for `libraries/<library-name>/reference.md`

**If library not set up**, tell user:
1. Download `.excalidrawlib` from https://libraries.excalidraw.com/
2. Place in `libraries/<name>/`
3. Run splitter:
   ```bash
   python scripts/split-excalidraw-library.py libraries/<name>/
   ```
   This generates `reference.md` (icon lookup) and `icons/` (individual JSON files).

**If library exists**, use Python scripts (avoids loading large icon JSON into context):

```bash
# Add icon at position with label
python scripts/add-icon-to-diagram.py <diagram> <icon-name> <x> <y> [--label "Text"] [--library-path PATH]

# Add arrow between points
python scripts/add-arrow.py <diagram> <from-x> <from-y> <to-x> <to-y> [--label "Text"] [--style solid|dashed|dotted] [--color HEX]
```

Both scripts write to `.excalidraw.edit` by default. Pass `--no-use-edit-suffix` to write directly.

**Example workflow:**
```bash
# 1. Create base .excalidraw file with title/structure
# 2. Add icons
python scripts/add-icon-to-diagram.py diagram.excalidraw EC2 400 300 --label "Web Server"
python scripts/add-icon-to-diagram.py diagram.excalidraw RDS 600 300 --label "Database"
# 3. Connect them
python scripts/add-arrow.py diagram.excalidraw 450 330 600 330 --label "SQL" --style dashed
```

Without icon libraries, use basic shapes with color coding and labels.

## Opening

- https://excalidraw.com — drag and drop file
- VS Code Excalidraw extension

## References

- [references/excalidraw-schema.md](references/excalidraw-schema.md) — JSON schema
- [references/element-types.md](references/element-types.md) — element specs
- `templates/*.excalidraw` — starter templates (flowchart, relationship, mindmap, class, sequence, ER, DFD, swimlane)
- `scripts/README.md` — script documentation
### Additional Resources


| File | Path |
|------|------|
| [Business Flow Swimlane Template](assets/business-flow-swimlane-template.excalidraw) | `assets/business-flow-swimlane-template.excalidraw` |
| [Class Diagram Template](assets/class-diagram-template.excalidraw) | `assets/class-diagram-template.excalidraw` |
| [Data Flow Diagram Template](assets/data-flow-diagram-template.excalidraw) | `assets/data-flow-diagram-template.excalidraw` |
| [Er Diagram Template](assets/er-diagram-template.excalidraw) | `assets/er-diagram-template.excalidraw` |
| [Flowchart Template](assets/flowchart-template.excalidraw) | `assets/flowchart-template.excalidraw` |
| [Mindmap Template](assets/mindmap-template.excalidraw) | `assets/mindmap-template.excalidraw` |
| [Relationship Template](assets/relationship-template.excalidraw) | `assets/relationship-template.excalidraw` |
| [Sequence Diagram Template](assets/sequence-diagram-template.excalidraw) | `assets/sequence-diagram-template.excalidraw` |
