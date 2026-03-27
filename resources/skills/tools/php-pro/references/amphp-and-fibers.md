# Amphp and Fibers

Use this reference for fiber-backed async PHP.

## Fibers

```php
<?php

declare(strict_types=1);

$fiber = new Fiber(function (): string {
    Fiber::suspend('waiting');
    return 'done';
});

$fiber->start();
$result = $fiber->resume();
```

## Amphp Shape

Use Amphp when you want a higher-level async framework built around fibers and
structured concurrency instead of hand-managed event-loop primitives.

## Notes

- fibers are the language primitive, not the whole runtime story
- introduce them when the surrounding framework already supports them cleanly
- keep async boundaries explicit and testable
