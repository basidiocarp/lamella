# Micro-interactions

Use micro-interactions to confirm state changes, guide attention, and make UI
controls feel responsive. Keep them short, intentional, and tied to user action.

## Common Interaction Types

### Press and Tap Feedback

Use quick scale, shadow, or opacity changes for buttons and touch targets.

```tsx
<button className="transition-transform duration-100 active:scale-95">
  Click me
</button>
```

This should feel immediate, not theatrical.

### Hover Feedback

Use hover motion to signal affordance, not to restyle the whole component.

```tsx
<div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
  Card content
</div>
```

Good hover effects:
- slight lift
- soft shadow shift
- underline or highlight reveal
- icon nudge

## Icon Motion

Icons can reinforce direction and intent:

- rotate for settings or refresh
- nudge arrows for forward motion
- scale or rotate plus icons for add / expand

Keep icon animation tied to the control meaning. Avoid decorative spinning with
no semantic cue.

## Form Feedback

Micro-interactions are especially useful in forms:
- focus rings and label movement
- inline validation transitions
- toggle and switch state changes
- loading or submit confirmation

The animation should make status clearer, not delay input.

## Success and Error States

Use a distinct but brief response for completion and failure.

Examples:
- quick checkmark draw or fade-in on success
- short shake or color transition on error
- inline message reveal instead of modal interruption

Avoid long celebratory motion for routine actions.

## Timing Rules

| Interaction | Typical feel |
|---|---|
| press feedback | very fast |
| hover reveal | fast but not abrupt |
| validation / status | short and readable |
| destructive or risky confirmation | slightly slower for emphasis |

If the motion is noticeable before the state change is understandable, it is too
heavy.

## Design Rules

- tie every micro-interaction to a user-visible state change
- favor transform and opacity over layout-shifting animation
- keep motion subtle enough for repeated use
- respect reduced-motion preferences
- use one dominant cue per interaction instead of stacking many

Micro-interactions work best when they disappear into the product’s rhythm.
