# Claude Skill Migration Queue

This queue records the next planned batches so the Lamella migration can continue without re-routing every turn.

## Active Batch Order

No active migration batch is in progress. The remaining backlog is now an explicit deferred queue.

### Deferred Backlog

This is a prioritized backlog, not an exhaustive copy of every deferred item. The full deferred list lives in `CLAUDE-SKILL-MIGRATION-LOG.md`.

1. `go-to-market-and-ops-tail`
   - `acquisition-channel-advisor`
   - `business-health-diagnostic`
   - `finance-based-pricing-advisor`
   - `competitive-intel`
   - `revenue-operations`
   - `financial-analyst`
   - `saas-metrics-coach`
   - `brand-guidelines`
   - `campaign-analytics`
   - `copy-editing`
   - `copywriting`
   - `customer-success-manager`
   - `eol-message`
   - `marketing-strategy-pmm`
   - `social-content`
   - `social-media-manager`

2. `creative-and-workshops-tail`
   - `algorithmic-art`
   - `slack-gif-creator`
   - `screenshots`
   - `design-md`
   - `design-orchestration`
   - `customer-journey-mapping-workshop`
   - `positioning-workshop`
   - `lean-ux-canvas`
   - `workshop-facilitation`
   - `discovery-process`
   - `scrum-master`
   - `ad-creative`
   - `data-storytelling`

3. `platform-and-compliance-tail`
   - `algolia-search`
   - `airflow-dag-patterns`
   - `apify-actor-development`
   - `astro`
   - `android-jetpack-compose-expert`
   - `stripe-integration-expert`

4. `image-and-motion-tail`
   - `ai-studio-image`
   - `animejs-animation`

## Completed Recently

- `frontend-3d-and-compliance`
  - `spline-3d-integration`
  - `threejs-animation`, `threejs-postprocessing`, and `threejs-shaders` merged into `frontend/threejs-advanced`
  - `3d-web-experience` merged into the frontend 3D surfaces
  - `scroll-experience` merged into `css-animation-creator`
  - `ui-visual-validator` merged into `frontend-patterns`
  - `async-python-patterns` merged into `python-patterns`
  - `soc2-compliance`

- `enterprise-and-analytics-tail`
  - `ms365-tenant-manager`
  - `office-productivity`
  - `analytics-tracking`

- `creative-and-fun`
  - `storyboard`
  - `design-spells`
  - `theme-factory`

- `executive-and-ops-tail`
  - `director-readiness-advisor` category-fit review
  - `vp-cpo-readiness-advisor` category-fit review
  - `executive-onboarding-playbook` category-fit review

- `go-to-market-extended`
  - `pricing-strategy`
  - `content-strategy`
  - `email-sequence`

- `go-to-market-core`
  - `positioning-statement`
  - `press-release`
  - `launch-strategy`

- `product-strategy`
  - `product-strategy-session`
  - `roadmap-planning`
  - `feature-investment-advisor`

- `customer-insights-next`
  - `discovery-interview-prep`
  - `pestel-analysis`
  - `tam-sam-som-calculator`

## Notes

- Keep using file-scoped review agents before each batch.
- Prefer concise standalone imports only when the trigger surface is clearly different from Lamella’s existing skills.
- All candidates surfaced in the current import docs are now accounted for in the migration log as `imported`, `merged`, `deferred`, or `rejected`.
- The next major step is still the category reshaping pass, but the deferred backlog above is available if imports resume later.
