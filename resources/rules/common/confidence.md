---
description: "Check for blockers and uncertainty before implementation. Do not force fake precision."
---

# Confidence Check

Do not start implementation while key uncertainty remains unresolved.

## Check Before Acting

- is there already an implementation or existing pattern to reuse?
- does the chosen approach match the repo architecture?
- are any unstable APIs or external dependencies still unverified?
- is the root cause or actual goal understood clearly enough to proceed?

## Action

- if the unknowns are minor, proceed and state assumptions
- if the unknowns would change the implementation, clarify or do discovery first
- do not invent numeric confidence scores unless the task explicitly calls for one
