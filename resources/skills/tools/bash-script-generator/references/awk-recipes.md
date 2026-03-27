# awk Recipes

Use `awk` for field-based parsing and calculations.

## Core Examples

```bash
awk '{print $1, $3}' file.txt
awk -F',' '{print $1, $3}' file.csv
awk '$3 > 100' data.txt
awk '{sum += $3} END {print sum}' numbers.txt
awk '{count[$1]++} END {for (k in count) print k, count[k]}' file.txt
```

## Log Analysis

```bash
awk '{print $9}' access.log | sort | uniq -c | sort -rn
awk '{print substr($4, 2, 14)}' access.log | uniq -c
```

## Output Formatting

```bash
awk '{printf "%-20s %10.2f\n", $1, $2}' data.txt
```
