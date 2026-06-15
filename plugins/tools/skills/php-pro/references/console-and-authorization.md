# Console and Authorization

Use this reference for Symfony commands and voters.

## Console Command Shape

```php
<?php

declare(strict_types=1);

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'app:sync-users')]
final class SyncUsersCommand {}
```

## Voter Shape

```php
<?php

declare(strict_types=1);

namespace App\Security\Voter;

final class PostVoter {}
```

## Rules

- commands orchestrate work; services do the real logic
- voters express authorization decisions clearly and centrally
- avoid burying permission checks in random controller branches
