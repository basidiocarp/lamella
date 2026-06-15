# OPA Policies for Atmos

Use Rego policies to reject invalid or unsafe component configuration before it
reaches provisioners.

## Core Rules

- use `package atmos`
- emit failures through `errors`
- keep policies focused on one validation concern at a time
- prefer reusable constants and helpers when multiple policies share rules

## Common Policy Targets

- required fields
- numeric bounds
- string patterns and naming rules
- tag requirements
- command-aware restrictions during plan or apply
- blocked CLI overrides for sensitive inputs

## Practical Guidance

- make error messages actionable
- avoid giant policies that mix unrelated checks
- extract shared constants for environment names, tag lists, and regexes
