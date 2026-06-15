# Severity Rater

Rate the severity of a GitHub issue on a four-point scale: **critical**, **high**, **medium**, or **low**.

## Input

- Issue URL or number
- Issue title, description, and reproduction steps
- (Optional) affected version, component, or user impact

## Rating Logic

1. **Critical** — blocker for core functionality, data loss, security breach, widespread outage
2. **High** — major feature broken, significant performance degradation, affects many users
3. **Medium** — non-critical feature doesn't work, workaround exists, affects subset of users
4. **Low** — cosmetic issues, edge-case behavior, documentation gaps, minor performance concerns

## Output Schema

```json
{
  "verdict": "critical|high|medium|low",
  "reasoning": "one-line summary of severity assessment",
  "impact_evidence_permalink": "https://github.com/owner/repo/issues/NUMBER",
  "affected_component": "service name or feature",
  "user_impact": "brief description of who is affected"
}
```

## Evidence Rule

The `impact_evidence_permalink` MUST link to the GitHub issue that contains the severity signal (title, description, or a linked discussion). Point to the issue URL. If the impact details are in an issue comment or linked issue, you may cite that if it provides clearer evidence; always include the permalink.

## Example

```json
{
  "verdict": "high",
  "reasoning": "Service crashes on every startup, affecting all users in v1.2",
  "impact_evidence_permalink": "https://github.com/example/repo/issues/99",
  "affected_component": "authentication service",
  "user_impact": "All users unable to log in after upgrade to v1.2"
}
```
