# Symfony Patterns

Use this file as the routing page for Symfony-specific patterns.

## Open These References By Task

1. [services-and-di.md](./services-and-di.md)
   Use for service wiring and container configuration.
2. [http-and-validation.md](./http-and-validation.md)
   Use for controllers, DTOs, and request validation.
3. [events-and-messenger.md](./events-and-messenger.md)
   Use for event subscribers, custom events, and Messenger handlers.
4. [console-and-authorization.md](./console-and-authorization.md)
   Use for console commands and voter-based authorization.

## Practical Rule

Keep framework glue thin. Put business logic in services or domain classes, not
inside controllers, subscribers, or commands.
