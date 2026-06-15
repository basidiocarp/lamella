# html2pptx API

Use this reference when wiring the conversion script itself.

## Dependencies

- `pptxgenjs`
- `playwright`
- `sharp`

## Function Signature

```javascript
await html2pptx(htmlFile, pres, options)
```

## Parameters

- `htmlFile`: path to the HTML slide file
- `pres`: a configured `PptxGenJS` presentation instance
- `options.tmpDir`: optional temp directory override
- `options.slide`: optional existing slide to reuse

## Return Shape

```javascript
{
  slide,
  placeholders: [{ id, x, y, w, h }]
}
```

## Minimal Usage

```javascript
const pptxgen = require("pptxgenjs");
const html2pptx = require("./html2pptx");

async function convertOneSlide() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";

  const result = await html2pptx("slide.html", pptx, { tmpDir: "/tmp/html2pptx" });
  console.log(result.placeholders);

  await pptx.writeFile("output.pptx");
}
```

## Validation Behavior

The converter should fail fast on:

- layout dimension mismatch
- content overflow
- unsupported CSS gradients
- unsupported style usage on text elements

Treat those errors as authoring failures, not presentation-library failures.

## Placeholder Workflow

```javascript
const { slide, placeholders } = await html2pptx("slide.html", pptx);
const chartArea = placeholders.find((p) => p.id === "revenue-chart");

if (chartArea) {
  slide.addChart(
    pptx.charts.BAR,
    [{ name: "Revenue", labels: ["Q1", "Q2"], values: [14, 21] }],
    { ...chartArea, chartColors: ["4472C4"] }
  );
}
```
