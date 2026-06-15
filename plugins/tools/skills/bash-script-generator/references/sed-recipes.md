# sed Recipes

Use `sed` for substitutions, deletions, and direct line edits.

## Substitution

```bash
sed 's/old/new/' file.txt
sed 's/old/new/g' file.txt
sed -E 's/[0-9]+/<num>/g' file.txt
sed -i.bak 's/localhost/db.example.com/g' config.env
```

## Deletion

```bash
sed '5d' file.txt
sed '10,20d' file.txt
sed '/^#/d' config.ini
sed '/pattern/!d' file.txt
```

## Line Operations

```bash
sed -n '10p' file.txt
sed -n '10,20p' file.txt
sed '/pattern/a\Inserted line' file.txt
sed '/pattern/c\Replacement line' file.txt
```

## Notes

- prefer `-E` for readable extended regex
- be careful with in-place edits on macOS versus GNU `sed`
