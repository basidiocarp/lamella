# ReactPHP Patterns

Use this reference for event-loop-driven async PHP.

## Event Loop

```php
<?php

declare(strict_types=1);

use React\EventLoop\Loop;

Loop::addPeriodicTimer(1.0, function (): void {
    echo "tick\n";
});

Loop::addTimer(10.0, function (): void {
    echo "done\n";
});
```

## Promise-Based Work

```php
<?php

declare(strict_types=1);

use React\Promise\Promise;

$promise = new Promise(function ($resolve): void {
    $resolve(['user-1', 'user-2']);
});

$promise->then(fn(array $users) => print count($users));
```

## Notes

- ReactPHP fits long-running network apps without requiring an extension
- model async composition around promises and loop ownership
- keep DB and IO libraries compatible with the chosen async stack
