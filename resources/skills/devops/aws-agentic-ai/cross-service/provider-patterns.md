# Provider Patterns

## Shared Provider

Use one provider across multiple targets when the same upstream API and rotation policy apply everywhere.

## Isolated Provider

Use a provider per environment or per gateway when blast radius and separation matter more than operational simplicity.

## Tiered Provider

Use shared providers in non-prod and isolated providers in prod when you need a practical compromise.
