# Finding Template

Use one finding block per issue.

```markdown
### [SEVERITY] Short Title

**File:** `path/to/file.ts:42`
**Blast Radius:** HIGH
**Test Coverage:** NO

**Issue**
Plain-language description of what is wrong.

**Why It Matters**
Concrete impact: exploitability, correctness break, or operational risk.

**Evidence**
- key condition or removed guard
- relevant call path or affected users

**Recommendation**
Specific fix or guardrail to add.
```

## Rules

- do not bury the core defect in long prose
- prefer one exploit or failure scenario over many vague hypotheticals
- include proof-of-concept code only when it materially clarifies the risk
