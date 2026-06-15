# Form Handling & Accessibility Patterns

## Controlled Form with Validation

```typescript
import { useState } from 'react'

interface FormData {
  name: string
  description: string
  endDate: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function MarketForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    endDate: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(values: FormData): FormErrors {
    const nextErrors: FormErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Name is required'
    if (values.description.trim().length < 20) nextErrors.description = 'Description must be at least 20 characters'
    if (!values.endDate) nextErrors.endDate = 'End date is required'
    return nextErrors
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    console.log('submit', formData)
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <label htmlFor="market-name">Market name</label>
      <input
        aria-describedby={errors.name ? 'market-name-error' : undefined}
        aria-invalid={Boolean(errors.name)}
        id="market-name"
        onChange={(event) => update('name', event.target.value)}
        value={formData.name}
      />
      {errors.name ? <p id="market-name-error">{errors.name}</p> : null}

      <label htmlFor="market-description">Description</label>
      <textarea
        aria-describedby={errors.description ? 'market-description-error' : undefined}
        aria-invalid={Boolean(errors.description)}
        id="market-description"
        onChange={(event) => update('description', event.target.value)}
        value={formData.description}
      />
      {errors.description ? <p id="market-description-error">{errors.description}</p> : null}

      <label htmlFor="market-end-date">End date</label>
      <input
        aria-describedby={errors.endDate ? 'market-end-date-error' : undefined}
        aria-invalid={Boolean(errors.endDate)}
        id="market-end-date"
        onChange={(event) => update('endDate', event.target.value)}
        type="date"
        value={formData.endDate}
      />
      {errors.endDate ? <p id="market-end-date-error">{errors.endDate}</p> : null}

      <button type="submit">Create market</button>
    </form>
  )
}
```

## Animation Patterns with Framer Motion

```typescript
import { AnimatePresence, motion } from 'framer-motion'

export function AnimatedMarketList({ markets }: { markets: Market[] }) {
  return (
    <AnimatePresence initial={false}>
      {markets.map((market) => (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          initial={{ opacity: 0, y: 12 }}
          key={market.id}
          layout
          transition={{ duration: 0.2 }}
        >
          <h3>{market.title}</h3>
          <p>{market.summary}</p>
        </motion.article>
      ))}
    </AnimatePresence>
  )
}
```

## Accessibility: Keyboard Navigation

```typescript
import { useState } from 'react'

export function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(0)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      onSelect(options[activeIndex])
      setIsOpen(false)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div>
      <button
        aria-controls="dropdown-list"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
      >
        Choose an option
      </button>
      {isOpen ? (
        <ul id="dropdown-list" role="listbox">
          {options.map((option, index) => (
            <li aria-selected={index === activeIndex} key={option.value} role="option">
              {option.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
```

## Accessibility: Focus Management

```typescript
import { useEffect, useRef } from 'react'

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previousFocusRef.current = document.activeElement as HTMLElement | null
    modalRef.current?.focus()

    return () => {
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <div onClick={onClose} />
      <div ref={modalRef} tabIndex={-1}>
        <button onClick={onClose} type="button">
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
```
