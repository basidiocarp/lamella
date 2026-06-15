# Modern PHP 8.3+ Features

Use this reference as a compact checklist for current PHP language features that
matter in modern codebases.

## Strict Types and Rich Type Declarations

```php
<?php

declare(strict_types=1);

interface Timestamped {}
interface Authenticatable {}

function handleUser(Timestamped&Authenticatable $user): void {}
```

Use native types first, then layer PHPDoc only when generics or complex shapes
need extra precision.

## Enums

```php
enum UserStatus: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';

    public function isActive(): bool
    {
        return $this === self::ACTIVE;
    }
}
```

## Readonly Data

```php
readonly class UserData
{
    public function __construct(
        public int $id,
        public string $email,
    ) {}
}
```

Use readonly properties or classes for DTOs and immutable value objects.

## Attributes

```php
#[\Attribute(\Attribute::TARGET_PROPERTY)]
class Validate
{
    public function __construct(public int $min = 0, public int $max = 255) {}
}
```

Attributes are useful for validation, routing, and framework metadata.

## First-Class Callables and `match`

```php
$callback = $service->handle(...);

$color = match ($status) {
    UserStatus::ACTIVE => 'green',
    UserStatus::SUSPENDED => 'yellow',
    default => 'gray',
};
```

## Fibers and Async

Fibers are the language primitive behind several modern async frameworks. Use
them when the project already depends on an async runtime; do not introduce them
just for novelty.

## `never`

```php
function redirect(string $url): never
{
    header("Location: {$url}");
    exit;
}
```

Use `never` for functions that terminate execution by throwing or exiting.

## Quick Reference

| Feature | PHP Version | Example |
| --- | --- | --- |
| Readonly properties | 8.1+ | `public readonly string $name` |
| Readonly classes | 8.2+ | `readonly class User {}` |
| Enums | 8.1+ | `enum Status: string {}` |
| First-class callables | 8.1+ | `$fn = $obj->method(...)` |
| Never type | 8.1+ | `function exitNow(): never` |
| Fibers | 8.1+ | `new \Fiber(fn() => ...)` |
| Intersection types | 8.1+ | `A&B $param` |
| DNF types | 8.2+ | `(A&B)|C $param` |
