# Detection Patterns

Code patterns for detecting criteria compliance.

## Frontmatter Parsing

```python
import yaml
import re

def parse_frontmatter(content: str) -> dict | None:
    """Extract and parse YAML frontmatter from markdown."""
// ... (20 lines trimmed)
            issues.append(f"Missing required field: {field}")

    return issues
```

## Keyword Detection

```python
def has_keywords(text: str, keywords: list[str]) -> bool:
    """Check if text contains any of the keywords (case-insensitive)."""
    text_lower = text.lower()
    return any(kw.lower() in text_lower for kw in keywords)

def count_keywords(text: str, keywords: list[str]) -> int:
    """Count how many keywords appear in text."""
    text_lower = text.lower()
    return sum(1 for kw in keywords if kw.lower() in text_lower)

# Example usage
has_trigger = has_keywords(description, ['when', 'use', 'trigger'])
has_error_handling = has_keywords(content, ['error', 'failure', 'fallback', 'exception'])
has_examples = has_keywords(content, ['example', 'usage', 'sample'])
```

## Overlap Detection (Duplication Check)

```python
def jaccard_similarity(text1: str, text2: str) -> float:
    """Calculate Jaccard similarity between two texts."""
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    intersection = words1 & words2
// ... (18 lines trimmed)
                ))

    return duplicates
```

## Token Counting (Approximate)

```python
def estimate_tokens(text: str) -> int:
    """Rough estimate of token count (1 token ≈ 0.75 words)."""
    word_count = len(text.split())
    return int(word_count * 1.3)

def check_token_budget(content: str, max_tokens: int = 5000) -> tuple[bool, int]:
    """Check if content is within token budget."""
    tokens = estimate_tokens(content)
    return tokens <= max_tokens, tokens
```

## Section Detection

```python
def extract_sections(content: str) -> dict[str, str]:
    """Extract markdown sections by header."""
    sections = {}
    current_header = "preamble"
    current_content = []
// ... (17 lines trimmed)
    """Check if content has any of the named sections."""
    sections = extract_sections(content)
    return any(name.lower() in sections for name in section_names)
```

## Hardcoded Path Detection

```python
import re

def find_hardcoded_paths(content: str) -> list[str]:
    """Find hardcoded file system paths."""
    patterns = [
// ... (14 lines trimmed)
def has_hardcoded_paths(content: str) -> bool:
    """Check if content contains hardcoded paths."""
    return len(find_hardcoded_paths(content)) > 0
```

## Name Validation

```python
import re

def validate_name(name: str) -> tuple[bool, list[str]]:
    """Validate name against naming conventions."""
    issues = []
// ... (11 lines trimmed)
        issues.append("Name cannot contain spaces")

    return len(issues) == 0, issues
```
