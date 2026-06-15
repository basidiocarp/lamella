# Updating Settings Files

## Update Rules

- write to a temp file first, then move into place
- update only the fields you intend to change
- preserve markdown body content unless the update explicitly changes it

## Good Pattern

```bash
tmp_file="${FILE}.tmp.$$"
sed "s/^iteration: .*/iteration: ${NEXT_ITERATION}/" "$FILE" > "$tmp_file"
mv "$tmp_file" "$FILE"
```
