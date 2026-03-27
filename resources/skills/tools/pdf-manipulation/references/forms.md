# PDF Form Filling

Use this file as the routing page for PDF form completion workflows.

## Open These References By Task

1. [fill-fillable-forms.md](./fill-fillable-forms.md)
   Use when the PDF contains real form fields that can be extracted and filled
   programmatically.
2. [fill-non-fillable-forms.md](./fill-non-fillable-forms.md)
   Use when the PDF is only visually structured and values must be placed by
   bounding boxes and annotations.

## First Step

Always determine which type of PDF you have before writing any filling code.

## Practical Rule

Do not guess. A fillable form and a visually structured non-fillable form need
different workflows, different validation, and different failure modes.
