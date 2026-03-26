# Atlassian Access Governance

Use this baseline when the request involves Atlassian security, compliance, or organization-wide administration.

## Core controls

- Enforce SSO for managed accounts
- Require MFA for admins and other sensitive roles
- Use groups instead of direct user grants
- Minimize org-admin and product-admin membership
- Review API token usage and rotate service credentials on schedule
- Export and review audit logs for sensitive changes

## Admin guardrails

- Keep emergency admin access documented and limited
- Use sandbox environments for major permission or app changes
- Announce large access-model changes before rollout
- Maintain rollback notes for authentication, group, and permission changes

## Quarterly review prompts

- Do active accounts still match current employees and contractors?
- Are admin groups still minimal and justified?
- Are temporary grants still needed?
- Are marketplace apps still approved and actively used?
- Are audit-log exports and evidence retention still working?

## High-risk patterns

- direct user permissions instead of groups
- broad delete permissions for general users
- unmanaged API tokens
- undocumented app installs
- inactive contractors with lingering access
