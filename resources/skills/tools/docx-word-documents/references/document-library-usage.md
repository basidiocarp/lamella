# Document Library Usage

Use the `Document` helper from `scripts/document.py` for tracked changes,
comments, and infrastructure-aware OOXML edits.

## Setup

Find the skill root that contains `scripts/document.py`, then run with
`PYTHONPATH` pointed at that root.

```bash
PYTHONPATH=/path/to/docx-skill python your_script.py
```

## Import and Initialize

```python
from scripts.document import Document, DocxXMLEditor

doc = Document("unpacked")
```

The helper manages temporary working paths, RSIDs, comment scaffolding, and
related support files automatically.

## Basic Edit Pattern

```python
node = doc["word/document.xml"].get_node(tag="w:r", contains="monthly")

replacement = (
    '<w:del><w:r><w:delText>monthly</w:delText></w:r></w:del>'
    '<w:ins><w:r><w:t>quarterly</w:t></w:r></w:ins>'
)

doc["word/document.xml"].replace_node(node, replacement)
doc.save()
```

## Finding Nodes

```python
para = doc["word/document.xml"].get_node(tag="w:p", contains="Executive Summary")
run = doc["word/document.xml"].get_node(tag="w:r", line_number=range(2400, 2500))
```

Use a line range when text appears multiple times.

## Direct DOM Access

Drop to direct DOM only when the helper lacks the required operation.

```python
editor = doc["word/document.xml"]
dom = editor.dom
```

If you need repeated manual DOM operations, that is usually a sign the change
should be wrapped in a helper instead.
