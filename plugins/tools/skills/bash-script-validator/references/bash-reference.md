# Bash Reference Guide

Use this file as the routing page for Bash-specific guidance in the validator
skill.

## Open These References By Task

1. [bash-vs-posix.md](./bash-vs-posix.md)
   Use when checking whether a script is Bash-only or should stay portable.
2. [bash-core-syntax.md](./bash-core-syntax.md)
   Use for variables, quoting, control flow, functions, and redirection.
3. [bash-error-handling.md](./bash-error-handling.md)
   Use for strict mode, traps, exit handling, and safe cleanup.
4. [bash-best-practices.md](./bash-best-practices.md)
   Use for validation-oriented habits such as quoting, command checks, and
   local variables.

## Validator Context

Load Bash guidance only when the script actually targets Bash features or when
the validator needs to explain why a construct is non-POSIX or risky.
