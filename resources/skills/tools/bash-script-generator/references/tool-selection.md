# Tool Selection

Use this reference before writing the script body.

## Decision Tree

```text
Simple line filtering?
├─ Yes -> grep
└─ No
   Field-based parsing or calculations?
   ├─ Yes -> awk
   └─ No
      Find/replace or line deletion?
      ├─ Yes -> sed
      └─ No -> consider Python or Perl
```

## Heuristics

- `grep`: presence tests, extraction, counting matches
- `awk`: structured data, reports, numeric logic
- `sed`: rewrites, removals, simple transforms
- Python: stateful parsing, nested formats, large transformations
