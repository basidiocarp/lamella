# AWK Arrays and Functions

Use this reference when the script needs grouping, counting, or string helpers.

## Associative Arrays

```bash
awk '{count[$1]++} END {for (k in count) print k, count[k]}' file.txt
awk '{sum[$1] += $2} END {for (k in sum) print k, sum[k]}' file.txt
```

## Ordering and Capture

```bash
awk '{lines[NR] = $0} END {for (i = 1; i <= NR; i++) print lines[i]}' file.txt
```

## Useful Functions

```awk
length(s)
substr(s, start, len)
index(s, sub)
split(s, arr, sep)
sub(regex, replacement, s)
gsub(regex, replacement, s)
tolower(s)
toupper(s)
```

## Example

```bash
awk '{split($0, a, ":"); print a[1]}' /etc/passwd
```
