# Security and Troubleshooting Patterns

Use these patterns when the question is about audit evidence, AWS security posture, or operational incident triage.

## Pattern 1: API activity auditing

**MCP server**: CloudTrail MCP

**Regular audit queries**:
```text
# IAM changes in the last 24 hours
eventName: CreateUser, DeleteUser, AttachUserPolicy, PutRolePolicy

# Security group modifications
eventName: AuthorizeSecurityGroupIngress, RevokeSecurityGroupIngress, CreateSecurityGroup

# Root or privileged activity
userIdentity.arn: *admin* OR *root*
```

**Recommended cadence**:
- daily: privileged actions
- weekly: IAM and security group changes
- monthly: broader security review

## Pattern 2: Security posture review

**MCP server**: Well-Architected Security Assessment MCP

**Check these domains**:
1. IAM and least privilege
2. detective controls such as GuardDuty, Config, and Security Hub
3. infrastructure protection including VPC and ingress rules
4. data protection and key management
5. incident response readiness

## Pattern 3: Compliance monitoring

Use CloudTrail and CloudWatch data to confirm:
- data stays in approved regions
- access is logged and retained
- encryption is enabled where required
- change management is visible in audit logs

**Useful dashboard cuts**:
- encryption coverage
- CloudTrail logging status
- failed login attempts
- privileged access usage
- non-compliant resources

## Pattern 4: Incident and performance triage

### High Lambda error rate
1. Pull Lambda error metrics.
2. Read the failing log groups.
3. Classify timeout, memory, permission, or dependency errors.
4. Check recent deploys and downstream health.
5. fix, redeploy, and monitor.

### Increased latency
1. Confirm the latency spike in CloudWatch.
2. Inspect traces or service map edges.
3. Check database performance and integration latency.
4. Look for cold starts or saturation.
5. Remove the bottleneck and re-measure.

### Cost spike investigation
1. Identify the service behind the cost jump.
2. Correlate with usage metrics.
3. Review resource creation or mutation in CloudTrail.
4. Decide whether the cause is scale, waste, or abuse.
5. Apply controls such as budgets, limits, or cleanup.

### Security incident response
1. Confirm the event source.
2. Scope the affected resources.
3. Revoke or rotate compromised credentials.
4. Isolate impacted systems if needed.
5. Remediate and record follow-up controls.
