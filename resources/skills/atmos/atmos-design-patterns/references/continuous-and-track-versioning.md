# Continuous and Track Versioning

## Continuous Version Deployment

This is the trunk-based default:

- all environments point at the same component path
- changes merge to main
- rollout progresses through environments over time

This creates temporary operational divergence that converges automatically as promotion completes.

## Release Tracks

Named channels such as `alpha`, `beta`, and `prod` work well when teams want explicit promotion points.

Two shapes are common:

- component-centric tracks
- track-centric layouts

Use tracks when promotion flow matters more than exact immutable version numbers.
