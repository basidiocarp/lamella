# Text and Formatting

Use this reference when editing text content inside PPTX slide XML.

## Text Body Order

Inside `<p:txBody>`, keep the required order:

```xml
<p:txBody>
  <a:bodyPr/>
  <a:lstStyle/>
  <a:p>...</a:p>
</p:txBody>
```

## Text Runs

Use runs for inline formatting and preserve whitespace when needed.

```xml
<a:r>
  <a:rPr b="1" dirty="0"/>
  <a:t xml:space="preserve"> Bold text </a:t>
</a:r>
```

## Lists

Bullet and indentation settings live on `<a:pPr>`:

```xml
<a:p>
  <a:pPr lvl="0">
    <a:buChar char="•"/>
  </a:pPr>
  <a:r>
    <a:t>First bullet</a:t>
  </a:r>
</a:p>
```

## Practical Rules

- Add `dirty="0"` to run properties for clean generated content.
- Preserve leading or trailing spaces with `xml:space="preserve"`.
- Keep paragraph, run, and end-para formatting internally consistent.
