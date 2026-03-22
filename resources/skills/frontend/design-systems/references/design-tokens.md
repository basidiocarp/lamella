# Design Tokens Deep Dive

## Overview

Design tokens are the atomic values of a design system - the smallest pieces that define visual style. They bridge the gap between design and development by providing a single source of truth for colors, typography, spacing, and other design decisions.

## Token Categories

### Color Tokens

```json
{
  "color": {
    "primitive": {
      "gray": {
        "0": { "value": "#ffffff" },
// ... (36 lines trimmed)
    }
  }
}
```

### Typography Tokens

```json
{
  "typography": {
    "fontFamily": {
      "sans": { "value": "Inter, system-ui, sans-serif" },
      "mono": { "value": "JetBrains Mono, Menlo, monospace" }
// ... (26 lines trimmed)
    }
  }
}
```

### Spacing Tokens

```json
{
  "spacing": {
    "0": { "value": "0" },
    "0.5": { "value": "0.125rem" },
    "1": { "value": "0.25rem" },
// ... (16 lines trimmed)
    "24": { "value": "6rem" }
  }
}
```

### Effects Tokens

```json
{
  "shadow": {
    "sm": { "value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    "md": {
      "value": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
// ... (22 lines trimmed)
    "100": { "value": "1" }
  }
}
```

## Semantic Token Mapping

### Light Theme

```json
{
  "semantic": {
    "light": {
      "background": {
        "default": { "value": "{color.primitive.gray.0}" },
// ... (33 lines trimmed)
    }
  }
}
```

### Dark Theme

```json
{
  "semantic": {
    "dark": {
      "background": {
        "default": { "value": "{color.primitive.gray.950}" },
// ... (21 lines trimmed)
    }
  }
}
```

## Token Naming Conventions

### Recommended Structure

```
[category]-[property]-[variant]-[state]

Examples:
- color-background-default
- color-text-primary
- color-border-input-focus
- spacing-component-padding
- typography-heading-lg
```

### Naming Guidelines

1. **Use kebab-case**: `text-primary` not `textPrimary`
2. **Be descriptive**: `button-padding-horizontal` not `btn-px`
3. **Use semantic names**: `danger` not `red`
4. **Include scale info**: `spacing-4` or `font-size-lg`
5. **State suffixes**: `-hover`, `-focus`, `-active`, `-disabled`

## CSS Custom Properties Output

```css
:root {
  /* Primitives */
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-900: #171717;
// ... (27 lines trimmed)
  --border-default: var(--color-gray-800);
  --accent-default: var(--color-blue-400);
}
```

## Token Transformations

### Style Dictionary Transforms

```javascript
const StyleDictionary = require("style-dictionary");

// Custom transform for px to rem
StyleDictionary.registerTransform({
  name: "size/pxToRem",
// ... (17 lines trimmed)
    return `:root {\n${tokens.join("\n")}\n}`;
  },
});
```

### Platform-Specific Outputs

```javascript
// iOS Swift output
public enum DesignTokens {
    public enum Color {
        public static let gray50 = UIColor(hex: "#fafafa")
        public static let gray900 = UIColor(hex: "#171717")
// ... (17 lines trimmed)
    <dimen name="spacing_2">8dp</dimen>
    <dimen name="spacing_4">16dp</dimen>
</resources>
```

## Token Governance

### Change Management

1. **Propose**: Document the change and rationale
2. **Review**: Design and engineering review
3. **Test**: Validate across all platforms
4. **Communicate**: Announce changes to consumers
5. **Deprecate**: Mark old tokens, provide migration path
6. **Remove**: After deprecation period

### Deprecation Pattern

```json
{
  "color": {
    "primary": {
      "value": "{color.primitive.blue.500}",
      "deprecated": true,
      "deprecatedMessage": "Use accent.default instead",
      "replacedBy": "semantic.accent.default"
    }
  }
}
```

## Token Validation

```typescript
interface TokenValidation {
  checkContrastRatios(): ContrastReport;
  validateReferences(): ReferenceReport;
  detectCircularDeps(): CircularDepReport;
  auditNaming(): NamingReport;
// ... (8 lines trimmed)
  const ratio = getContrastRatio(foreground, background);
  return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}
```

## Resources

- [Design Tokens W3C Community Group](https://design-tokens.github.io/community-group/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Tokens Studio](https://tokens.studio/)
- [Open Props](https://open-props.style/)
