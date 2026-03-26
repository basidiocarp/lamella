# Spline Performance and Fallbacks

Treat Spline scenes like media assets. If the file is too large or the device is too weak, use a fallback.

## Pre-Integration Checklist

- [ ] Scene file size is under 10 MB
- [ ] Geometry quality is set to the performance preset in Spline
- [ ] Background is hidden if the site owns the background
- [ ] Page scroll, zoom, and pan are disabled unless the scene truly needs them
- [ ] The page has at most one or two live Spline embeds
- [ ] A static fallback exists before the live scene loads

## Size Guidance

- Under 3 MB: usually fine
- 3 to 10 MB: acceptable, but optimize first
- Over 10 MB: reconsider the live embed
- Over 20 MB: use video instead of live WebGL

## Loading Strategy

1. Preload the `.splinecode` URL.
2. Reserve the final layout area so the page does not shift.
3. Lazy-load the runtime in React.
4. Skip the scene on mobile or low-end devices.
5. Add a timeout fallback so CDN failures do not leave a blank region.

## Mobile Strategy

Default to one of these:

- Skip the live scene entirely below a width threshold
- Skip when `navigator.hardwareConcurrency <= 2`
- Serve a recorded video for decorative scenes

Example:

```js
if (window.innerWidth < 768 || navigator.hardwareConcurrency <= 2) {
  showFallback();
} else {
  loadSpline();
}
```

## Prevent Layout Shift

Always reserve space:

```css
spline-viewer,
.spline-canvas {
  display: block;
  width: 100%;
  height: 100vh;
  contain: strict;
}
```

## When Not to Use Live 3D

Use a video or still image instead when:

- the scene is decorative only
- the file size is high
- most traffic is mobile
- you need strong Core Web Vitals

## Fallback Expectations

Every implementation should define:

- the fallback color, image, or video
- the device rule for skipping the scene
- the timeout window before falling back
- the interaction mode: decorative or interactive
