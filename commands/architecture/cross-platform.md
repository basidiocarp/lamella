---
description: Cross-platform terminal patterns for Windows, macOS, and Linux with portable code examples
allowed-tools: Read
argument-hint: "[windows | macos | linux | portable]"
---

# Cross-Platform Compatibility Guide

Provide cross-platform guidance. Follow these steps:

## 1. Query

The user needs help with: $ARGUMENTS

## 2. Read Documentation

Apply cross-platform terminal knowledge covering line endings, path handling, and portability patterns.

Also consider Windows-specific terminal behavior (ConPTY, Windows Terminal, VT sequences).

## 3. Key Differences

### Line Endings
| Platform | Ending |
|----------|--------|
| Unix/Linux/macOS | LF (\n) |
| Windows | CR+LF (\r\n) |

### Path Separators
| Platform | Path | PATH |
|----------|------|------|
| Unix | / | : |
| Windows | \ | ; |

### Environment Variables
| Purpose | Unix | Windows |
|---------|------|---------|
| Home | $HOME | %USERPROFILE% |
| Temp | $TMPDIR | %TEMP% |
| User | $USER | %USERNAME% |

## 4. Common Patterns

### Portable Path Handling (Python)
```python
from pathlib import Path
path = Path('dir') / 'subdir' / 'file.txt'
```

### Color Support Detection
```python
def supports_color():
    if os.environ.get('NO_COLOR'):
        return False
    if not sys.stdout.isatty():
        return False
    return True
```

### Terminal Size
```python
import shutil
size = shutil.get_terminal_size(fallback=(80, 24))
```

## 5. Provide Response

Based on the user's query:
1. Identify the cross-platform concern
2. Show platform-specific implementations
3. Provide portable abstraction code
4. Note edge cases and gotchas
5. Recommend cross-platform libraries if applicable
