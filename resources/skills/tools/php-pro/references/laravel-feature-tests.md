# Laravel Feature Tests

Use this reference for request-level Laravel testing.

## Feature Test Shape

```php
<?php

declare(strict_types=1);

namespace Tests\Feature;

final class UserApiTest extends TestCase
{
    public function test_it_validates_email(): void
    {
        $this->postJson('/api/users', ['email' => 'bad'])
            ->assertJsonValidationErrors(['email']);
    }
}
```

## Rules

- test response shape and validation behavior together
- use factories for readable setup
- keep database state explicit in each scenario
