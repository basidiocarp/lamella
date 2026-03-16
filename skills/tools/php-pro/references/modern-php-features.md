# Modern PHP 8.3+ Features

## Strict Types & Type Declarations

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;
// ... (24 lines trimmed)
interface Authenticatable {}

function handleUser(Timestamped&Authenticatable $user): void {}
```

## Enums with Methods

```php
<?php

declare(strict_types=1);

enum UserStatus: string
// ... (36 lines trimmed)
        return $this->value >= 200 && $this->value < 300;
    }
}
```

## Readonly Properties & Classes

```php
<?php

declare(strict_types=1);

// Readonly class (PHP 8.2+)
// ... (26 lines trimmed)
        private string $cache = '',
    ) {}
}
```

## Attributes (Metadata)

```php
<?php

declare(strict_types=1);

#[\Attribute(\Attribute::TARGET_CLASS)]
// ... (34 lines trimmed)
    #[Validate(min: 8, max: 100)]
    public string $password;
}
```

## First-Class Callables

```php
<?php

declare(strict_types=1);

class UserService
// ... (17 lines trimmed)
    array: $numbers,
    callback: fn($n) => $n % 2 === 0,
);
```

## Match Expressions

```php
<?php

declare(strict_types=1);

function getStatusColor(UserStatus $status): string
// ... (26 lines trimmed)
        default => 'Unknown',
    };
}
```

## Fibers (PHP 8.1+)

```php
<?php

declare(strict_types=1);

// Basic fiber example
// ... (25 lines trimmed)
    }
    return $fiber->resume();
}
```

## Never Type

```php
<?php

declare(strict_types=1);

function redirect(string $url): never
// ... (16 lines trimmed)
        throw new self("Resource not found: {$resource}");
    }
}
```

## Quick Reference

| Feature | PHP Version | Usage |
|---------|-------------|-------|
| Readonly properties | 8.1+ | `public readonly string $name` |
| Readonly classes | 8.2+ | `readonly class User {}` |
| Enums | 8.1+ | `enum Status: string {}` |
| First-class callables | 8.1+ | `$fn = $obj->method(...)` |
| Never type | 8.1+ | `function exit(): never` |
| Fibers | 8.1+ | `new \Fiber(fn() => ...)` |
| Pure intersection types | 8.1+ | `A&B $param` |
| DNF types | 8.2+ | `(A&B)\|C $param` |
| Constants in traits | 8.2+ | `trait T { const X = 1; }` |
