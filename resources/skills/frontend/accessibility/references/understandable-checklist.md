# Understandable Checklist (WCAG Principle 3)

## 3.1 Readable

### 3.1.1 Language of Page (Level A)

- [ ] HTML lang attribute set
- [ ] Language correct for content

```html
<html lang="en">
```

### 3.1.2 Language of Parts (Level AA)

- [ ] Language changes marked

```html
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```

---

## 3.2 Predictable

### 3.2.1 On Focus (Level A)

- [ ] No context change on focus alone
- [ ] No unexpected popups on focus

### 3.2.2 On Input (Level A)

- [ ] No automatic form submission
- [ ] User warned before context change

### 3.2.3 Consistent Navigation (Level AA)

- [ ] Navigation consistent across pages
- [ ] Repeated components same order

### 3.2.4 Consistent Identification (Level AA)

- [ ] Same functionality = same label
- [ ] Icons used consistently

---

## 3.3 Input Assistance

### 3.3.1 Error Identification (Level A)

- [ ] Errors clearly identified
- [ ] Error message describes problem
- [ ] Error linked to field

```html
<input aria-describedby="email-error" aria-invalid="true" />
<span id="email-error" role="alert">Please enter valid email</span>
```

### 3.3.2 Labels or Instructions (Level A)

- [ ] All inputs have visible labels
- [ ] Required fields indicated
- [ ] Format hints provided

### 3.3.3 Error Suggestion (Level AA)

- [ ] Errors include correction suggestion
- [ ] Suggestions are specific

### 3.3.4 Error Prevention (Level AA)

- [ ] Legal/financial forms reversible
- [ ] Data checked before submission
- [ ] User can review before submit
