---
name: deployment
description: Guides deployment strategies, CI/CD pipeline design, Docker containerization, health checks, rollback procedures, and production readiness. Use when implementing deployment workflows, configuring CI/CD pipelines, planning rollback procedures, or preparing production releases.
---

# Deployment

Use this skill when designing or reviewing how software reaches production.

## When to Use

- choosing between rolling, canary, blue-green, or feature-flag release strategies
- designing CI/CD stages and approval gates
- defining health checks and rollback behavior
- preparing a service for production release

## Core Workflow

1. choose the deployment strategy that matches blast radius and rollback needs
2. define health and readiness signals before rollout
3. wire CI/CD stages from validation to deploy to post-deploy verification
4. document rollback steps before shipping

## Core Guardrails

- zero-downtime expectations require compatible rollout design
- health endpoints must reflect real readiness, not just process liveness
- rollback should be tested, not assumed
- configuration should fail fast on bad environment values
