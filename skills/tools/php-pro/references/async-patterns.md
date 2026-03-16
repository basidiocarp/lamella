# Async PHP Patterns

## Swoole HTTP Server

```php
<?php

declare(strict_types=1);

use Swoole\HTTP\Server;
// ... (33 lines trimmed)
}

$server->start();
```

## Swoole Coroutines

```php
<?php

declare(strict_types=1);

use Swoole\Coroutine;
// ... (33 lines trimmed)

    print_r($results);
});
```

## Swoole Async MySQL

```php
<?php

declare(strict_types=1);

use Swoole\Coroutine;
// ... (28 lines trimmed)

    $mysql->close();
});
```

## Swoole Channel (Communication)

```php
<?php

declare(strict_types=1);

use Swoole\Coroutine;
// ... (24 lines trimmed)
        }
    });
});
```

## ReactPHP Event Loop

```php
<?php

declare(strict_types=1);

require 'vendor/autoload.php';
// ... (29 lines trimmed)
Loop::addTimer(10.0, function () {
    echo "This runs once after 10 seconds\n";
});
```

## ReactPHP Async MySQL

```php
<?php

declare(strict_types=1);

require 'vendor/autoload.php';
// ... (24 lines trimmed)
        $user = $result->resultRows[0] ?? null;
        var_dump($user);
    });
```

## ReactPHP Promises

```php
<?php

declare(strict_types=1);

use React\Promise\Promise;
// ... (37 lines trimmed)
])->then(function ($users) {
    echo "Fetched " . count($users) . " users\n";
});
```

## PHP Fibers (Native PHP 8.1+)

```php
<?php

declare(strict_types=1);

// Simple async function using fibers
// ... (39 lines trimmed)

echo "{$result1}\n";
echo "{$result2}\n";
```

## Amphp Framework

```php
<?php

declare(strict_types=1);

require 'vendor/autoload.php';
// ... (29 lines trimmed)
);

$server->start();
```

## Quick Reference

| Technology | Use Case | Performance |
|------------|----------|-------------|
| Swoole | High-performance servers, WebSockets | Very High |
| ReactPHP | Event-driven apps, real-time | High |
| Amphp | Modern async framework | High |
| Fibers | Native async (PHP 8.1+) | Medium |
| Generators | Simple async patterns | Medium |

| Feature | Swoole | ReactPHP | Amphp |
|---------|--------|----------|-------|
| Coroutines | Yes | No (Promises) | Yes (Fibers) |
| HTTP Server | Built-in | Via package | Via package |
| WebSockets | Built-in | Via package | Via package |
| Extension | Required | Not required | Not required |
| Learning Curve | Medium | Low | Medium |
