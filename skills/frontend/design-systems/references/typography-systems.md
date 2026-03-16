# Typography Systems Reference

## Type Scale Construction

### Modular Scale

A modular scale creates harmonious relationships between font sizes using a mathematical ratio.

```tsx
// Common ratios
const RATIOS = {
  minorSecond: 1.067, // 16:15
  majorSecond: 1.125, // 9:8
  minorThird: 1.2, // 6:5
// ... (19 lines trimmed)
// Generate a scale with 16px base and perfect fourth ratio
const typeScale = generateScale(16, RATIOS.perfectFourth, 6);
// Result: [9, 12, 16, 21.33, 28.43, 37.9, 50.52, 67.34, 89.76]
```

### CSS Custom Properties

```css
:root {
  /* Base scale using perfect fourth (1.333) */
  --font-size-2xs: 0.563rem; /* ~9px */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
// ... (27 lines trimmed)
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

## Font Loading Strategies

### FOUT Prevention

```css
/* Use font-display to control loading behavior */
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Variable.woff2") format("woff2-variations");
  font-weight: 100 900;
// ... (14 lines trimmed)
body {
  font-family: "Inter", "Inter Fallback", system-ui, sans-serif;
}
```

### Preloading Critical Fonts

```html
<head>
  <!-- Preload critical fonts -->
  <link
    rel="preload"
    href="/fonts/Inter-Variable.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

### Variable Fonts

```css
/* Variable font with weight and width axes */
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Variable.woff2") format("woff2");
  font-weight: 100 900;
// ... (12 lines trimmed)
  font-weight: 550;
  font-stretch: 110%;
}
```

## Responsive Typography

### Fluid Type Scale

```css
/* Using clamp() for responsive sizing */
h1 {
  /* min: 32px, preferred: 5vw + 16px, max: 64px */
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
  line-height: 1.1;
// ... (21 lines trimmed)
      ((100vw - var(--min-vw) * 1px) / (var(--max-vw) - var(--min-vw)))
  );
}
```

### Viewport-Based Scaling

```tsx
// Tailwind config for responsive type
module.exports = {
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
// ... (17 lines trimmed)
    </h1>
  );
}
```

## Readability Guidelines

### Optimal Line Length

```css
/* Optimal reading width: 45-75 characters */
.prose {
  max-width: 65ch; /* ~65 characters */
}

/* Narrower for callouts */
.callout {
  max-width: 50ch;
}

/* Wider for code blocks */
pre {
  max-width: 80ch;
}
```

### Vertical Rhythm

```css
/* Establish baseline grid */
:root {
  --baseline: 1.5rem; /* 24px at 16px base */
}

// ... (17 lines trimmed)
  line-height: var(--baseline);
  margin-bottom: var(--baseline);
}
```

### Text Wrapping

```css
/* Prevent orphans and widows */
p {
  text-wrap: pretty; /* Experimental: improves line breaks */
  widows: 3;
  orphans: 3;
// ... (17 lines trimmed)
  hyphens: auto;
  -webkit-hyphens: auto;
}
```

## Font Pairing Guidelines

### Contrast Pairings

```css
/* Serif heading + Sans body */
:root {
  --font-heading: "Playfair Display", Georgia, serif;
  --font-body: "Source Sans Pro", -apple-system, sans-serif;
}
// ... (9 lines trimmed)
  --font-heading: "Inter", system-ui, sans-serif;
  --font-body: "Georgia", Times, serif;
}
```

### Superfamily Approach

```css
/* Single variable font family for all uses */
:root {
  --font-family: "Inter", system-ui, sans-serif;
}

// ... (16 lines trimmed)
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Semantic Typography Classes

```css
/* Text styles by purpose, not appearance */
.text-display {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
// ... (39 lines trimmed)
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-widest);
}
```

## OpenType Features

```css
/* Enable advanced typography features */
.fancy-text {
  /* Small caps */
  font-variant-caps: small-caps;

// ... (21 lines trimmed)
.fancy-heading {
  font-variant-ligatures: discretionary-ligatures;
}
```
