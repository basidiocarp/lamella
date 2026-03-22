# Animation Libraries Reference

## Framer Motion

The most popular React animation library with declarative API.

### Basic Animations

```tsx
import { motion, AnimatePresence } from "framer-motion";

// Simple animation
function FadeIn({ children }) {
  return (
// ... (41 lines trimmed)
    </motion.button>
  );
}
```

### Layout Animations

```tsx
import { motion, LayoutGroup } from "framer-motion";

// Shared layout animation
function TabIndicator({ activeTab, tabs }) {
  return (
// ... (34 lines trimmed)
    </Reorder.Group>
  );
}
```

### Orchestration

```tsx
// Staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
// ... (24 lines trimmed)
    </motion.ul>
  );
}
```

### Page Transitions

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

const pageVariants = {
  initial: { opacity: 0, x: -20 },
// ... (19 lines trimmed)
    </AnimatePresence>
  );
}
```

## GSAP (GreenSock)

Industry-standard animation library for complex, performant animations.

### Basic Timeline

```tsx
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
// ... (36 lines trimmed)
    </div>
  );
}
```

### ScrollTrigger

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// ... (43 lines trimmed)
    </section>
  );
}
```

### Text Animation

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);
// ... (21 lines trimmed)

  return <h1 ref={textRef}>{text}</h1>;
}
```

## CSS Spring Physics

```tsx
// spring.ts - Custom spring physics
interface SpringConfig {
  stiffness: number; // Higher = snappier
  damping: number; // Higher = less bouncy
  mass: number;
// ... (20 lines trimmed)
  }
  return `cubic-bezier(0.34, 1.56, 0.64, 1)`;
}
```

## Web Animations API

Native browser animation API for simple animations.

```tsx
function useWebAnimation(
  ref: RefObject<HTMLElement>,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
// ... (25 lines trimmed)

  return <div ref={elementRef}>{children}</div>;
}
```

## View Transitions API

Native browser API for page transitions.

```tsx
// Check support
const supportsViewTransitions = "startViewTransition" in document;

// Simple page transition
async function navigateTo(url: string) {
// ... (34 lines trimmed)
  animation-duration: 0.3s;
}
*/
```

## Performance Tips

### GPU Acceleration

```css
/* Properties that trigger GPU acceleration */
.animated-element {
  transform: translateZ(0); /* Force GPU layer */
  will-change: transform, opacity; /* Hint to browser */
}
// ... (9 lines trimmed)
.avoid {
  /* Don't animate: width, height, top, left, margin, padding */
}
```

### Reduced Motion

```tsx
function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
// ... (21 lines trimmed)
    </motion.div>
  );
}
```
