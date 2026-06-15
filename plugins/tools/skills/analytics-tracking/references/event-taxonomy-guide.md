# Event Taxonomy Guide

Use this reference when the system needs consistent event names and parameters before implementation starts.

## Naming Rule

Format:

```text
[object]_[action]
```

Examples:

- `signup_completed`
- `plan_selected`
- `checkout_started`
- `onboarding_step_completed`

## Naming Standards

- lowercase only
- underscores only
- noun before verb
- specific event names over generic placeholders
- keep names short enough to scan

## Common Event Families

### Acquisition

- `pricing_viewed`
- `demo_requested`
- `content_downloaded`

### Registration

- `signup_started`
- `signup_completed`
- `trial_started`

### Onboarding

- `onboarding_started`
- `onboarding_step_completed`
- `onboarding_completed`
- `feature_activated`

### Conversion

- `plan_selected`
- `checkout_started`
- `checkout_completed`

### Retention

- `subscription_cancelled`
- `subscription_reactivated`

## Useful Parameters

| Parameter | Use |
|-----------|-----|
| `user_id` | tie behavior to an internal user record |
| `plan_name` | segment by plan or package |
| `billing_period` | compare monthly versus annual behavior |
| `value` | attach revenue or order value |
| `currency` | keep revenue events usable |
| `feature_name` | identify the activated or used feature |
| `form_name` | distinguish conversion paths |

## Governance Rules

- add new events to a tracking plan before implementing them
- do not rename events casually; deprecate old names deliberately
- keep one source of truth for event names, parameters, and owners
- separate conversion events from supporting signals
