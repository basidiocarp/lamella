# Testing & Quality Assurance

## PHPUnit with Strict Types

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Service;
// ... (66 lines trimmed)
        );
    }
}
```

## Data Providers

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Validator;
// ... (40 lines trimmed)
        ];
    }
}
```

## Laravel Feature Tests

```php
<?php

declare(strict_types=1);

namespace Tests\Feature;
// ... (58 lines trimmed)
            ->assertJsonValidationErrors(['email']);
    }
}
```

## Pest Testing (Modern Alternative)

```php
<?php

declare(strict_types=1);

use App\Models\User;
// ... (37 lines trimmed)
    $this->getJson('/api/users/me')
        ->assertUnauthorized();
});
```

## PHPStan Configuration

```neon
# phpstan.neon
parameters:
    level: 9
    paths:
        - src
// ... (18 lines trimmed)
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
    - vendor/phpstan/phpstan-deprecation-rules/rules.neon
```

## PHPStan Annotations

```php
<?php

declare(strict_types=1);

namespace App\Repository;
// ... (53 lines trimmed)
        return $this->data;
    }
}
```

## Mockery (Advanced Mocking)

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Service;
// ... (42 lines trimmed)
        return new User(id: 1, email: $email, password: 'hashed');
    }
}
```

## Code Coverage

```xml
<!-- phpunit.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
// ... (28 lines trimmed)
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

## Quick Reference

| Tool | Purpose | Command |
|------|---------|---------|
| PHPUnit | Unit/Feature tests | `./vendor/bin/phpunit` |
| Pest | Modern testing | `./vendor/bin/pest` |
| PHPStan | Static analysis | `./vendor/bin/phpstan analyse` |
| Psalm | Alternative static analysis | `./vendor/bin/psalm` |
| PHP-CS-Fixer | Code style | `./vendor/bin/php-cs-fixer fix` |
| PHPMD | Mess detector | `./vendor/bin/phpmd src text cleancode` |

| Assertion | PHPUnit | Pest |
|-----------|---------|------|
| Equality | `$this->assertSame()` | `expect()->toBe()` |
| Type | `$this->assertInstanceOf()` | `expect()->toBeInstanceOf()` |
| Array | `$this->assertContains()` | `expect()->toContain()` |
| Exception | `$this->expectException()` | `expect()->toThrow()` |
| Count | `$this->assertCount()` | `expect()->toHaveCount()` |
