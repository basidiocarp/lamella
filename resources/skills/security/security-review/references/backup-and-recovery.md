# Backup and Recovery

## Backup Checklist

- automated backups enabled
- retention matches business and compliance needs
- point-in-time recovery enabled where supported
- deletion protection on critical stores

```terraform
resource "aws_db_instance" "main" {
  engine                  = "postgres"
  backup_retention_period = 7
  deletion_protection     = true
  storage_encrypted       = true
}
```

## Recovery Checklist

- RPO and RTO are documented
- restore tests run on a schedule
- disaster recovery steps are written down
- team knows which credentials and systems are needed to restore service

The most common failure is not missing backups. It is discovering during an incident that nobody has tested a restore path.
