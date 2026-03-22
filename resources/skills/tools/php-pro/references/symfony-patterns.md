# Symfony Patterns

## Dependency Injection

```php
<?php

declare(strict_types=1);

namespace App\Service;
// ... (20 lines trimmed)
        return $user;
    }
}
```

## Service Configuration (services.yaml)

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true
// ... (22 lines trimmed)
    App\EventSubscriber\:
        resource: '../src/EventSubscriber/'
        tags: ['kernel.event_subscriber']
```

## Controllers with Attributes

```php
<?php

declare(strict_types=1);

namespace App\Controller;
// ... (49 lines trimmed)
        return $this->json($user, context: ['groups' => ['user:detail']]);
    }
}
```

## DTOs with Validation

```php
<?php

declare(strict_types=1);

namespace App\DTO;
// ... (34 lines trimmed)
        public ?bool $isActive = null,
    ) {}
}
```

## Event Subscribers

```php
<?php

declare(strict_types=1);

namespace App\EventSubscriber;
// ... (35 lines trimmed)
        ]);
    }
}
```

## Custom Events

```php
<?php

declare(strict_types=1);

namespace App\Event;
// ... (38 lines trimmed)
        return $user;
    }
}
```

## Console Commands

```php
<?php

declare(strict_types=1);

namespace App\Command;
// ... (42 lines trimmed)
        return Command::SUCCESS;
    }
}
```

## Voters (Authorization)

```php
<?php

declare(strict_types=1);

namespace App\Security\Voter;
// ... (57 lines trimmed)
        return $post->getAuthor()->getId() === $user->getId();
    }
}
```

## Message Handler (Messenger)

```php
<?php

declare(strict_types=1);

namespace App\Message;
// ... (36 lines trimmed)
use Symfony\Component\Messenger\MessageBusInterface;

$this->messageBus->dispatch(new SendWelcomeEmail($user->getId()));
```

## Quick Reference

| Component | Purpose | File Location |
|-----------|---------|---------------|
| Controller | HTTP handlers | `src/Controller/` |
| Service | Business logic | `src/Service/` |
| Repository | Data access | `src/Repository/` |
| Event | Domain events | `src/Event/` |
| EventSubscriber | Event handlers | `src/EventSubscriber/` |
| Command | CLI commands | `src/Command/` |
| Voter | Authorization | `src/Security/Voter/` |
| Message | Async messages | `src/Message/` |
| MessageHandler | Message handlers | `src/MessageHandler/` |
| DTO | Data transfer | `src/DTO/` |
