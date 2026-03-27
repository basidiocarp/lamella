# Events and Messenger

Use this reference for decoupled Symfony workflows.

## Event Subscriber

```php
<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

final class UserSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [];
    }
}
```

## Messenger Dispatch

```php
$this->messageBus->dispatch(new SendWelcomeEmail($user->getId()));
```

## Rules

- use events for cross-cutting reactions, not primary business flow
- use Messenger for async work that can be retried or delayed
- keep message payloads small and explicit
