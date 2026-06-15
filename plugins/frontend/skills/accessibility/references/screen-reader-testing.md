---
name: screen-reader-testing
description: Test web applications with screen readers including VoiceOver, NVDA, and JAWS. Use when validating screen reader compatibility, debugging accessibility issues, or ensuring assistive technology support.
---

# Screen Reader Testing

## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
- [VoiceOver Quick Start](#voiceover-quick-start)
- [NVDA Quick Start](#nvda-quick-start)
- [Best Practices](#best-practices)
- [References](#references)

Practical guide to testing web applications with screen readers for comprehensive accessibility validation.

## When to Use This Skill

- Validating screen reader compatibility
- Testing ARIA implementations
- Debugging assistive technology issues
- Verifying form accessibility
- Testing dynamic content announcements

## Core Concepts

### Major Screen Readers

| Screen Reader | Platform  | Browser        | Usage |
| ------------- | --------- | -------------- | ----- |
| **VoiceOver** | macOS/iOS | Safari         | ~15%  |
| **NVDA**      | Windows   | Firefox/Chrome | ~31%  |
| **JAWS**      | Windows   | Chrome/IE      | ~40%  |
| **TalkBack**  | Android   | Chrome         | ~10%  |

### Testing Priority

```
Minimum Coverage:
1. NVDA + Firefox (Windows)
2. VoiceOver + Safari (macOS)
3. VoiceOver + Safari (iOS)
```

### Screen Reader Modes

| Mode               | Purpose                | When Used         |
| ------------------ | ---------------------- | ----------------- |
| **Browse/Virtual** | Read content           | Default reading   |
| **Focus/Forms**    | Interact with controls | Filling forms     |
| **Application**    | Custom widgets         | ARIA applications |

## VoiceOver Quick Start

```
Enable: Cmd + F5
VO = Ctrl + Option (VoiceOver modifier)

VO + Right/Left    Navigate elements
VO + Space         Activate element
VO + U             Open rotor (headings, links, etc.)
VO + Cmd + H       Next heading
Tab                Next focusable element
```

## NVDA Quick Start

```
Start: Ctrl + Alt + N
Insert = NVDA modifier

Arrow keys         Navigate content
H / Shift+H        Next/prev heading
1-6                Heading by level
F                  Next form field
D                  Next landmark
NVDA + F7          Elements list
NVDA + Space       Toggle browse/focus mode
```

## Best Practices

### Do's

- **Test with actual screen readers** - Not just simulators
- **Use semantic HTML first** - ARIA is supplemental
- **Test in browse and focus modes** - Different experiences
- **Verify focus management** - Especially for SPAs
- **Test keyboard only first** - Foundation for SR testing

### Don'ts

- **Don't assume one SR is enough** - Test multiple
- **Don't ignore mobile** - Growing user base
- **Don't test only happy path** - Test error states
- **Don't skip dynamic content** - Most common issues

## References

- [testing-checklists.md](testing-checklists.md) - VoiceOver & NVDA test scripts
- [screen-reader-commands.md](screen-reader-commands.md) - Full command reference for all screen readers
- [aria-patterns.md](aria-patterns.md) - Modal, live region, and tab patterns

### External Resources

- [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome/mac)
- [NVDA User Guide](https://www.nvaccess.org/files/nvda/documentation/userGuide.html)
- [WebAIM Screen Reader Survey](https://webaim.org/projects/screenreadersurvey/)
