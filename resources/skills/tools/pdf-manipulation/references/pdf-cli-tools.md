# PDF CLI Tools

Use CLI tools when you want direct extraction, repair, or page operations
without writing much code.

## poppler-utils

### Text Extraction

```bash
pdftotext input.pdf output.txt
pdftotext -layout input.pdf layout.txt
pdftotext -bbox-layout input.pdf layout.xml
```

### Images

```bash
pdftoppm -png -r 300 input.pdf page
pdfimages -all input.pdf images/img
pdfimages -list input.pdf
```

## qpdf

### Split, Merge, and Extract

```bash
qpdf --split-pages=3 input.pdf group_%02d.pdf
qpdf input.pdf --pages input.pdf 1,3-5,8,10-end -- extracted.pdf
qpdf --empty --pages a.pdf 1-3 b.pdf 4-6 -- combined.pdf
```

### Repair and Optimization

```bash
qpdf --check broken.pdf
qpdf --linearize input.pdf optimized.pdf
qpdf --show-all-pages input.pdf > structure.txt
```

### Encryption

```bash
qpdf --encrypt user_pass owner_pass 256 --print=none --modify=none -- input.pdf encrypted.pdf
qpdf --show-encryption encrypted.pdf
qpdf --password=secret123 --decrypt encrypted.pdf decrypted.pdf
```

## When CLI Wins

- quick page extraction
- bulk image export
- repair and encryption inspection
- scripting in shell pipelines
