# ARIA Patterns and Best Practices

## Overview

ARIA (Accessible Rich Internet Applications) provides attributes to enhance accessibility when native HTML semantics are insufficient. The first rule of ARIA is: don't use ARIA if native HTML can do the job.

## ARIA Fundamentals

### Roles

Roles define what an element is or does.

```tsx
// Widget roles
<div role="button">Click me</div>
<div role="checkbox" aria-checked="true">Option</div>
<div role="slider" aria-valuenow="50">Volume</div>

// Landmark roles (prefer semantic HTML)
<div role="main">...</div>      // Better: <main>
<div role="navigation">...</div> // Better: <nav>
<div role="banner">...</div>     // Better: <header>

// Document structure roles
<div role="region" aria-label="Featured">...</div>
<div role="group" aria-label="Formatting options">...</div>
```

### States and Properties

States indicate current conditions; properties describe relationships.

```tsx
// States (can change)
aria-checked="true|false|mixed"
aria-disabled="true|false"
aria-expanded="true|false"
aria-hidden="true|false"
aria-pressed="true|false"
aria-selected="true|false"

// Properties (usually static)
aria-label="Accessible name"
aria-labelledby="id-of-label"
aria-describedby="id-of-description"
aria-controls="id-of-controlled-element"
aria-owns="id-of-owned-element"
aria-live="polite|assertive|off"
```

## Common ARIA Patterns

### Accordion

```tsx
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="accordion">
// ... (29 lines trimmed)
    </div>
  );
}
```

### Tabs

```tsx
function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabListRef = useRef(null);

  const handleKeyDown = (e, index) => {
// ... (55 lines trimmed)
    </div>
  );
}
```

### Menu Button

```tsx
function MenuButton({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
// ... (76 lines trimmed)
    </div>
  );
}
```

### Combobox (Autocomplete)

```tsx
function Combobox({ options, onSelect, placeholder }) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
// ... (79 lines trimmed)
    </div>
  );
}
```

### Alert Dialog

```tsx
function AlertDialog({ isOpen, onConfirm, onCancel, title, message }) {
  const confirmRef = useRef(null);
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descId = `${dialogId}-desc`;
// ... (31 lines trimmed)
    </FocusTrap>
  );
}
```

### Toolbar

```tsx
function Toolbar({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const toolbarRef = useRef(null);

  const handleKeyDown = (e) => {
// ... (42 lines trimmed)
    </div>
  );
}
```

## Live Regions

### Polite Announcements

```tsx
// Status messages that don't interrupt
function SearchStatus({ count, query }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {count} results found for "{query}"
// ... (9 lines trimmed)
    </div>
  );
}
```

### Assertive Announcements

```tsx
// Important errors that should interrupt
function ErrorAlert({ message }) {
  return (
    <div role="alert" aria-live="assertive">
      Error: {message}
// ... (16 lines trimmed)
    </div>
  );
}
```

### Log Region

```tsx
// Chat messages or activity log
function ChatLog({ messages }) {
  return (
    <div role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((msg) => (
        <div key={msg.id}>
          <span className="author">{msg.author}:</span>
          <span className="text">{msg.text}</span>
        </div>
      ))}
    </div>
  );
}
```

## Common Mistakes to Avoid

### 1. Redundant ARIA

```tsx
// Bad: role="button" on a button
<button role="button">Click me</button>

// Good: just use button
<button>Click me</button>

// Bad: aria-label duplicating visible text
<button aria-label="Submit form">Submit form</button>

// Good: just use visible text
<button>Submit form</button>
```

### 2. Invalid ARIA

```tsx
// Bad: aria-selected on non-selectable element
<div aria-selected="true">Item</div>

// Good: use with proper role
<div role="option" aria-selected="true">Item</div>

// Bad: aria-expanded without control relationship
<button aria-expanded="true">Menu</button>
<div>Menu content</div>

// Good: with aria-controls
<button aria-expanded="true" aria-controls="menu">Menu</button>
<div id="menu">Menu content</div>
```

### 3. Hidden Content Still Announced

```tsx
// Bad: visually hidden but still in accessibility tree
<div style={{ display: 'none' }}>Hidden content</div>

// Good: properly hidden
<div style={{ display: 'none' }} aria-hidden="true">Hidden content</div>

// Or just use display: none (implicitly hidden)
<div hidden>Hidden content</div>
```

## Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [Using ARIA](https://www.w3.org/TR/using-aria/)
