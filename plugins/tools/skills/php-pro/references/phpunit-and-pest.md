# PHPUnit and Pest

Use this reference for standard PHP test shapes.

## PHPUnit

```php
<?php

declare(strict_types=1);

final class UserServiceTest extends TestCase
{
    public function test_it_returns_a_user(): void
    {
        self::assertSame(1, 1);
    }
}
```

## Pest

```php
<?php

declare(strict_types=1);

it('returns unauthorized for guests', function (): void {
    $this->getJson('/api/users/me')->assertUnauthorized();
});
```

## Rules

- pick one dominant style per repo
- keep assertion messages intention-revealing
- prefer strict assertions for typed code
