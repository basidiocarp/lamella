# Actionlint Usage Reference

`actionlint` is the default static checker for GitHub Actions workflow files.
Use it before debugging broken CI runs in the hosted environment.

## Core Uses

- validate workflow YAML and schema shape
- catch expression mistakes
- check job dependencies and runner labels
- lint shell in `run:` blocks when configured

## Typical Invocation

Use it against:
- one workflow file
- all files in `.github/workflows/`
- the default workflow directory with no explicit path

JSON or other machine-readable output formats are useful when another tool needs
to consume the findings.

## What It Catches Well

- invalid keys or nesting
- expression syntax and type problems
- unknown job references in `needs:`
- bad cron syntax
- suspicious `run:` shell issues

## What It Does Not Replace

`actionlint` is not a full workflow execution simulator. Pair it with:
- local dry runs when needed
- policy checks
- repo-specific security review

## Usage Rule

Run `actionlint` early and automatically. The goal is to catch workflow defects
before they become CI debugging sessions.
