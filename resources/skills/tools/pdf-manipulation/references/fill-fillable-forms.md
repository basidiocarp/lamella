# Fill Fillable PDF Forms

Use this workflow when the PDF already contains real form fields.

## Flow

1. check whether the PDF has fillable fields
2. extract field metadata into JSON
3. inspect the rendered pages if field purpose is unclear
4. prepare `field_values.json`
5. run the fill script
6. correct invalid field ids or values and rerun

## Required Inputs

The fill script needs field ids that match the extracted metadata exactly. For
checkboxes and radio buttons, use the supported field value from the extracted
field info instead of inventing one.

## Practical Rule

Treat the extracted field metadata as the source of truth. If the fill script
rejects a field id or option value, fix the JSON instead of forcing the write.
