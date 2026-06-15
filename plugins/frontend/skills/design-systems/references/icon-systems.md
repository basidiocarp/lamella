# Icon Systems

Treat icons as part of the interface contract, not decoration glued on later.

## Icon Scale

Keep a small size ladder that aligns with your spacing tokens:

- `xs`: inline decoration
- `sm`: compact controls
- `md`: default UI icon
- `lg`: emphasis or section labels
- `xl+`: hero or illustration-adjacent usage

## Icon Buttons

- Give every icon-only button an accessible name.
- Size the clickable area to at least the system target minimum.
- Keep icon visuals and hit area separate so icons can stay visually small
  inside a larger target.

```tsx
<button aria-label="Open settings" className="min-h-11 min-w-11">
  <SettingsIcon aria-hidden="true" />
</button>
```

## Asset Strategy

- Use one icon source of truth per product surface when possible.
- Prefer a generated sprite or typed component layer over ad hoc inline SVG
  copies.
- Normalize stroke width, corner treatment, and alignment across the set.
