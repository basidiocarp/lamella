# Progressive Disclosure Patterns

SKILL.md serves as an overview that points Claude to detailed materials as needed, like a table of contents in an onboarding guide.

**Practical guidance:**

- Keep SKILL.md body under 500 lines for optimal performance
- Split content into separate files when approaching this limit
- Use the patterns below to organize instructions, code, and resources effectively

## Visual overview: From simple to complex

A basic Skill starts with just a SKILL.md file containing metadata and instructions.

As your Skill grows, you can bundle additional content that Claude loads only when needed.

The complete Skill directory structure might look like this:

```
pdf/
├── SKILL.md              # Main instructions (loaded when triggered)
├── FORMS.md              # Form-filling guide (loaded as needed)
├── reference.md          # API reference (loaded as needed)
├── examples.md           # Usage examples (loaded as needed)
└── scripts/
    ├── analyze_form.py   # Utility script (executed, not loaded)
    ├── fill_form.py      # Form filling script
    └── validate.py       # Validation script
```

## Pattern 1: High-level guide with references

<!-- Example SKILL.md showing the pattern - file paths are illustrative -->
````markdown
---
name: PDF Processing
description: Extracts text and tables from PDF files, fills forms, and merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---

# PDF Processing

## Quick start

Extract text with pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Advanced features

**Form filling**: See `FORMS.md` for complete guide
**API reference**: See `REFERENCE.md` for all methods
**Examples**: See `EXAMPLES.md` for common patterns
````

Claude loads FORMS.md, REFERENCE.md, or EXAMPLES.md only when needed.

## Pattern 2: Domain-specific organization

For Skills with multiple domains, organize content by domain to avoid loading irrelevant context. When a user asks about sales metrics, Claude only needs to read sales-related schemas, not finance or marketing data. This keeps token usage low and context focused.

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

````markdown
# BigQuery Data Analysis

## Available datasets

**Finance**: Revenue, ARR, billing → See `reference/finance.md`
**Sales**: Opportunities, pipeline, accounts → See `reference/sales.md`
**Product**: API usage, features, adoption → See `reference/product.md`
**Marketing**: Campaigns, attribution, email → See `reference/marketing.md`

## Quick search

Find specific metrics using grep:

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

## Pattern 3: Conditional details

Show basic content, link to advanced content:

```markdown
# DOCX Processing

## Creating documents

Use docx-js for new documents. See `DOCX-JS.md`.

## Editing documents

For simple edits, modify the XML directly.

**For tracked changes**: See `REDLINING.md`
**For OOXML details**: See `OOXML.md`
```

Claude reads REDLINING.md or OOXML.md only when the user needs those features.

## Avoid deeply nested references

Claude may partially read files when they're referenced from other referenced files. When encountering nested references, Claude might use commands like `head -100` to preview content rather than reading entire files, resulting in incomplete information.

**Keep references one level deep from SKILL.md**. All reference files should link directly from SKILL.md to ensure Claude reads complete files when needed.

**Bad example: Too deep**:

```markdown
# SKILL.md
See `advanced.md`...

# advanced.md
See `details.md`...

# details.md
Here's the actual information...
```

**Good example: One level deep**:

```markdown
# SKILL.md

**Basic usage**: [instructions in SKILL.md]
**Advanced features**: See `advanced.md`
**API reference**: See `reference.md`
**Examples**: See `examples.md`
```

## Structure longer reference files with table of contents

For reference files longer than 100 lines, include a table of contents at the top. This ensures Claude can see the full scope of available information even when previewing with partial reads.

**Example**:

```markdown
# API Reference

## Contents
- Authentication and setup
- Core methods (create, read, update, delete)
- Advanced features (batch operations, webhooks)
- Error handling patterns
- Code examples

## Authentication and setup
...

## Core methods
...
```

Claude can then read the complete file or jump to specific sections as needed.
