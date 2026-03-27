# AWK Patterns and Conditionals

Use this reference for matching rules and conditional logic.

## Pattern Matching

```bash
awk '/error/ {print}' app.log
awk '$1 == "active"' data.txt
awk '$2 != "disabled"' data.txt
```

## Numeric Conditions

```bash
awk '$3 > 100' data.txt
awk '$1 > 100 && $2 == "active"' data.txt
awk '$1 > 100 || $2 > 200' data.txt
```

## BEGIN and END

```bash
awk 'BEGIN {FS=","} {count++} END {print count}' file.csv
```

## Inline Conditionals

```bash
awk '{if ($3 > 100) print "High"; else print "Low"}' file.txt
awk '{print ($3 > 100 ? "High" : "Low"), $0}' file.txt
```
