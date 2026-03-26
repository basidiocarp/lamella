# GTM Patterns

Use this reference when deciding how an event should actually fire.

## Recommended Pattern Order

1. data layer event
2. form submission trigger
3. click trigger
4. history change for SPA page views

Prefer the most explicit pattern the product can support.

## Data Layer Event

Application code:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "signup_completed",
  signup_method: "email",
  user_id: userId,
  plan_name: "trial"
});
```

GTM setup:

- custom event trigger for `signup_completed`
- GA4 event tag with mapped parameters

## Click Tracking

Use only when app instrumentation is not available.

Prefer stable attributes:

```html
<button data-track="demo-cta">Request a Demo</button>
```

## Form Tracking

- use form submission triggers for traditional forms
- use data layer pushes for JS-handled or SPA forms
- attach `form_name` and source context

## SPA Page Views

Use either:

- a history change trigger
- or an explicit route-change data layer push

Do not double-count with both unless that is intentional and verified.

## Consent Note

Before blaming GTM, confirm whether consent mode is suppressing the event by design.
