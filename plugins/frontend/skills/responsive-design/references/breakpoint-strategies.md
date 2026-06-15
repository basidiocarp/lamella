# Breakpoint Strategies

Responsive breakpoints should follow content pressure, not device marketing names.

## Mobile-First Baseline

```css
.component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 48rem) {
  .component {
    flex-direction: row;
    padding: 1.5rem;
  }
}
```

Why mobile-first works:
- smaller screens get the default rules
- larger layouts progressively enhance
- the cascade stays easier to reason about

## Keep the Scale Small

Typical practical scale:

```css
@media (min-width: 40rem) { /* small layout shift */ }
@media (min-width: 64rem) { /* major desktop layout */ }
@media (min-width: 80rem) { /* wide-screen refinement */ }
```

You usually do not need a dozen breakpoints. Add one only when content actually breaks.

## Content-Driven Breakpoints

Use breakpoints when:
- a line length becomes unreadable
- cards no longer fit comfortably
- navigation wraps badly
- a dense layout needs an extra column

Bad pattern:

```css
/* "tablet breakpoint" because a framework said so */
@media (min-width: 768px) { ... }
```

Better pattern:

```css
/* add a column when the card rail has room */
@media (min-width: 52rem) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Design Token Integration

```css
:root {
  --bp-sm: 40rem;
  --bp-lg: 64rem;
  --bp-xl: 80rem;
}

@media (min-width: 64rem) {
  .shell {
    max-width: 72rem;
    margin-inline: auto;
  }
}
```

Keep tokens centralized so components and docs speak the same layout language.

## Common Component Patterns

### Navigation

```css
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 48rem) {
  .nav {
    flex-direction: row;
    align-items: center;
  }
}
```

### Card Grid

```css
.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 48rem) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 72rem) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Tables

```css
.table-wrap {
  overflow-x: auto;
}
```

On narrow screens, scrolling is often more honest than collapsing a real table into a fake card layout.

## Default Rule

```text
Start fluid
Add as few breakpoints as possible
Name them by layout intent, not device type
Use a breakpoint only when the content proves it is needed
```
