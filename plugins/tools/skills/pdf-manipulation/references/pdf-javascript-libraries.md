# PDF JavaScript Libraries

Use JavaScript libraries when the workflow is browser-based or part of a Node
toolchain.

## pdf-lib

Use `pdf-lib` for creating or modifying documents in Node or browser contexts.

```javascript
import { PDFDocument } from "pdf-lib";
import fs from "fs";

async function mergePDFs() {
  const merged = await PDFDocument.create();

  for (const file of ["one.pdf", "two.pdf"]) {
    const src = await PDFDocument.load(fs.readFileSync(file));
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  fs.writeFileSync("merged.pdf", await merged.save());
}
```

## pdfjs-dist

Use PDF.js when you need rendering, coordinate-aware text extraction, or browser
annotation inspection.

```javascript
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.js";

async function renderFirstPage() {
  const pdf = await pdfjsLib.getDocument("document.pdf").promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.25 });
  return viewport;
}
```

## Selection Guide

- programmatic PDF creation and modification: `pdf-lib`
- browser rendering and inspection: `pdfjs-dist`
- form filling that must preserve structure: prefer `pdf-lib`
