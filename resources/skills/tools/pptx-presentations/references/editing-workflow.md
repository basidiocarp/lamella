# PPTX Editing Workflow

To edit slides in an existing PowerPoint presentation, work with raw Office Open XML (OOXML) format.

## Workflow Steps

1. **MANDATORY - READ ENTIRE FILE**: Read `ooxml.md` (~500 lines) completely
2. Unpack the presentation: `python ooxml/scripts/unpack.py <office_file> <output_dir>`
3. Edit the XML files (primarily `ppt/slides/slide{N}.xml`)
4. **CRITICAL**: Validate immediately after each edit: `python ooxml/scripts/validate.py <dir> --original <file>`
5. Pack the final presentation: `python ooxml/scripts/pack.py <input_directory> <office_file>`

---

## Key File Structures

* `ppt/presentation.xml` - Main presentation metadata and slide references
* `ppt/slides/slide{N}.xml` - Individual slide contents
* `ppt/notesSlides/notesSlide{N}.xml` - Speaker notes for each slide
* `ppt/comments/modernComment_*.xml` - Comments for specific slides
* `ppt/slideLayouts/` - Layout templates
* `ppt/slideMasters/` - Master slide templates
* `ppt/theme/` - Theme and styling information
* `ppt/media/` - Images and other media files

---

## Typography and Color Extraction

**When given an example design to emulate**, analyze first:

1. **Read theme file**: Check `ppt/theme/theme1.xml` for colors (`<a:clrScheme>`) and fonts (`<a:fontScheme>`)
2. **Sample slide content**: Examine `ppt/slides/slide1.xml` for actual font usage (`<a:rPr>`) and colors
3. **Search for patterns**: Use grep to find color (`<a:solidFill>`, `<a:srgbClr>`) and font references

---

## Reading and Analyzing Content

### Text Extraction
```bash
python -m markitdown path-to-file.pptx
```

### Raw XML Access
Required for: comments, speaker notes, slide layouts, animations, design elements.

```bash
python ooxml/scripts/unpack.py <office_file> <output_dir>
```

**Note**: The unpack.py script is at `skills/pptx/ooxml/scripts/unpack.py`. Use `find . -name "unpack.py"` if needed.
