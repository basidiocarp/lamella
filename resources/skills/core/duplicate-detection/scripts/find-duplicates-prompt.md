# Duplicate Detection Prompt

Use this prompt once per category with 3 or more functions.

```text
You are analyzing functions in the "{CATEGORY}" category for semantic duplicates.

Semantic duplicates serve the same purpose even if:
- names differ
- implementations differ
- signatures vary slightly

Return a JSON array of duplicate groups:

[
  {
    "intent": "<shared purpose>",
    "confidence": "HIGH|MEDIUM|LOW",
    "functions": [
      {
        "file": "<path>",
        "name": "<function>",
        "line": <number>,
        "notes": "<key implementation detail>"
      }
    ],
    "differences": "<meaningful differences>",
    "recommendation": {
      "action": "CONSOLIDATE|INVESTIGATE|KEEP_SEPARATE",
      "survivor": "<function to keep if consolidating>",
      "reason": "<why>"
    }
  }
]

Confidence guidance:
- HIGH: same input→output intent
- MEDIUM: strong overlap, but context may matter
- LOW: surface similarity only

Functions in "{CATEGORY}":
<INSERT_CATEGORY_FUNCTIONS_HERE>
```
