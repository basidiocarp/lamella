# Relationships, Links, and Images

Use this reference when a DOCX edit touches media, hyperlinks, or support files
outside `document.xml`.

## Files Commonly Updated

- `word/_rels/document.xml.rels`
- `[Content_Types].xml`
- `word/media/*`
- `word/styles.xml` for hyperlink styling

## Relationship Example

```xml
<Relationship
  Id="rId5"
  Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image"
  Target="media/image1.png"
/>
```

## Content Types Example

```xml
<Default Extension="png" ContentType="image/png" />
<Override
  PartName="/word/numbering.xml"
  ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"
/>
```

## Hyperlinks

External links need a relationship entry plus the `Hyperlink` run style.

```xml
<w:hyperlink r:id="rId5">
  <w:r>
    <w:rPr><w:rStyle w:val="Hyperlink" /></w:rPr>
    <w:t>Open example</w:t>
  </w:r>
</w:hyperlink>
```

Internal links use bookmarks:

```xml
<w:bookmarkStart w:id="0" w:name="target" />
<w:r><w:t>Target content</w:t></w:r>
<w:bookmarkEnd w:id="0" />
```

```xml
<w:hyperlink w:anchor="target">
  <w:r>
    <w:rPr><w:rStyle w:val="Hyperlink" /></w:rPr>
    <w:t>Jump to target</w:t>
  </w:r>
</w:hyperlink>
```

## Images

- copy image files into `word/media/`
- add a relationship entry
- ensure the content type is declared
- keep image dimensions within the page box to avoid overflow

If you are doing image insertion programmatically, prefer the `Document` helper
workflow instead of hand-writing the full drawing tree.
