---
name: xlsx-spreadsheets
description: "Creates, edits, and analyzes Excel spreadsheets and CSV files."
origin: lamella
---

# XLSX Creation, Editing, and Analysis

Use this skill when creating or modifying spreadsheets programmatically.

## Core Rules

1. prefer formulas over hardcoded calculated values
2. preserve existing workbook conventions when editing a template
3. verify recalculation before delivery
4. keep financial-model formatting explicit when the workbook is finance-facing

## Tool Selection

| Task | Preferred tool |
|------|----------------|
| analysis and tabular transforms | `pandas` |
| formulas, styles, workbook edits | `openpyxl` |

## Core Workflow

1. choose `pandas` or `openpyxl` based on whether structure or workbook behavior matters
2. create or edit the workbook
3. express calculations as Excel formulas
4. save and recalculate
5. inspect for formula errors before delivering the file

## Recalculation

```shell
python recalc.py output.xlsx
```

## Guardrails

- no `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or similar formula errors
- use assumptions cells instead of burying constants in formulas
- match the template’s established style instead of “standardizing” it by accident
