# HTTP and Validation

Use this reference for controllers, DTOs, and request-shape enforcement.

## Controller Shape

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{
    #[Route('/users/{id}', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        return $this->json(['id' => $id]);
    }
}
```

## DTO Validation

```php
final readonly class CreateUserRequest
{
    public function __construct(
        public string $email,
        public ?bool $isActive = null,
    ) {}
}
```

## Rules

- keep controllers thin
- validate boundary inputs early
- use DTOs when request shape deserves explicit structure
