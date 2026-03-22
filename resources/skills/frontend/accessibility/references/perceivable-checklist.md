# Perceivable Checklist (WCAG Principle 1)

## 1.1 Text Alternatives

### 1.1.1 Non-text Content (Level A)

- [ ] All images have alt text
- [ ] Decorative images have alt=""
- [ ] Complex images have long descriptions
- [ ] Icons with meaning have accessible names
- [ ] CAPTCHAs have alternatives

```html
<!-- Good -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2" />
<img src="decorative-line.png" alt="" />

<!-- Bad -->
<img src="chart.png" />
<img src="decorative-line.png" alt="decorative line" />
```

---

## 1.2 Time-based Media

### 1.2.1 Audio-only and Video-only (Level A)

- [ ] Audio has text transcript
- [ ] Video has audio description or transcript

### 1.2.2 Captions (Level A)

- [ ] All video has synchronized captions
- [ ] Captions are accurate and complete
- [ ] Speaker identification included

### 1.2.3 Audio Description (Level A)

- [ ] Video has audio description for visual content

---

## 1.3 Adaptable

### 1.3.1 Info and Relationships (Level A)

- [ ] Headings use proper tags (h1-h6)
- [ ] Lists use ul/ol/dl
- [ ] Tables have headers
- [ ] Form inputs have labels
- [ ] ARIA landmarks present

```html
<!-- Heading hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

<!-- Table headers -->
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
</table>
```

### 1.3.2 Meaningful Sequence (Level A)

- [ ] Reading order is logical
- [ ] CSS positioning doesn't break order
- [ ] Focus order matches visual order

### 1.3.3 Sensory Characteristics (Level A)

- [ ] Instructions don't rely on shape/color alone
- [ ] "Click the red button" → "Click Submit (red button)"

---

## 1.4 Distinguishable

### 1.4.1 Use of Color (Level A)

- [ ] Color is not only means of conveying info
- [ ] Links distinguishable without color
- [ ] Error states not color-only

### 1.4.3 Contrast (Minimum) (Level AA)

- [ ] Text: 4.5:1 contrast ratio
- [ ] Large text (18pt+): 3:1 ratio
- [ ] UI components: 3:1 ratio

Tools: WebAIM Contrast Checker, axe DevTools

### 1.4.4 Resize Text (Level AA)

- [ ] Text resizes to 200% without loss
- [ ] No horizontal scrolling at 320px
- [ ] Content reflows properly

### 1.4.10 Reflow (Level AA)

- [ ] Content reflows at 400% zoom
- [ ] No two-dimensional scrolling
- [ ] All content accessible at 320px width

### 1.4.11 Non-text Contrast (Level AA)

- [ ] UI components have 3:1 contrast
- [ ] Focus indicators visible
- [ ] Graphical objects distinguishable

### 1.4.12 Text Spacing (Level AA)

- [ ] No content loss with increased spacing
- [ ] Line height 1.5x font size
- [ ] Paragraph spacing 2x font size
- [ ] Letter spacing 0.12x font size
- [ ] Word spacing 0.16x font size
