# Accessibility Audit and Testing

## Context

The user needs to audit and improve accessibility to ensure compliance with WCAG standards and provide an inclusive experience for users with disabilities. Focus on automated testing, manual verification, remediation strategies, and establishing ongoing accessibility practices.

## Requirements

$ARGUMENTS

## Instructions

### 1. Automated Testing with axe-core

```javascript
// accessibility-test.js
const { AxePuppeteer } = require("@axe-core/puppeteer");
const puppeteer = require("puppeteer");

class AccessibilityAuditor {
  constructor(options = {}) {
# ... (57 lines trimmed)
  });
});
```

### 2. Color Contrast Validation

```javascript
// color-contrast.js
class ColorContrastAnalyzer {
    constructor() {
        this.wcagLevels = {
            'AA': { normal: 4.5, large: 3 },
            'AAA': { normal: 7, large: 4.5 }
# ... (64 lines trimmed)
    button, input { border: 2px solid var(--border-color) !important; }
}
```

### 3. Keyboard Navigation Testing

```javascript
// keyboard-navigation.js
class KeyboardNavigationTester {
  async testKeyboardNavigation(page) {
    const results = {
      focusableElements: [],
      missingFocusIndicators: [],
# ... (56 lines trimmed)
  }
});
```

### 4. Screen Reader Testing

```javascript
// screen-reader-test.js
class ScreenReaderTester {
  async testScreenReaderCompatibility(page) {
    return {
      landmarks: await this.testLandmarks(page),
      headings: await this.testHeadingStructure(page),
# ... (87 lines trimmed)
<span id="name-error" role="alert" aria-live="polite"></span>`,
};
```

### 5. Manual Testing Checklist

```markdown
## Manual Accessibility Testing

### Keyboard Navigation

- [ ] All interactive elements accessible via Tab
- [ ] Buttons activate with Enter/Space
# ... (27 lines trimmed)
- [ ] Navigation consistent
- [ ] Important actions reversible
```

### 6. Remediation Examples

```javascript
// Fix missing alt text
document.querySelectorAll("img:not([alt])").forEach((img) => {
  const isDecorative =
    img.role === "presentation" || img.closest('[role="presentation"]');
  img.setAttribute("alt", isDecorative ? "" : img.title || "Image");
});
# ... (25 lines trimmed)
  </div>
);
```

### 7. CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests

on: [push, pull_request]

jobs:
# ... (31 lines trimmed)
          name: a11y-report
          path: a11y-report.html
```

### 8. Reporting

```javascript
// report-generator.js
class AccessibilityReportGenerator {
  generateHTMLReport(auditResults) {
    return `
<!DOCTYPE html>
<html lang="en">
# ... (36 lines trimmed)
  }
}
```

## Output Format

1. **Accessibility Score**: Overall compliance with WCAG levels
2. **Violation Report**: Detailed issues with severity and fixes
3. **Test Results**: Automated and manual test outcomes
4. **Remediation Guide**: Step-by-step fixes for each issue
5. **Code Examples**: Accessible component implementations

Focus on creating inclusive experiences that work for all users, regardless of their abilities or assistive technologies.
