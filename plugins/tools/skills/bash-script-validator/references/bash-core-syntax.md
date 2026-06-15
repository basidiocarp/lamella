# Bash Core Syntax

Use this reference for everyday Bash structure.

## Variables and Arithmetic

```bash
var="value"
readonly CONST="constant"
result=$((5 + 3))
((counter++))
```

## Quoting

```bash
echo "Value: $var"
echo 'Literal text'
cp "$source" "$destination"
```

Quote expansions unless you explicitly want word splitting or glob expansion.

## Control Flow

```bash
if [[ condition ]]; then
  echo "ok"
elif [[ other ]]; then
  echo "other"
fi
```

## Functions

```bash
my_function() {
  local value="$1"
  echo "$value"
}
```

## Redirection

```bash
command > out.txt
command 2> err.txt
command >> append.txt
grep pattern <<< "$value"
```
