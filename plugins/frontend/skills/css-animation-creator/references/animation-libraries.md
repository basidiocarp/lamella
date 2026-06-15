# Animation Libraries Reference

## Framer Motion

```tsx
import { AnimatePresence, motion } from 'framer-motion'

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedList({ items }: { items: { id: string; label: string }[] }) {
  return (
    <AnimatePresence initial={false}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {item.label}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

Use Framer Motion for React-first UI transitions, layout animation, and page
state changes.

## GSAP

```tsx
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedHero() {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 })
  }, [])

  return <div ref={ref}>Hero content</div>
}
```

Use GSAP for timeline-heavy motion, scroll choreography, or advanced SVG and
canvas animation.

## Web Animations API

```tsx
import { useEffect, useRef } from 'react'

export function PulseCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animation = ref.current?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      { duration: 800, easing: 'ease-out' }
    )

    return () => animation?.cancel()
  }, [])

  return <div ref={ref}>{children}</div>
}
```

Use the Web Animations API for simple native animations without another runtime
dependency.

## Reduced Motion

```tsx
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(media.matches)
    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return prefersReduced
}
```
