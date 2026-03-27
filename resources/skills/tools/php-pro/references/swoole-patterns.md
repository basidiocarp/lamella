# Swoole Patterns

Use this reference when the project targets Swoole as the async runtime.

## HTTP Server

```php
<?php

declare(strict_types=1);

use Swoole\HTTP\Server;

$server = new Server('0.0.0.0', 9501);
$server->on('request', function ($request, $response): void {
    $response->end('OK');
});
$server->start();
```

## Coroutines and Channels

```php
<?php

declare(strict_types=1);

use Swoole\Coroutine;
use Swoole\Coroutine\Channel;

Coroutine\run(function (): void {
    $channel = new Channel(1);
    go(fn() => $channel->push('done'));
    echo $channel->pop();
});
```

## Notes

- Swoole delivers strong throughput but requires an extension
- keep blocking calls out of coroutine paths
- treat lifecycle hooks and worker configuration as production concerns, not
  just code concerns
