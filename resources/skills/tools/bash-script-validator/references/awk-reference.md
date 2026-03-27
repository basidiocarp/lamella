# GNU AWK Reference Guide

Use this file as the routing page for AWK guidance in the validator skill.

## Open These References By Task

1. [awk-basics.md](./awk-basics.md)
   Use for syntax, built-in variables, separators, and simple field extraction.
2. [awk-patterns-and-conditionals.md](./awk-patterns-and-conditionals.md)
   Use for matching, numeric comparisons, and control flow.
3. [awk-arrays-and-functions.md](./awk-arrays-and-functions.md)
   Use for associative arrays, counting, grouping, and string helpers.
4. [awk-text-processing-recipes.md](./awk-text-processing-recipes.md)
   Use for logs, CSVs, reports, and shell-oriented recipes.

## Validator Context

Load AWK guidance only when the script under review is doing field-based text
processing or when ShellCheck findings point to fragile parsing pipelines.
