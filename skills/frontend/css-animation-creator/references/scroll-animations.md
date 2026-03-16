# Scroll Animations

Intersection Observer patterns, Framer Motion scroll-triggered animations, and native CSS scroll-driven animations.

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
