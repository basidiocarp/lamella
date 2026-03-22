# Form Handling & Accessibility Patterns

## Controlled Form with Validation

```typescript
interface FormData {
  name: string
  description: string
  endDate: string
}
// ... (62 lines trimmed)
    </form>
  )
}
```

## Animation Patterns with Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ List animations
export function AnimatedMarketList({ markets }: { markets: Market[] }) {
  return (
// ... (39 lines trimmed)
    </AnimatePresence>
  )
}
```

## Accessibility: Keyboard Navigation

```typescript
export function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
// ... (28 lines trimmed)
    </div>
  )
}
```

## Accessibility: Focus Management

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
// ... (21 lines trimmed)
    </div>
  ) : null
}
```
