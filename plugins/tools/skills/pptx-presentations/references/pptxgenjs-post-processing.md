# PptxGenJS Post-Processing

Use this reference after `html2pptx` has created the slide shell.

## Color Rule

In PptxGenJS, use hex colors without `#`.

- correct: `"4472C4"`
- wrong: `"#4472C4"`

## Images

```javascript
const imgWidth = 1860;
const imgHeight = 1519;
const aspect = imgWidth / imgHeight;
const h = 3;
const w = h * aspect;
const x = (10 - w) / 2;

slide.addImage({ path: "chart.png", x, y: 1.5, w, h });
```

## Rich Text

```javascript
slide.addText(
  [
    { text: "Bold ", options: { bold: true } },
    { text: "Italic ", options: { italic: true } },
    { text: "Normal" }
  ],
  { x: 1, y: 2, w: 8, h: 1 }
);
```

## Common Charts

Use a single series for simple bar and line charts:

```javascript
slide.addChart(
  pptx.charts.BAR,
  [{ name: "Sales", labels: ["Q1", "Q2", "Q3"], values: [10, 18, 22] }],
  {
    x: 0.8,
    y: 1.4,
    w: 4.8,
    h: 2.6,
    catAxisTitle: "Quarter",
    valAxisTitle: "Revenue",
    chartColors: ["4472C4"]
  }
);
```

Pie charts still use a single series, but the categories live in `labels`.

## Tables

```javascript
slide.addTable(
  [
    ["Product", "Revenue", "Growth"],
    ["Core", "$4.2M", "18%"],
    ["Expansion", "$1.3M", "26%"]
  ],
  {
    x: 0.8,
    y: 4.4,
    w: 8.4,
    border: { pt: 1, color: "D1D5DB" },
    fill: { color: "F8FAFC" }
  }
);
```

## Final Review

- confirm colors omit `#`
- confirm charts fit the placeholder aspect ratio
- confirm tables are legible at slide scale
- regenerate thumbnails and inspect the whole deck
