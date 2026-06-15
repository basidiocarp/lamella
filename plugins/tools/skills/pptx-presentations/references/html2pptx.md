# HTML to PowerPoint Guide

Use this file as the routing layer for the `html2pptx` workflow. Read it first,
then open the focused references that match the step you are working on.

## Use This Workflow When

- you are creating a new deck from HTML slides
- you need accurate slide positioning from rendered HTML
- you plan to add charts, tables, or dynamic elements with PptxGenJS after the
  HTML pass

## Core Rules

- Match the HTML body dimensions to the target slide layout.
- Keep visible text inside semantic text tags such as `<p>`, headings, or
  lists. Text sitting directly in `<div>` or `<span>` will not render
  reliably.
- Use web-safe fonts only.
- Do not rely on CSS gradients or vector icon pipelines at render time.
  Pre-render those assets to PNG first.
- Use `class="placeholder"` only for areas that will be filled later with
  charts or dynamic content.
- When you move into PptxGenJS, use hex colors without the `#` prefix.

## Recommended Reading Order

1. [html-slide-authoring.md](./html-slide-authoring.md)
   Use for layout dimensions, supported elements, text rules, and authoring the
   HTML slide itself.
2. [raster-assets-and-placeholders.md](./raster-assets-and-placeholders.md)
   Use for gradients, icons, placeholder boxes, and preparing raster assets.
3. [html2pptx-api.md](./html2pptx-api.md)
   Use when wiring the conversion script, handling validation, and consuming
   returned placeholders.
4. [pptxgenjs-post-processing.md](./pptxgenjs-post-processing.md)
   Use when adding charts, tables, images, or extra slide content after
   conversion.

## Minimal End-to-End Example

```javascript
const pptxgen = require("pptxgenjs");
const html2pptx = require("./html2pptx");

async function buildDeck() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";

  const { slide, placeholders } = await html2pptx("slide-01.html", pptx);

  if (placeholders.length) {
    slide.addChart(
      pptx.charts.BAR,
      [{ name: "Sales", labels: ["Q1", "Q2"], values: [12, 19] }],
      { ...placeholders[0], chartColors: ["4472C4"] }
    );
  }

  await pptx.writeFile("output.pptx");
}

buildDeck().catch(console.error);
```

## Validation Checklist

- HTML body dimensions match the deck layout.
- Text is wrapped in supported text elements.
- No CSS gradients are left in the HTML.
- Placeholder IDs are unique and meaningful.
- PptxGenJS colors omit the `#` prefix.
- The generated deck is rendered to thumbnails for visual review.
