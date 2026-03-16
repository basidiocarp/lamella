# Responsive Design Patterns

Detailed implementation patterns for modern responsive design.

## Pattern 1: Container Queries

```css
/* Define a containment context */
.card-container {
  container-type: inline-size;
  container-name: card;
}
// ... (26 lines trimmed)
  /* 5% of container width, clamped between 1rem and 2rem */
  font-size: clamp(1rem, 5cqi, 2rem);
}
```

```tsx
// React component with container queries
function ResponsiveCard({ title, image, description }) {
  return (
    <div className="@container">
      <article className="flex flex-col @md:flex-row @md:gap-4">
// ... (14 lines trimmed)
    </div>
  );
}
```

## Pattern 2: Fluid Typography

```css
/* Fluid type scale using clamp() */
:root {
  /* Min size, preferred (fluid), max size */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
// ... (27 lines trimmed)
  --space-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --space-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
}
```

```tsx
// Utility function for fluid values
function fluidValue(
  minSize: number,
  maxSize: number,
  minWidth = 320,
// ... (13 lines trimmed)
  xl: fluidValue(1.5, 2),
  "2xl": fluidValue(2, 3),
};
```

## Pattern 3: CSS Grid Responsive Layout

```css
/* Auto-fit grid - items wrap automatically */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
// ... (49 lines trimmed)
.footer {
  grid-area: footer;
}
```

```tsx
// Responsive grid component
function ResponsiveGrid({ children, minItemWidth = "250px", gap = "1.5rem" }) {
  return (
    <div
      className="grid"
// ... (17 lines trimmed)
    </div>
  );
}
```

## Pattern 4: Responsive Navigation

```tsx
function ResponsiveNav({ items }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
// ... (39 lines trimmed)
    </nav>
  );
}
```

## Pattern 5: Responsive Images

```tsx
// Responsive image with art direction
function ResponsiveHero() {
  return (
    <picture>
      {/* Art direction: different crops for different screens */}
// ... (38 lines trimmed)
    />
  );
}
```

## Pattern 6: Responsive Tables

```tsx
// Responsive table with horizontal scroll
function ResponsiveTable({ data, columns }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[600px]">
// ... (49 lines trimmed)
    </>
  );
}
```

## Viewport Units

```css
/* Standard viewport units */
.full-height {
  height: 100vh; /* May cause issues on mobile */
}

// ... (17 lines trimmed)
  /* 5vw with min/max bounds */
  font-size: clamp(2rem, 5vw, 4rem);
}
```
