# Slide Relationships and Package Updates

Use this reference when slide files are added, removed, or reordered.

## Files That Usually Change Together

- `ppt/presentation.xml`
- `ppt/_rels/presentation.xml.rels`
- `ppt/slides/slideN.xml`
- `ppt/slides/_rels/slideN.xml.rels`
- `[Content_Types].xml`
- optionally `docProps/app.xml`

## Add a Slide

1. create `ppt/slides/slideN.xml`
2. add the slide override in `[Content_Types].xml`
3. add the relationship in `ppt/_rels/presentation.xml.rels`
4. add the slide id entry in `ppt/presentation.xml`
5. create the slide `.rels` file if the slide uses media or a layout

## Reorder a Slide

Reorder `<p:sldId>` entries in `ppt/presentation.xml`. Keep slide filenames,
relationship ids, and slide ids stable.

## Delete a Slide

Remove the slide entry from `presentation.xml`, its relationship from
`presentation.xml.rels`, its override from `[Content_Types].xml`, and the slide
files themselves. Then clean up orphaned media.

## Practical Rule

Do not renumber surviving slide files just to make numbering look tidy. Stable
ids are safer than cosmetic renaming.
