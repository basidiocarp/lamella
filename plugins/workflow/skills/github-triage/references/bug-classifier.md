# Bug Classifier

Classify a GitHub issue into one of four categories: **bug**, **feature**, **question**, or **invalid**.

## Input

- Issue URL or issue number
- Issue title, body, and labels

## Classification Logic

1. **Bug**: reports broken behavior, unexpected error, or regression (symptoms: "doesn't work", "got an error", "broke after update")
2. **Feature**: requests new capability or enhancement (symptoms: "add support for", "would be nice if", no error present)
3. **Question**: asks how to use the tool, how something works, or seeks help (symptoms: "how do I", "is this possible", no bug report)
4. **Invalid**: duplicate, out of scope, incomplete, or not a real issue

## Output Schema

```json
{
  "verdict": "bug|feature|question|invalid",
  "reasoning": "one-line summary of classification rationale",
  "evidence_permalink": "https://github.com/owner/repo/issues/NUMBER"
}
```

## Evidence Rule

The `evidence_permalink` MUST link to the GitHub issue itself. If the issue title, body, or label field contains the primary signal, cite the issue URL. Do not invent or guess — cite what the issue actually says.

## Example

```json
{
  "verdict": "bug",
  "reasoning": "Reports 'service crashes on startup' with reproducible steps",
  "evidence_permalink": "https://github.com/example/repo/issues/42"
}
```
