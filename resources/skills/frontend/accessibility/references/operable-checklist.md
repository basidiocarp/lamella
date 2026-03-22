# Operable Checklist (WCAG Principle 2)

## 2.1 Keyboard Accessible

### 2.1.1 Keyboard (Level A)

- [ ] All functionality keyboard accessible
- [ ] No keyboard traps
- [ ] Tab order is logical
- [ ] Custom widgets are keyboard operable

```javascript
// Custom button must be keyboard accessible
<div role="button" tabindex="0"
     onkeydown="if(event.key === 'Enter' || event.key === ' ') activate()">
```

### 2.1.2 No Keyboard Trap (Level A)

- [ ] Focus can move away from all components
- [ ] Modal dialogs trap focus correctly
- [ ] Focus returns after modal closes

---

## 2.2 Enough Time

### 2.2.1 Timing Adjustable (Level A)

- [ ] Session timeouts can be extended
- [ ] User warned before timeout
- [ ] Option to disable auto-refresh

### 2.2.2 Pause, Stop, Hide (Level A)

- [ ] Moving content can be paused
- [ ] Auto-updating content can be paused
- [ ] Animations respect prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 2.3 Seizures and Physical Reactions

### 2.3.1 Three Flashes (Level A)

- [ ] No content flashes more than 3 times/second
- [ ] Flashing area is small (<25% viewport)

---

## 2.4 Navigable

### 2.4.1 Bypass Blocks (Level A)

- [ ] Skip to main content link present
- [ ] Landmark regions defined
- [ ] Proper heading structure

```html
<a href="#main" class="skip-link">Skip to main content</a>
<main id="main">...</main>
```

### 2.4.2 Page Titled (Level A)

- [ ] Unique, descriptive page titles
- [ ] Title reflects page content

### 2.4.3 Focus Order (Level A)

- [ ] Focus order matches visual order
- [ ] tabindex used correctly

### 2.4.4 Link Purpose (In Context) (Level A)

- [ ] Links make sense out of context
- [ ] No "click here" or "read more" alone

```html
<!-- Bad -->
<a href="report.pdf">Click here</a>

<!-- Good -->
<a href="report.pdf">Download Q4 Sales Report (PDF)</a>
```

### 2.4.6 Headings and Labels (Level AA)

- [ ] Headings describe content
- [ ] Labels describe purpose

### 2.4.7 Focus Visible (Level AA)

- [ ] Focus indicator visible on all elements
- [ ] Custom focus styles meet contrast

```css
:focus {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}
```

### 2.4.11 Focus Not Obscured (Level AA) - WCAG 2.2

- [ ] Focused element not fully hidden
- [ ] Sticky headers don't obscure focus
