# Database Adapters

Use this reference for Payload database adapter choices and transaction behavior.

- MongoDB for document-oriented deployments
- Postgres for relational and migration-heavy deployments
- SQLite for lightweight local or embedded setups

## Rule

Thread `req` through nested operations when transaction scope matters.
