# Security Baseline

Use this baseline for tenant reviews and phased hardening.

## Minimum Control Set

- require MFA for administrators first
- keep break-glass accounts excluded and monitored
- block legacy authentication
- review guest-user access and invite policy
- minimize standing admin-role assignments
- review license and feature dependencies before enabling controls

## Rollout Order

1. report-only Conditional Access
2. pilot group rollout
3. broad enforcement
4. quarterly review of exceptions and admin exposure

## Named Risks To Check

- emergency accounts missing documentation
- privileged roles assigned permanently instead of activated when needed
- guest access allowed too broadly
- policies enforced without validation windows
- service or legacy clients broken by auth changes
