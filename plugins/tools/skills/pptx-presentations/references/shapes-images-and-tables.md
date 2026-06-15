# Shapes, Images, and Tables

Use this reference for slide content beyond plain text.

## Shapes

Basic shapes live under `<p:sp>` and geometry under `<a:prstGeom>`.

```xml
<p:sp>
  <p:nvSpPr>
    <p:cNvPr id="3" name="Rectangle"/>
    <p:cNvSpPr/>
    <p:nvPr/>
  </p:nvSpPr>
  <p:spPr>
    <a:prstGeom prst="rect">
      <a:avLst/>
    </a:prstGeom>
  </p:spPr>
</p:sp>
```

## Images

Images require both media placement and relationship wiring:

- put the binary in `ppt/media/`
- add an image relationship in the slide’s `.rels` file
- reference that relationship from the `<p:pic>` element

## Tables

Tables live in `<p:graphicFrame>` and must carry the expected table structure
inside `<a:graphicData>`.

## Practical Rule

When inserting images or tables, update both the slide XML and the related
package metadata in the same change.
