---
name: docx-word-documents
description: "Creates, reads, and edits Word documents (.docx)."
origin: lamella
---

# DOCX creation, editing, and analysis


## Contents

- [Overview](#overview)
- [Quick Reference](#quick-reference)
- [Creating New Documents](#creating-new-documents)
- [Editing Existing Documents](#editing-existing-documents)
- [Reference Files](#reference-files)
- [Dependencies](#dependencies)


## Overview

A .docx file is a ZIP archive containing XML files.

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyze content | `pandoc` or unpack for raw XML |
| Create new document | Use `docx-js` - see Creating New Documents |
| Edit existing document | Unpack → edit XML → repack |

### Converting .doc to .docx

```bash
python scripts/office/soffice.py --headless --convert-to docx document.doc
```

### Reading Content

```bash
# Text extraction with tracked changes
pandoc --track-changes=all document.docx -o output.md

# Raw XML access
python scripts/office/unpack.py document.docx unpacked/
```

### Converting to Images

```bash
python scripts/office/soffice.py --headless --convert-to pdf document.docx
pdftoppm -jpeg -r 150 document.pdf page
```

### Accepting Tracked Changes

```bash
python scripts/accept_changes.py input.docx output.docx
```

---

## Creating New Documents

Generate .docx files with JavaScript. Install: `npm install -g docx`

### Basic Setup

```javascript
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, BorderStyle, WidthType, ShadingType } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));
```

### Validation

```bash
python scripts/office/validate.py doc.docx
```

### Critical Rules for docx-js

- **Set page size explicitly** - defaults to A4; use US Letter (12240 x 15840 DXA)
- **Never use `\n`** - use separate Paragraph elements
- **Never use unicode bullets** - use `LevelFormat.BULLET`
- **PageBreak must be in Paragraph**
- **ImageRun requires `type`** (png, jpg, etc.)
- **Always use `WidthType.DXA`** for tables - never PERCENTAGE
- **Tables need dual widths** - `columnWidths` AND cell `width`
- **Use `ShadingType.CLEAR`** - never SOLID
- **TOC requires HeadingLevel only**
- **Include `outlineLevel`** for TOC (0 for H1, 1 for H2)

**Reference:** See `references/docx-js-guide.md` for complete examples

---

## Editing Existing Documents

**Follow all 3 steps in order.**

### Step 1: Unpack
```bash
python scripts/office/unpack.py document.docx unpacked/
```

### Step 2: Edit XML

Edit files in `unpacked/word/`. Use "Claude" as the author for tracked changes.

**CRITICAL: Use smart quotes for new content:**
| Entity | Character |
|--------|-----------|
| `&#x2018;` | ' (left single) |
| `&#x2019;` | ' (right single/apostrophe) |
| `&#x201C;` | " (left double) |
| `&#x201D;` | " (right double) |

**Adding comments:**
```bash
python scripts/comment.py unpacked/ 0 "Comment text"
python scripts/comment.py unpacked/ 1 "Reply" --parent 0
```

### Step 3: Pack
```bash
python scripts/office/pack.py unpacked/ output.docx --original document.docx
```

**Auto-repair fixes:** `durableId` issues, missing `xml:space="preserve"`

**Auto-repair won't fix:** Malformed XML, invalid nesting, missing relationships

### Common Pitfalls

- **Replace entire `<w:r>` elements** when adding tracked changes
- **Preserve `<w:rPr>` formatting** - copy original run's formatting

**Reference:** See `references/editing-workflow.md` and `references/xml-reference.md`

---

## Reference Files

- `references/docx-js-guide.md` - Complete docx-js examples: page size, styles, lists, tables, images, hyperlinks, headers/footers
- `references/xml-reference.md` - Schema compliance, tracked changes, comments, images
- `references/editing-workflow.md` - Detailed unpack/edit/pack workflow
- `references/ooxml.md` - Routing page for schema patterns, relationships, document helper usage, and tracked changes

---

## Dependencies

- **pandoc**: Text extraction
### Additional Resources

- [Docx Js](references/docx-js.md)
- [Ooxml](references/ooxml.md)

| File | Path |
|------|------|
| [  Init  ](scripts/__init__.py) | `scripts/__init__.py` |
| [Document](scripts/document.py) | `scripts/document.py` |
| [Comments](scripts/templates/comments.xml) | `scripts/templates/comments.xml` |
| [Commentsextended](scripts/templates/commentsExtended.xml) | `scripts/templates/commentsExtended.xml` |
| [Commentsextensible](scripts/templates/commentsExtensible.xml) | `scripts/templates/commentsExtensible.xml` |
| [Commentsids](scripts/templates/commentsIds.xml) | `scripts/templates/commentsIds.xml` |
| [People](scripts/templates/people.xml) | `scripts/templates/people.xml` |
| [Utilities](scripts/utilities.py) | `scripts/utilities.py` |
