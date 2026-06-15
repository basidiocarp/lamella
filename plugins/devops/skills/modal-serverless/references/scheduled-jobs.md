# Scheduled Jobs and Cron

Use Modal schedules for recurring functions that should run without an external
cron service.

## Schedule Types

### Period

Use `modal.Period(...)` for interval-driven jobs such as:
- every few minutes
- every hour
- every day from deployment time

Remember that redeploying resets the period clock.

### Cron

Use `modal.Cron(...)` when the job must run at a specific wall-clock time.

Good fits:
- daily reports
- weekly model retraining
- timezone-aware business-hour tasks

## Deployment Rule

Schedules only become active after deployment. Treat schedule changes as deploy
changes, not local code changes.

## Good Uses

- ETL and data cleanup
- recurring report generation
- model refresh or retraining
- periodic sync jobs

## Operational Rules

- set timeouts for long jobs
- use secrets and volumes the same way you would for ordinary Modal functions
- log enough to diagnose missed or failed runs
- treat redeploys as schedule changes for period-based jobs

## Management

To change a schedule:
- update the schedule definition
- redeploy

To stop a schedule:
- remove or disable the scheduled function and redeploy

Scheduled jobs are easiest to operate when the job is idempotent and safe to
retry.
