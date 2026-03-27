# Accessibility Patterns for Components

## ARIA Patterns for Common Components

### Modal Dialog

```tsx
function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div role="presentation" className="backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

### Dropdown Menu

```tsx
function MenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="menu-content"
        onClick={() => setOpen((value) => !value)}
      >
        Actions
      </button>
      {open ? (
        <ul id="menu-content" role="menu">
          <li role="menuitem">
            <button>Edit</button>
          </li>
          <li role="menuitem">
            <button>Delete</button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
```

### Combobox / Autocomplete

```tsx
<div>
  <label htmlFor="assignee">Assignee</label>
  <input
    id="assignee"
    role="combobox"
    aria-expanded={open}
    aria-controls="assignee-list"
    aria-autocomplete="list"
  />
  <ul id="assignee-list" role="listbox">
    {options.map((option) => (
      <li key={option.id} role="option">
        {option.label}
      </li>
    ))}
  </ul>
</div>
```

### Form Validation

```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError ? (
    <p id="email-error" role="alert">
      Enter a valid email address.
    </p>
  ) : null}
</div>
```

## Skip Links

```tsx
<>
  <a className="skip-link" href="#main-content">
    Skip to main content
  </a>
  <main id="main-content">{children}</main>
</>
```

## Live Regions

```tsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

Use `polite` for non-critical updates and `assertive` only for urgent alerts.

## Focus Management Utilities

```tsx
function useRestoreFocus(active: boolean) {
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (active) previous.current = document.activeElement as HTMLElement | null;
    return () => previous.current?.focus();
  }, [active]);
}
```

## Color Contrast Utilities

```ts
function meetsContrastRatio(ratio: number, largeText = false) {
  return ratio >= (largeText ? 3 : 4.5);
}
```

Use contrast tooling in design reviews, but always confirm the final UI against
actual rendered colors and states.
