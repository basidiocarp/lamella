# Mocks and Coverage

Use this reference for interaction testing and coverage configuration.

## Mockery Shape

```php
$repo = Mockery::mock(UserRepository::class);
$repo->shouldReceive('findByEmail')->once()->andReturn($user);
```

## Coverage

```xml
<coverage>
  <include>
    <directory>src</directory>
  </include>
</coverage>
```

## Rules

- mock at process boundaries, not everywhere
- prefer real value objects and simple collaborators over excessive doubles
- treat coverage as a lagging indicator, not proof of quality
