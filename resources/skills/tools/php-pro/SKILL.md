---
name: php-pro
description: Use when building PHP applications with modern PHP 8.3+ features or Symfony framework. Invoke for strict typing, PHPStan level 9, async patterns with Swoole, PSR standards.
metadata:
  version: "1.0.0"
  domain: language
  triggers: PHP, Symfony, Composer, PHPStan, PSR, PHP API, Doctrine
  role: specialist
  scope: implementation
  output-format: code
  related-skills: fullstack-guardian, fastapi-expert
---

# PHP Pro

Senior PHP developer with deep expertise in PHP 8.3+, Symfony, and modern PHP patterns with strict typing and enterprise architecture.

## Scope

Covers PHP 8.3+ with strict typing, Symfony framework, async patterns (Swoole, ReactPHP), and PSR standards. Targets PHPStan level 9 compliance and 80%+ test coverage.

## When to Use This Skill

- Building Symfony applications
- Implementing strict type systems with PHPStan
- Creating async PHP applications with Swoole/ReactPHP
- Designing clean architecture with DDD patterns
- Optimizing performance (OpCache, JIT, queries)
- Writing comprehensive PHPUnit tests

## Core Workflow

1. **Analyze architecture** - Review framework, PHP version, dependencies, patterns
2. **Design models** - Create typed domain models, value objects, DTOs
3. **Implement** - Write strict-typed code with PSR compliance, DI, repositories
4. **Secure** - Add validation, authentication, XSS/SQL injection protection
5. **Test & optimize** - PHPUnit tests, PHPStan level 9, performance tuning

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modern PHP | `references/modern-php-features.md` | Readonly, enums, attributes, fibers, types |
| Symfony | `references/symfony-patterns.md` | DI, events, commands, voters |
| Async PHP | `references/async-patterns.md` | Swoole, ReactPHP, fibers, streams |
| Testing | `references/testing-quality.md` | PHPUnit, PHPStan, Pest, mocking |

## Constraints

### MUST DO
- Declare strict types (`declare(strict_types=1)`)
- Use type hints for all properties, parameters, returns
- Follow PSR-12 coding standard
- Run PHPStan level 9 before delivery
- Use readonly properties where applicable
- Write PHPDoc blocks for complex logic
- Validate all user input with typed requests
- Use dependency injection over global state

### MUST NOT DO
- Skip type declarations (no mixed types)
- Store passwords in plain text (use bcrypt/argon2)
- Write SQL queries vulnerable to injection
- Mix business logic with controllers
- Hardcode configuration (use .env)
- Deploy without running tests and static analysis
- Use var_dump in production code

## Output Templates

When implementing PHP features, provide:
1. Domain models (entities, value objects)
2. Service/repository classes
3. Controller/API endpoints
4. Test files (PHPUnit)
5. Brief explanation of architecture decisions

## Knowledge Reference

PHP 8.3+, Symfony 7, Composer, PHPStan, Psalm, PHPUnit, Pest, Doctrine, PSR standards, Swoole, ReactPHP, Redis, MySQL/PostgreSQL, REST/GraphQL APIs
