# Robust Checklist (WCAG Principle 4)

## 4.1 Compatible

### 4.1.1 Parsing (Level A) - Obsolete in WCAG 2.2

- [ ] Valid HTML (good practice)
- [ ] No duplicate IDs
- [ ] Complete start/end tags

### 4.1.2 Name, Role, Value (Level A)

- [ ] Custom widgets have accessible names
- [ ] ARIA roles correct
- [ ] State changes announced

```html
<!-- Accessible custom checkbox -->
<div role="checkbox"
     aria-checked="false"
     tabindex="0"
     aria-labelledby="label">
</div>
<span id="label">Accept terms</span>
```

### 4.1.3 Status Messages (Level AA)

- [ ] Status updates announced
- [ ] Live regions used correctly

```html
<div role="status" aria-live="polite">
  3 items added to cart
</div>

<div role="alert" aria-live="assertive">
  Error: Form submission failed
</div>
```

---

## ARIA Widget Patterns

### Accessible Button

```html
<div role="button"
     tabindex="0"
     aria-pressed="false"
     onclick="toggleButton(this)"
     onkeydown="if(event.key === 'Enter' || event.key === ' ') toggleButton(this)">
  Toggle Setting
</div>
```

### Accessible Tab Panel

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div id="panel1" role="tabpanel" aria-labelledby="tab1">Content 1</div>
<div id="panel2" role="tabpanel" aria-labelledby="tab2" hidden>Content 2</div>
```

### Accessible Modal

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure?</p>
  <button>Cancel</button>
  <button>Confirm</button>
</div>
```
