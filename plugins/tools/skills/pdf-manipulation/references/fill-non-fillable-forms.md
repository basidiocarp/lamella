# Fill Non-Fillable PDF Forms

Use this workflow when the PDF has no real form fields and values must be
placed visually.

## Flow

1. convert each page to images
2. identify label boxes and entry boxes
3. create `fields.json`
4. generate validation images
5. run automated and manual bounding-box checks
6. fill the PDF using annotations

## Bounding Box Rules

- label and entry boxes must not intersect
- entry boxes should contain only the writable area
- checkbox entry boxes should cover only the square, not the label text

## Validation Rule

Do not skip the validation images. Manual inspection is required because a
numerically valid box can still be visually wrong.
