# Mobile Accessibility

Use this reference when an accessible experience must work on iOS, Android, or
React Native rather than only desktop web.

## Core Rules

- Make touch targets large enough to hit reliably.
- Expose clear labels, hints, and state for screen readers.
- Respect text scaling, reduced motion, and high-contrast settings.
- Provide simple alternatives to gesture-heavy interactions.

## Target Size and Spacing

- WCAG 2.2 AA minimum: `24x24px`
- preferred comfortable target: `44x44px` or larger
- keep adjacent destructive actions separated with visible spacing

```css
.interactive {
  min-width: 44px;
  min-height: 44px;
}
```

## Platform Notes

### iOS and VoiceOver

- Use native labels, values, and hints in SwiftUI or UIKit.
- Group related content when swipe navigation would otherwise become noisy.
- Announce status changes for async work or validation feedback.

### Android and TalkBack

- Ensure semantics are present in Compose or XML views.
- Mark live updates so TalkBack announces meaningful state changes.
- Keep custom gestures optional; make the primary action reachable with normal
  focus navigation.

### React Native

- Set `accessible`, `accessibilityLabel`, and `accessibilityHint` intentionally.
- Use `allowFontScaling` unless a component has a documented cap.
- Mirror platform reduced-motion preferences before running non-essential
  animation.

## Gesture and Motion Guidance

- Any swipe, long-press, or drag interaction needs a visible fallback action.
- Avoid motion that carries critical meaning by itself.
- Reduce or remove decorative animation when the user prefers reduced motion.

## Mobile Test Pass

- VoiceOver on iOS
- TalkBack on Android
- enlarged text or Dynamic Type
- reduced motion enabled
- high contrast or increased contrast where the platform supports it

If one of those passes fails, treat it as a product bug, not a platform quirk.
