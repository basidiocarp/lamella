# grep Recipes

Use `grep` for simple selection and filtering.

## Common Patterns

```bash
grep "pattern" file.txt
grep -i "error" app.log
grep -E "ERROR|WARN" app.log
grep -n "TODO" src/*.sh
grep -v -f known_errors.txt app.log
```

## Log Analysis

```bash
find /var/log -name "*.log" -mmin -60 -exec grep "ERROR" {} +
grep "ERROR" app.log | cut -d':' -f3 | sort | uniq -c | sort -rn
```

## Notes

- use `-F` for fixed strings when regex is unnecessary
- use `-a` only when you explicitly want to treat binary as text
