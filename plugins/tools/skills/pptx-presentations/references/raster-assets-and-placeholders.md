# Raster Assets and Placeholders

Use this reference when the slide design depends on gradients, icons, or
reserved layout slots for post-processing.

## Rasterize Visual Effects First

Do not leave CSS gradients or runtime SVG icon rendering in the HTML input.
Create PNG assets first, then reference them from `<img>` tags or background
images.

## Placeholder Pattern

Reserve chart or media regions with a dedicated placeholder box:

```html
<div class="placeholder" id="chart-area" style="width: 280pt; height: 180pt;"></div>
```

After conversion, match by `id`:

```javascript
const chartArea = placeholders.find((p) => p.id === "chart-area");
slide.addChart(pptx.charts.LINE, series, { ...chartArea, chartColors: ["4472C4"] });
```

## Rasterizing Icons

```javascript
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

async function rasterizeIcon(Component, color, size, outputPath) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Component, { color, size })
  );

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  return outputPath;
}
```

## Rasterizing Gradients

```javascript
const sharp = require("sharp");

async function createGradientPng(outputPath) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="563">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
    </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  return outputPath;
}
```

## Asset Checklist

- rasterize gradients before rendering HTML
- rasterize custom icons before rendering HTML
- keep placeholder IDs unique
- keep placeholder boxes close to their final aspect ratio
- verify the final deck with thumbnails after adding post-processed content
