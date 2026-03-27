# Sizing and Radius

Component sizing should feel like part of the same token family as spacing and
typography.

## Size Tokens

Use named sizes for reusable UI parts:

- inputs
- avatars
- badges
- cards
- dialogs

```css
:root {
  --size-control-sm: 2rem;
  --size-control-md: 2.5rem;
  --size-control-lg: 3rem;
}
```

## Aspect Ratios

Keep a small set of approved ratios:

- square
- video
- photo
- portrait or poster

This avoids ratio drift across media components.

## Radius Scale

Use a short radius ladder and map component roles to it:

- `sm` for tight UI surfaces
- `md` or `lg` for cards and menus
- `xl` for dialogs or prominent containers
- `full` only when the shape should read as pill or circle
