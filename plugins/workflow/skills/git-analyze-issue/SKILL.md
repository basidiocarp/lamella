---
name: git-analyze-issue
description: "Analyzes a GitHub issue and creates a detailed technical specification."
argument-hint: Issue number (e.g., 42)
origin: lamella
---

# GitHub Issue to Technical Spec

Use this skill to turn issue `#$ARGUMENTS` into a saved technical specification.

## Core Workflow

1. check whether the issue is already stored locally
2. fetch it from GitHub if needed
3. understand requirements and related code
4. write the technical specification
5. save it under `./specs/issues/`

## Required Sections

- issue summary
- problem statement
- technical approach
- implementation plan
- test plan
- files to modify or create
- success criteria
- out of scope
