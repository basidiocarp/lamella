# Page Transitions

CSS-only transitions, Framer Motion patterns, and staggered animations for page/route changes.

## CSS-only Transitions

```css
/* View Transitions API (Chrome 111+) */
@view-transition {
  navigation: auto;
}

// ... (14 lines trimmed)
::view-transition-new(hero) {
  animation-duration: 0.5s;
}
```

## Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Fade transition
const pageVariants = {
  initial: { opacity: 0 },
// ... (52 lines trimmed)
    </>
  );
}
```

## Staggered Animations

```tsx
// Framer Motion stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
// ... (36 lines trimmed)
    </li>
  ))}
</ul>
```

```css
.stagger-list li {
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: calc(var(--i) * 0.1s);
}
```
