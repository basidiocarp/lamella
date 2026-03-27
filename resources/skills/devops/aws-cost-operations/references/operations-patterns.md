# AWS Cost & Operations Patterns

Use this file as the entry point for AWS cost, monitoring, audit, and troubleshooting workflows. The detailed pattern catalogs now live in focused references so each operational domain stays concise and reusable.

## Routing

### Cost optimization

- `references/cost-optimization-patterns.md`
  - pre-deployment estimation
  - monthly cost review
  - right-sizing
  - unused resource cleanup

### Monitoring and observability

- `references/monitoring-and-observability-patterns.md`
  - service alarms
  - Lambda, API Gateway, and database monitoring
  - tracing and logs
  - custom metrics

### Security and troubleshooting

- `references/security-and-troubleshooting-patterns.md`
  - CloudTrail audit queries
  - posture and compliance checks
  - incident and performance triage workflows

## How to use this set

1. Start in the domain that matches the immediate question: cost, monitoring, or audit/incident response.
2. Pull the relevant MCP server into the workflow before giving recommendations.
3. Keep outputs operational:
   - the metric or signal reviewed
   - the threshold or anomaly found
   - the suspected cause
   - the next AWS action to take

## Minimal review loop

- Cost question: estimate, compare, tag, then recommend a concrete savings change.
- Monitoring question: identify the metric, confirm the alarm condition, then check logs or traces.
- Security question: confirm the CloudTrail or guardrail evidence first, then scope impact and remediation.
