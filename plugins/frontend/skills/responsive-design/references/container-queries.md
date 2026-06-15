# Container Queries

Container queries let components respond to their own available space instead of the whole viewport.

## Basic Setup

```css
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 32rem) {
  .card {
    display: grid;
    grid-template-columns: 12rem 1fr;
    gap: 1rem;
  }
}
```

Prefer `inline-size` unless you truly need both width and height containment.

## Named Containers

```css
.dashboard-panel {
  container: panel / inline-size;
}

@container panel (min-width: 40rem) {
  .panel-body {
    grid-template-columns: 1fr 1fr;
  }
}
```

Use named containers when multiple queryable containers exist in the same view.

## Query Units

```css
.card-title {
  font-size: clamp(1rem, 3cqi, 1.5rem);
}

.card-body {
  padding: clamp(0.75rem, 4cqi, 1.5rem);
}
```

Useful units:
- `cqi` for inline size
- `cqb` for block size
- `cqw` and `cqh` for container width and height

## Best-Fit Patterns

### Responsive Card

```css
.card-shell {
  container: card / inline-size;
}

.card {
  display: grid;
  gap: 0.75rem;
}

@container card (min-width: 28rem) {
  .card {
    grid-template-columns: auto 1fr;
    align-items: start;
  }
}
```

### Dashboard Widget

```css
.widget-shell {
  container: widget / inline-size;
}

@container widget (min-width: 36rem) {
  .widget-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Navigation Cluster

```css
.nav-shell {
  container: nav / inline-size;
}

@container nav (min-width: 30rem) {
  .nav-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
```

## Fallback Strategy

```css
.card {
  display: flex;
  flex-direction: column;
}

@supports (container-type: inline-size) {
  .card-shell {
    container-type: inline-size;
  }
}
```

Start with a sane default layout, then layer container-query enhancements behind `@supports` if broader compatibility matters.

## When to Use Them

Use container queries when:
- the same component appears in narrow and wide slots
- viewport breakpoints are too blunt
- reusable components need local layout intelligence

Do not use them just because they are newer. If the whole page shifts together, a normal media query is still simpler.
