# Container Queries Deep Dive

## Overview

Container queries enable component-based responsive design by allowing elements to respond to their container's size rather than the viewport. This paradigm shift makes truly reusable components possible.

## Browser Support

Container queries have excellent modern browser support (Chrome 105+, Firefox 110+, Safari 16+). For older browsers, provide graceful fallbacks.

## Containment Basics

### Container Types

```css
/* Size containment - queries based on inline and block size */
.container {
  container-type: size;
}

/* Inline-size containment - queries based on inline (width) size only */
/* Most common and recommended */
.container {
  container-type: inline-size;
}

/* Normal - style queries only, no size queries */
.container {
  container-type: normal;
}
```

### Named Containers

```css
/* Named container for targeted queries */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}
// ... (9 lines trimmed)
    display: flex;
  }
}
```

## Container Query Syntax

### Width-Based Queries

```css
.container {
  container-type: inline-size;
}

/* Minimum width */
// ... (23 lines trimmed)
    /* styles */
  }
}
```

### Combining Conditions

```css
/* AND condition */
@container (min-width: 400px) and (max-width: 800px) {
  .element {
    /* styles */
  }
// ... (12 lines trimmed)
    /* styles */
  }
}
```

### Named Container Queries

```css
/* Multiple named containers */
.page-wrapper {
  container: page / inline-size;
}

// ... (14 lines trimmed)
    grid-template-columns: 1fr 1fr;
  }
}
```

## Container Query Units

```css
/* Container query length units */
.element {
  /* Container query width - 1cqw = 1% of container width */
  width: 50cqw;

// ... (21 lines trimmed)
.card-body {
  padding: clamp(0.75rem, 4cqi, 1.5rem);
}
```

## Style Queries

Style queries allow querying CSS custom property values. Currently limited support.

```css
/* Define a custom property */
.card {
  --layout: stack;
}

// ... (16 lines trimmed)
.card.horizontal {
  --layout: inline;
}
```

## Practical Patterns

### Responsive Card Component

```css
.card-container {
  container: card / inline-size;
}

.card {
// ... (47 lines trimmed)
    gap: 0.5rem;
  }
}
```

### Responsive Grid Items

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
// ... (24 lines trimmed)
    gap: 1rem;
  }
}
```

### Dashboard Widget

```css
.widget-container {
  container: widget / inline-size;
}

.widget {
// ... (43 lines trimmed)
    gap: 0.5rem;
  }
}
```

### Navigation Component

```css
.nav-container {
  container: nav / inline-size;
}

.nav {
// ... (36 lines trimmed)
    padding: 0.5rem 1rem;
  }
}
```

## Tailwind CSS Integration

```tsx
// Tailwind v3.2+ supports container queries
// tailwind.config.js
module.exports = {
  plugins: [require("@tailwindcss/container-queries")],
};
// ... (33 lines trimmed)
    </div>
  );
}
```

## Fallback Strategies

```css
/* Provide fallbacks for browsers without support */
.card {
  /* Default (fallback) styles */
  display: flex;
  flex-direction: column;
// ... (39 lines trimmed)
    }
  }
}
```

## Performance Considerations

```css
/* Avoid over-nesting containers */
/* Bad: Too many nested containers */
.level-1 {
  container-type: inline-size;
}
// ... (18 lines trimmed)
  container-type: inline-size; /* Preferred */
  /* container-type: size; */ /* Only when needed */
}
```

## Testing Container Queries

```javascript
// Test container query support
const supportsContainerQueries = CSS.supports("container-type", "inline-size");

// Resize observer for testing
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    console.log("Container width:", entry.contentRect.width);
  }
});

observer.observe(document.querySelector(".container"));
```

## Resources

- [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
- [CSS Container Queries Spec](https://www.w3.org/TR/css-contain-3/)
- [Una Kravets: Container Queries](https://web.dev/cq-stable/)
- [Ahmad Shadeed: Container Queries Guide](https://ishadeed.com/article/container-queries-are-finally-here/)
