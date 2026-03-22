# Mobile Accessibility

## Overview

Mobile accessibility ensures apps work for users with disabilities on iOS and Android devices. This includes support for screen readers (VoiceOver, TalkBack), motor impairments, and various visual disabilities.

## Touch Target Sizing

### Minimum Sizes

```css
/* WCAG 2.2 Level AA: 24x24px minimum */
.interactive-element {
  min-width: 24px;
  min-height: 24px;
}
// ... (9 lines trimmed)
  min-width: 48px;
  min-height: 48px;
}
```

### Touch Target Spacing

```tsx
// Ensure adequate spacing between touch targets
function ButtonGroup({ buttons }) {
  return (
    <div className="flex gap-3">
      {" "}
// ... (19 lines trimmed)
    </button>
  );
}
```

## iOS VoiceOver

### React Native Accessibility Props

```tsx
import { View, Text, TouchableOpacity, AccessibilityInfo } from "react-native";

// Basic accessible button
function AccessibleButton({ onPress, title, hint }) {
  return (
// ... (62 lines trimmed)
    </View>
  );
}
```

### SwiftUI Accessibility

```swift
import SwiftUI

struct AccessibleButton: View {
    let title: String
    let action: () -> Void
// ... (48 lines trimmed)
        }
    }
}
```

## Android TalkBack

### Jetpack Compose Accessibility

```kotlin
import androidx.compose.ui.semantics.*

@Composable
fun AccessibleButton(
    onClick: () -> Unit,
// ... (71 lines trimmed)
        }
    )
}
```

### Android XML Views

```xml
<!-- Accessible button -->
<Button
    android:id="@+id/submit_button"
    android:layout_width="wrap_content"
    android:layout_height="48dp"
// ... (22 lines trimmed)
<TextView
    android:id="@+id/status"
    android:accessibilityLiveRegion="polite" />
```

```kotlin
// Kotlin accessibility
binding.submitButton.apply {
    contentDescription = getString(R.string.submit_form)
    accessibilityDelegate = object : View.AccessibilityDelegate() {
        override fun onInitializeAccessibilityNodeInfo(
// ... (13 lines trimmed)

// Announce changes
binding.counter.announceForAccessibility("Count updated to $count")
```

## Gesture Accessibility

### Alternative Gestures

```tsx
// React Native: Provide alternatives to complex gestures
function SwipeableCard({ item, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
// ... (30 lines trimmed)
    </View>
  );
}
```

### Motion and Animation

```tsx
// Respect reduced motion preference
import { AccessibilityInfo } from "react-native";

function AnimatedComponent() {
  const [reduceMotion, setReduceMotion] = useState(false);
// ... (20 lines trimmed)
    </Animated.View>
  );
}
```

## Dynamic Type / Text Scaling

### iOS Dynamic Type

```swift
// SwiftUI
Text("Hello, World!")
    .font(.body) // Automatically scales with Dynamic Type

Text("Fixed Size")
    .font(.system(size: 16, design: .default))
    .dynamicTypeSize(.large) // Cap at large

// Allow unlimited scaling
Text("Scalable")
    .font(.body)
    .minimumScaleFactor(0.5)
    .lineLimit(nil)
```

### Android Text Scaling

```xml
<!-- Use sp for text sizes -->
<TextView
    android:textSize="16sp"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" />

<!-- In styles.xml -->
<style name="TextAppearance.Body">
    <item name="android:textSize">16sp</item>
    <item name="android:lineHeight">24sp</item>
</style>
```

```kotlin
// Compose: Text automatically scales
Text(
    text = "Hello, World!",
    style = MaterialTheme.typography.bodyLarge
)

// Limit scaling if needed
Text(
    text = "Limited scaling",
    fontSize = 16.sp,
    maxLines = 2,
    overflow = TextOverflow.Ellipsis
)
```

### React Native Text Scaling

```tsx
import { Text, PixelRatio } from 'react-native';

// Allow text scaling (default)
<Text allowFontScaling={true}>Scalable text</Text>

// ... (8 lines trimmed)
  const scale = PixelRatio.getFontScale();
  return size * Math.min(scale, 1.5); // Cap at 1.5x
};
```

## Testing Checklist

```markdown
## VoiceOver (iOS) Testing

- [ ] All interactive elements have labels
- [ ] Swipe navigation covers all content in logical order
- [ ] Custom actions available for complex interactions
// ... (23 lines trimmed)
- [ ] Content visible in high contrast mode
- [ ] Color not sole indicator
- [ ] Animations respect reduced motion
```

## Resources

- [Apple Accessibility Programming Guide](https://developer.apple.com/accessibility/)
- [Android Accessibility Developer Guide](https://developer.android.com/guide/topics/ui/accessibility)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Mobile Accessibility WCAG](https://www.w3.org/TR/mobile-accessibility-mapping/)
