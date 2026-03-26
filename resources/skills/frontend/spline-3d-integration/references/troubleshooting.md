# Spline Troubleshooting

## Scroll Hijacking

Problem: the page stops scrolling after the Spline embed loads.

Why: Spline-generated code can inject `overflow: hidden` on `body`.

Fix:

```css
body {
  overflow: auto !important;
}
```

Also disable page scroll in Spline export settings before regenerating the scene URL.

## White Box Behind the Scene

Problem: the scene renders with an unwanted white rectangle.

Fix:

1. Hide the Spline background in export settings.
2. Regenerate the scene URL after changing the export settings.
3. If needed, use a transparent background override in the embed.

## Scene Loads Intermittently

Problem: the scene sometimes shows and sometimes fails.

Why: the Spline CDN can be slow or transiently unavailable.

Fix: use a timeout fallback and, for critical work, self-host the `.splinecode` file.

## Scene Blocks Buttons

Problem: page controls above the scene stop receiving clicks.

Fix:

```css
.spline-wrapper {
  pointer-events: none;
}
```

Only leave pointer events enabled when the scene itself must be interactive.

## Rotation Behaves Incorrectly

Problem: object rotation values seem wrong.

Why: the runtime uses radians.

Use:

- `Math.PI / 2` for 90°
- `Math.PI` for 180°

## Next.js Hydration Errors

Problem: the scene throws hydration mismatches in Next.js.

Fix: use the `/next` import first. If that still fails, use a client-only dynamic import with `ssr: false`.
