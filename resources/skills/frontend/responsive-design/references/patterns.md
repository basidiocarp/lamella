# Responsive Design Patterns

## Pattern 1: Container Queries

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: 1rem;
}

@container (min-width: 40rem) {
  .card {
    grid-template-columns: 12rem 1fr;
    align-items: start;
  }
}
```

```tsx
function ResponsiveCard({
  title,
  image,
  description,
}: {
  title: string;
  image: string;
  description: string;
}) {
  return (
    <div className="card-container">
      <article className="card">
        <img src={image} alt="" />
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </article>
    </div>
  );
}
```

## Pattern 2: Fluid Typography

```css
:root {
  --text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --text-base: clamp(1rem, 0.95rem + 0.4vw, 1.125rem);
  --text-xl: clamp(1.5rem, 1.2rem + 1vw, 2.25rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
}
```

## Pattern 3: Responsive Grid Layout

```css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: 1.5rem;
}
```

```tsx
function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid-auto">{children}</div>;
}
```

## Pattern 4: Responsive Navigation

```tsx
import { useState } from "react";

function ResponsiveNav({ items }: { items: Array<{ href: string; label: string }> }) {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <button onClick={() => setOpen((value) => !value)}>Menu</button>
      <ul hidden={!open}>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Pattern 5: Responsive Images

```tsx
function ResponsiveHero() {
  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet="/hero-desktop.jpg" />
      <source media="(min-width: 40rem)" srcSet="/hero-tablet.jpg" />
      <img src="/hero-mobile.jpg" alt="Product preview" loading="lazy" />
    </picture>
  );
}
```

## Pattern 6: Responsive Tables

```tsx
function ResponsiveTable({
  rows,
}: {
  rows: Array<{ name: string; value: string }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[36rem]">
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th>{row.name}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Viewport Units

```css
.screen-shell {
  min-height: 100dvh;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 4rem);
}
```
