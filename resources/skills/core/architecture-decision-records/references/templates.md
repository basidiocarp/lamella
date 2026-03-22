# ADR Templates

## Template 1: Standard ADR (MADR Format)

```markdown
# ADR-NNNN: [Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]
// ... (66 lines trimmed)

- [External documentation]
- [Internal docs]
```

---

## Template 2: Lightweight ADR

```markdown
# ADR-NNNN: [Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Deciders**: @person1, @person2
// ... (13 lines trimmed)
**Bad**: [Drawbacks]

**Mitigations**: [How to address drawbacks]
```

---

## Template 3: Y-Statement Format

```markdown
# ADR-NNNN: [Title]

In the context of **[situation/requirement]**,
facing **[problem/challenge]**,
we decided for **[chosen option]**
and against **[rejected options]**,
to achieve **[desired outcomes]**,
accepting that **[trade-offs/consequences]**.
```

---

## Template 4: ADR for Deprecation

```markdown
# ADR-NNNN: Deprecate [Previous Decision]

## Status

Accepted (Supersedes ADR-XXXX)
// ... (31 lines trimmed)

- [What we learned from the original decision]
- [How to avoid this in future]
```

---

## Template 5: RFC Style (Extended)

```markdown
# RFC-NNNN: [Title]

## Summary

[1-2 paragraph executive summary]
// ... (34 lines trimmed)
## References

[Links to relevant documentation]
```

---

## Template Comparison

| Template | Lines | Best For | Formality |
|----------|-------|----------|-----------|
| Standard MADR | 50-80 | Major architectural decisions | High |
| Lightweight | 15-25 | Quick decisions, small teams | Low |
| Y-Statement | 5-10 | Super concise, obvious decisions | Minimal |
| Deprecation | 40-60 | Reversing previous decisions | Medium |
| RFC Style | 80-120 | Complex proposals needing discussion | High |
