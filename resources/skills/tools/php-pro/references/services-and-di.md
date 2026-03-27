# Services and Dependency Injection

Use this reference for container-driven service composition.

## Service Class Shape

```php
<?php

declare(strict_types=1);

namespace App\Service;

final class UserService
{
    public function __construct(private UserRepository $users) {}
}
```

## `services.yaml`

```yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
```

## Rules

- prefer constructor injection
- keep services focused on business operations
- use explicit config only when defaults are not enough
