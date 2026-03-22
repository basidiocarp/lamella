# WCAG 2.2 Guidelines Reference

## Overview

The Web Content Accessibility Guidelines (WCAG) 2.2 provide recommendations for making web content more accessible. They are organized into four principles (POUR): Perceivable, Operable, Understandable, and Robust.

## Conformance Levels

- **Level A**: Minimum accessibility (must satisfy)
- **Level AA**: Standard accessibility (should satisfy)
- **Level AAA**: Enhanced accessibility (may satisfy)

Most organizations target Level AA compliance.

## Principle 1: Perceivable

Content must be presentable in ways users can perceive.

### 1.1 Text Alternatives

#### 1.1.1 Non-text Content (Level A)

All non-text content needs text alternatives.

```tsx
// Images
<img src="chart.png" alt="Q3 sales increased 25% compared to Q2" />

// Decorative images
<img src="decorative-line.svg" alt="" role="presentation" />
// ... (17 lines trimmed)
  <DownloadIcon aria-hidden="true" />
  <span>Download</span>
</button>
```

### 1.2 Time-based Media

#### 1.2.1 Audio-only and Video-only (Level A)

```tsx
// Audio with transcript
<audio src="podcast.mp3" controls />
<details>
  <summary>View transcript</summary>
// ... (7 lines trimmed)
  <track kind="subtitles" src="subtitles-es.vtt" srclang="es" label="Spanish" />
</video>
```

### 1.3 Adaptable

#### 1.3.1 Info and Relationships (Level A)

Structure and relationships must be programmatically determinable.

```tsx
// Proper heading hierarchy
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
// ... (28 lines trimmed)
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

#### 1.3.5 Identify Input Purpose (Level AA)

```tsx
// Input with autocomplete for autofill
<form>
  <label htmlFor="name">Full Name</label>
  <input id="name" name="name" autoComplete="name" />

// ... (9 lines trimmed)
  <label htmlFor="cc">Credit Card Number</label>
  <input id="cc" name="cc" autoComplete="cc-number" />
</form>
```

### 1.4 Distinguishable

#### 1.4.1 Use of Color (Level A)

```tsx
// Bad: Color only indicates error
<input className={hasError ? 'border-red-500' : ''} />

// Good: Color plus icon and text
<div>
// ... (9 lines trimmed)
    </p>
  )}
</div>
```

#### 1.4.3 Contrast (Minimum) (Level AA)

```css
/* Minimum contrast ratios */
/* Normal text: 4.5:1 */
/* Large text (18pt+ or 14pt bold+): 3:1 */

/* Good contrast examples */
// ... (11 lines trimmed)
  color: #0066cc; /* 4.5:1 on white */
  text-decoration: underline; /* Additional visual cue */
}
```

#### 1.4.11 Non-text Contrast (Level AA)

```css
/* UI components need 3:1 contrast */
.button {
  border: 2px solid #767676; /* 3:1 against white */
  background: white;
}
// ... (16 lines trimmed)
  background: #0066cc;
  border-color: #0066cc;
}
```

#### 1.4.12 Text Spacing (Level AA)

Content must not be lost when user adjusts text spacing.

```css
/* Allow text spacing adjustments without breaking layout */
.content {
  /* Use relative units */
  line-height: 1.5; /* At least 1.5x font size */
  letter-spacing: 0.12em; /* Support for 0.12em */
// ... (11 lines trimmed)
/* Letter spacing: 0.12em */
/* Word spacing: 0.16em */
/* Paragraph spacing: 2x font size */
```

#### 1.4.13 Content on Hover or Focus (Level AA)

```tsx
// Tooltip pattern
function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
// ... (20 lines trimmed)
    </div>
  );
}
```

## Principle 2: Operable

Interface components must be operable by all users.

### 2.1 Keyboard Accessible

#### 2.1.1 Keyboard (Level A)

All functionality must be operable via keyboard.

```tsx
// Custom interactive element
function CustomButton({ onClick, children }) {
  return (
    <div
      role="button"
// ... (15 lines trimmed)
function BetterButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

#### 2.1.2 No Keyboard Trap (Level A)

```tsx
// Modal with proper focus management
function Modal({ isOpen, onClose, children }) {
  const closeButtonRef = useRef(null);

  // Return focus on close
// ... (28 lines trimmed)
    </FocusTrap>
  );
}
```

### 2.4 Navigable

#### 2.4.1 Bypass Blocks (Level A)

```tsx
// Skip links
<body>
  <a href="#main" className="skip-link">
    Skip to main content
  </a>
// ... (11 lines trimmed)
    {/* Main content */}
  </main>
</body>
```

#### 2.4.4 Link Purpose (In Context) (Level A)

```tsx
// Bad: Ambiguous link text
<a href="/report">Click here</a>
<a href="/report">Read more</a>

// Good: Descriptive link text
// ... (11 lines trimmed)
  Read more
  <span className="sr-only"> about quarterly sales report</span>
</a>
```

#### 2.4.7 Focus Visible (Level AA)

```css
/* Always show focus indicator */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
// ... (10 lines trimmed)
  outline-offset: 2px;
  background: var(--color-focus-bg);
}
```

### 2.5 Input Modalities (New in 2.2)

#### 2.5.8 Target Size (Minimum) (Level AA) - NEW

Interactive targets must be at least 24x24 CSS pixels.

```css
/* Minimum target size */
.interactive {
  min-width: 24px;
  min-height: 24px;
}
// ... (10 lines trimmed)
  /* but should have adequate line-height */
  line-height: 1.5;
}
```

## Principle 3: Understandable

Content and interface must be understandable.

### 3.1 Readable

#### 3.1.1 Language of Page (Level A)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    ...
  </head>
  <body>
    ...
  </body>
</html>
```

#### 3.1.2 Language of Parts (Level AA)

```tsx
<p>
  The French phrase <span lang="fr">c'est la vie</span> means "that's life."
</p>
```

### 3.2 Predictable

#### 3.2.2 On Input (Level A)

Don't automatically change context on input.

```tsx
// Bad: Auto-submit on selection
<select onChange={(e) => form.submit()}>
  <option>Select country</option>
</select>

// Good: Explicit submit action
<select onChange={(e) => setCountry(e.target.value)}>
  <option>Select country</option>
</select>
<button type="submit">Continue</button>
```

### 3.3 Input Assistance

#### 3.3.1 Error Identification (Level A)

```tsx
function FormField({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
// ... (10 lines trimmed)
    </div>
  );
}
```

#### 3.3.7 Redundant Entry (Level A) - NEW

Don't require users to re-enter previously provided information.

```tsx
// Auto-fill shipping address from billing
function CheckoutForm() {
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [billing, setBilling] = useState({});
  const [shipping, setShipping] = useState({});
// ... (26 lines trimmed)
    </form>
  );
}
```

## Principle 4: Robust

Content must be robust enough for assistive technologies.

### 4.1 Compatible

#### 4.1.2 Name, Role, Value (Level A)

```tsx
// Custom components must expose name, role, and value
function CustomCheckbox({ checked, onChange, label }) {
  return (
    <button
      role="checkbox"
// ... (25 lines trimmed)
    </div>
  );
}
```

## Testing Checklist

```markdown
## Keyboard Testing

- [ ] All interactive elements focusable with Tab
- [ ] Focus order matches visual order
- [ ] Focus indicator always visible
// ... (18 lines trimmed)
- [ ] Content readable with text spacing
- [ ] Focus indicators visible
- [ ] Color not sole indicator of meaning
```

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Techniques for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/)
