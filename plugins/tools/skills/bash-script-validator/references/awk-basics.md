# AWK Basics

Use this reference for syntax, records, fields, and separators.

## Core Shape

```awk
BEGIN { /* setup */ }
pattern { /* per-record action */ }
END { /* final output */ }
```

## Common Invocation Forms

```bash
awk '{print $1}' file.txt
awk -F',' '{print $1, $3}' file.csv
awk -f script.awk file.txt
```

## Built-In Variables

```awk
$0      # entire line
$1      # first field
$NF     # last field
NF      # number of fields
NR      # absolute line number
FNR     # line number in current file
FS      # input separator
OFS     # output separator
```

## Reliable Field Examples

```bash
awk '{print $1}' file.txt
awk '{print NR, $0}' file.txt
awk -F':' '{print $1, $7}' /etc/passwd
```
