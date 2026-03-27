# AWK Text Processing Recipes

Use this reference for shell-facing AWK recipes.

## Log Analysis

```bash
awk '{print $9}' access.log | sort | uniq -c | sort -rn
awk '{sum += $10} END {print sum}' access.log
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head
```

## CSV Processing

```bash
awk -F',' 'NR > 1 {print $1, $3}' file.csv
awk -F',' '$3 > 100 {print $0}' file.csv
```

## System Data

```bash
awk -F':' '{print $1, $7}' /etc/passwd
df -h | awk 'NR > 1 {print $1, $5}'
```

## Reporting

```bash
awk '{printf "%-20s %10.2f\n", $1, $2}' data.txt
```
