# Scroll Animations

Intersection Observer patterns, Framer Motion scroll-triggered animations, and native CSS scroll-driven animations.

## Narrative Scroll Planning

Use scroll as a sequencing tool, not just as motion decoration.

Typical story beats:

1. Hook
2. Context
3. Journey
4. Reveal
5. Resolution

If the page has no real narrative arc, keep the motion light.

## Intersection Observer

```tsx
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
// ... (27 lines trimmed)
    </div>
  );
}
```

## Scroll-triggered with Framer Motion

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
// ... (22 lines trimmed)
    />
  );
}
```

## CSS Scroll-driven Animations

```css
/* Native scroll-driven animations (Chrome 115+) */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(50px);
// ... (21 lines trimmed)
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

## Sticky and Pinned Sections

Use sticky or pinned sections when the user needs to keep one visual anchor in place while the explanation changes around it.

Good uses:

- step-by-step product walkthroughs
- before-and-after comparisons
- horizontal galleries with clear progress

Bad uses:

- generic parallax for its own sake
- layouts that trap the user in a pinned section too long

## Anti-Patterns

- Scroll hijacking that replaces natural page scroll
- Too many layered effects at once
- Heavy motion with no reduced-motion fallback
- Pinned sections that make the user work to regain normal page flow
