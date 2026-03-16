# Screen Reader Testing Checklists

## VoiceOver Testing Checklist

### Page Load

- [ ] Page title announced
- [ ] Main landmark found
- [ ] Skip link works

### Navigation

- [ ] All headings discoverable via rotor
- [ ] Heading levels logical (H1 → H2 → H3)
- [ ] Landmarks properly labeled
- [ ] Skip links functional

### Links & Buttons

- [ ] Link purpose clear
- [ ] Button actions described
- [ ] New window/tab announced

### Forms

- [ ] All labels read with inputs
- [ ] Required fields announced
- [ ] Error messages read
- [ ] Instructions available
- [ ] Focus moves to errors

### Dynamic Content

- [ ] Alerts announced immediately
- [ ] Loading states communicated
- [ ] Content updates announced
- [ ] Modals trap focus correctly

### Tables

- [ ] Headers associated with cells
- [ ] Table navigation works
- [ ] Complex tables have captions

## NVDA Test Script

### Initial Load

1. Navigate to page
2. Let page finish loading
3. Press Insert + Down to read all
4. Note: Page title, main content identified?

### Landmark Navigation

1. Press D repeatedly
2. Check: All main areas reachable?
3. Check: Landmarks properly labeled?

### Heading Navigation

1. Press Insert + F7 → Headings
2. Check: Logical heading structure?
3. Press H to navigate headings
4. Check: All sections discoverable?

### Form Testing

1. Press F to find first form field
2. Check: Label read?
3. Fill in invalid data
4. Submit form
5. Check: Errors announced?
6. Check: Focus moved to error?

### Interactive Elements

1. Tab through all interactive elements
2. Check: Each announces role and state
3. Activate buttons with Enter/Space
4. Check: Result announced?

### Dynamic Content

1. Trigger content update
2. Check: Change announced?
3. Open modal
4. Check: Focus trapped?
5. Close modal
6. Check: Focus returns?

## Common Issues & Fixes

```html
<!-- Issue: Button not announcing purpose -->
<button><svg>...</svg></button>

<!-- Fix -->
<button aria-label="Close dialog"><svg aria-hidden="true">...</svg></button>
// ... (11 lines trimmed)
<!-- Fix -->
<input type="email" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email</span>
```
