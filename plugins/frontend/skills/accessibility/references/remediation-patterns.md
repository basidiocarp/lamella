# Remediation Patterns

## Fix: Missing Form Labels

```html
<!-- Before -->
<input type="email" placeholder="Email" />

<!-- After: Option 1 - Visible label -->
<label for="email">Email address</label>
<input id="email" type="email" />

<!-- After: Option 2 - aria-label -->
<input type="email" aria-label="Email address" />

<!-- After: Option 3 - aria-labelledby -->
<span id="email-label">Email</span>
<input type="email" aria-labelledby="email-label" />
```

---

## Fix: Insufficient Color Contrast

```css
/* Before: 2.5:1 contrast */
.text {
  color: #767676;
}

/* After: 4.5:1 contrast */
.text {
  color: #595959;
}

/* Or add background */
.text {
  color: #767676;
  background: #000;
}
```

---

## Fix: Keyboard Navigation

```javascript
// Make custom element keyboard accessible
class AccessibleDropdown extends HTMLElement {
  connectedCallback() {
    this.setAttribute("tabindex", "0");
    this.setAttribute("role", "combobox");
    this.setAttribute("aria-expanded", "false");

    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.toggle();
      }

      if (event.key === "Escape") {
        this.close();
      }
    });
  }
}
```

---

## Fix: Focus Visibility

```css
/* Remove default outlines safely */
:focus {
  outline: none;
}

:focus-visible {
  outline: 3px solid #0a66ff;
  outline-offset: 2px;
}

@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

---

## Fix: Skip Links

```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav>...</nav>
  <main id="main" tabindex="-1">...</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## Fix: Reduced Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
