# Static Analysis

Use this reference for PHPStan-heavy codebases.

## PHPStan Config

```neon
parameters:
    level: 9
    paths:
        - src
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
```

## Analysis Rules

- keep level high and intentional
- add type annotations when native types are not expressive enough
- fix root typing issues instead of suppressing warnings casually
