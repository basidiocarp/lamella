# Dates, Booleans, and Strings Across Dialects

Use this reference for the day-to-day type and expression differences that tend to break portability.

## Strings

- PostgreSQL and Oracle commonly use `||`
- MySQL prefers `CONCAT`
- SQL Server commonly uses `+` for string concatenation

## Dates

- Date formatting and arithmetic differ by vendor-specific functions
- Avoid assuming `NOW()`, `DATEADD`, and Oracle formatting functions are interchangeable

## Booleans

- PostgreSQL has native `BOOLEAN`
- MySQL often stores boolean-like values as `TINYINT(1)`
- Oracle and some legacy schemas commonly emulate booleans with numeric columns
