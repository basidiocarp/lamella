# Animations and Dark Mode Theming

Native CSS animations with Tailwind v4 tokens and a minimal dark-mode setup.

## Pattern 1: Native CSS Animations

```css
@theme {
  --animate-dialog-in: dialog-fade-in 0.2s ease-out;
  --animate-dialog-out: dialog-fade-out 0.15s ease-in;
  --animate-overlay-in: overlay-fade-in 0.2s ease-out;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dialog-fade-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
}

@keyframes overlay-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog-content[data-state='open'] {
  animation: var(--animate-dialog-in);
}

.dialog-content[data-state='closed'] {
  animation: var(--animate-dialog-out);
}

.dialog-overlay[data-state='open'] {
  animation: var(--animate-overlay-in);
}
```

```tsx
import * as Dialog from '@radix-ui/react-dialog'

export function SettingsDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md bg-slate-900 px-4 py-2 text-white">
        Open settings
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black/40" />
        <Dialog.Content className="dialog-content fixed left-1/2 top-1/2 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold">Settings</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-slate-600">
            Tune visual preferences without leaving the page.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

## Pattern 2: Dark Mode with Class-Based Theming

```tsx
'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  root.classList.toggle('dark', resolved === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function ThemeToggle() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('ThemeToggle must be used inside ThemeProvider')

  return (
    <button
      className="rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      onClick={() => context.setTheme(context.theme === 'dark' ? 'light' : 'dark')}
      type="button"
    >
      Toggle theme
    </button>
  )
}
```
