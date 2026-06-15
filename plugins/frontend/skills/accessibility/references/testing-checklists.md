# Screen Reader Testing Checklists

## VoiceOver Checklist

- page title announced
- main landmark found
- skip link works
- headings navigable
- forms announce labels and errors
- dynamic content is announced

## NVDA Script

1. read the page top to bottom
2. navigate landmarks
3. navigate headings
4. test forms with invalid input
5. test dynamic content and modals

## Common Fixes

```html
<button aria-label="Close dialog">
  <svg aria-hidden="true"></svg>
</button>

<input type="email" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email</span>
```
