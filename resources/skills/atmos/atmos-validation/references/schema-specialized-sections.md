# Specialized Schema Sections

## Backends

Backend definitions usually wrap one backend type at a time and allow custom object payloads per backend implementation.

## Workflows

Workflow schema branches describe named steps and are validated separately from ordinary stack manifests.

## Website-Only Extensions

Some sections, such as source and isolated provision helpers, appear only in the richer public website schema. When debugging a mismatch between local embedded schemas and the public docs, check whether you are looking at a website-only definition.
