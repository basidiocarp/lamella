# Style Presets Reference

Curated visual styles for `frontend-slides`.

Use this file for:
- the mandatory viewport-fitting CSS base
- preset selection and mood mapping
- CSS gotchas and validation rules

## Mandatory Base CSS

```css
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}

.slide {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: grid;
  align-content: center;
}

img,
video {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}
```

## Viewport Checklist

- every slide fits in one viewport
- typography uses `clamp()`
- spacing adapts to short screens
- if a slide feels cramped, split it
