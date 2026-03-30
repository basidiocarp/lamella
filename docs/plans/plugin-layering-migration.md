# Plugin Layering Migration Plan

## Goal

Reduce oversized Lamella plugin bundles without breaking the current install
story.

The migration should:

- keep current broad plugins installable
- introduce narrower capability-focused plugins
- use manifest dependencies instead of forced renames
- avoid blanket `*-base` and `*-extras` naming when capability names are clearer

## Naming Rule

Prefer capability names over generic suffixes.

- Good: `security-fuzzing`
- Good: `tools-documents`
- Good: `devops-observability`
- Use `*-base` only when it is the default starter pack for a domain
- Avoid `*-extras` unless the split is truly "optional add-ons"

## Migration Strategy

### Phase 1: Add narrow manifests

Create new manifests for the overloaded domains first. Do not remove or rename
the current broad manifests in this phase.

### Phase 2: Convert broad manifests into umbrella bundles

Update the current broad manifests so they depend on the new narrow manifests.
Keep any shared workflows or templates only where they have a clear home.

### Phase 3: Validate install and build parity

After each batch:

1. run `make validate`
2. run `./lamella build-marketplace`
3. run `./lamella build-codex`
4. verify Claude install resolution for umbrella and narrow manifests
5. verify Codex export parity

### Phase 4: Optional deprecation

Only after a stable transition period should Lamella consider deprecating any
umbrella plugin names. This is optional. The safer default is to keep the
umbrella manifests as compatibility bundles.

## First Wave Targets

Start with the domains that are both large and internally separable:

1. `security`
2. `devops`
3. `tools`
4. `core`
5. `meta`
6. `frontend`
7. `workflow`

Do not split these yet:

- `python`
- `typescript`
- `rust`
- `database`
- `go`
- `cpp`
- `microservices`
- `rag`
- `agile-pm`
- `customer-insights`
- `collaboration`
- `enterprise-it`
- `executive`
- `go-to-market`

## Target Plugin Map

### `security`

Keep:

- `security` as umbrella bundle

Add:

- `security-base`
- `security-scanning`
- `security-fuzzing`
- `security-crypto`
- `security-compliance`

Suggested membership:

| Manifest | Skills |
|---|---|
| `security-base` | `auth-implementation-patterns`, `secrets-management`, `insecure-defaults`, `security-review`, `dependency-auditor`, `memory-safety-patterns`, `api-footgun-detector` |
| `security-scanning` | `semgrep`, `codeql`, `sast-configuration`, `agentic-actions-auditor`, `pii-redactor`, `supply-chain-risk-auditor` |
| `security-fuzzing` | `cargo-fuzz`, `ossfuzz`, `fuzz-harness-writing`, `address-sanitizer` |
| `security-crypto` | `constant-time-crypto`, `wycheproof`, `yara-rule-authoring` |
| `security-compliance` | `pci-compliance`, `soc2-compliance`, `stride-analysis-patterns`, `threat-mitigation-mapping`, `seatbelt-sandboxer` |

Notes:

- `security-base` is a legitimate `*-base` case because it is the likely
  default security install.

### `devops`

Keep:

- `devops` as umbrella bundle

Add:

- `devops-cloud`
- `devops-platform`
- `devops-kubernetes`
- `devops-observability`

Suggested membership:

| Manifest | Skills |
|---|---|
| `devops-cloud` | `aws-agentic-ai`, `aws-cdk-development`, `aws-cost-operations`, `aws-serverless-eda`, `modal-serverless` |
| `devops-platform` | `ansible`, `deployment`, `docker-patterns`, `docker-troubleshoot`, `github-actions-validator`, `makefile`, `terraform-patterns`, `turborepo-caching` |
| `devops-kubernetes` | `helm-charts`, `kubernetes-manifest-generator`, `kubernetes-security-policies`, `gitops-workflow` |
| `devops-observability` | `chaos-engineering`, `distributed-tracing`, `grafana-dashboards`, `postmortem-writing`, `prometheus-configuration`, `promql`, `slo-implementation` |

Notes:

- Leave `developer-ops` alone. It is already a narrower operational bundle.

### `tools`

Keep:

- `tools` as umbrella bundle

Add:

- `tools-cli`
- `tools-browser`
- `tools-documents`
- `tools-diagrams`
- `tools-integration`

Suggested membership:

| Manifest | Skills |
|---|---|
| `tools-cli` | `bash-script-generator`, `bash-script-validator`, `cli-developer`, `gh-cli-patterns`, `regex-debugger`, `tmux-interactive-runner`, `token-reduction-optimizer`, `php-pro` |
| `tools-browser` | `agent-browser`, `playwright`, `websocket-patterns` |
| `tools-documents` | `docx-word-documents`, `markitdown-converter`, `pdf-manipulation`, `pptx-presentations`, `xlsx-spreadsheets` |
| `tools-diagrams` | `excalidraw-diagram-generator`, `mermaid-diagrams` |
| `tools-integration` | `analytics-tracking`, `api-design-principles`, `aws-mcp-setup`, `devcontainer-setup`, `graphql-patterns`, `mcp-integration`, `mcp-server-builder`, `obsidian`, `openapi-spec-generation`, `rclone` |

Notes:

- `tools` is too broad for `*-base`; capability slices are clearer here.

### `core`

Keep:

- `core` as umbrella bundle

Add:

- `core-base`
- `core-quality`
- `core-architecture`
- `core-operations`

Suggested membership:

| Manifest | Skills |
|---|---|
| `core-base` | `brainstorming`, `clarify-requirements`, `systematic-debugging`, `test-debugging`, `test-driven-development`, `test-writing` |
| `core-quality` | `api-test-suite-builder`, `code-maturity-assessor`, `code-review-pro`, `code-review-process`, `e2e-testing`, `fidelity-review`, `property-based-testing`, `structured-review`, `verified-implementer` |
| `core-architecture` | `architecture-decision-records`, `context-engineering`, `deep-module-review`, `dependency-upgrade`, `design-patterns`, `duplicate-detection`, `interface-design-variants`, `legacy-modernizer`, `monorepo-management`, `type-driven-design` |
| `core-operations` | `codebase-onboarding`, `continuous-learning`, `error-memory`, `git-cleanup`, `parallel-debugging`, `plan-fleet`, `strategic-compact` |

Shared support content:

- keep `development/*.md` and `quality/*.md` workflows in `core-base`
- keep templates in `core-base`

### `meta`

Keep:

- `meta` as umbrella bundle

Add:

- `meta-authoring`
- `meta-governance`
- `meta-routing`

Suggested membership:

| Manifest | Skills |
|---|---|
| `meta-authoring` | `agent-development`, `command-development`, `create-hook`, `create-skill`, `create-workflow-command`, `designing-workflow-skills`, `plugin-settings`, `plugin-structure` |
| `meta-governance` | `config-curator`, `file-todos`, `skill-best-practices`, `skill-stocktake`, `task-observer` |
| `meta-routing` | `rust-crate-skill-generator`, `skill-composer-studio`, `skill-router`, `team-communication-protocols` |

### `frontend`

Keep:

- `frontend` as umbrella bundle

Add:

- `frontend-base`
- `frontend-visual`
- `frontend-3d`

Suggested membership:

| Manifest | Skills |
|---|---|
| `frontend-base` | `accessibility`, `component-architecture`, `frontend-patterns`, `frontend-performance`, `responsive-design` |
| `frontend-visual` | `css-animation-creator`, `design-systems`, `frontend-slides`, `screenshot-to-code` |
| `frontend-3d` | `spline-3d-integration`, `threejs-advanced` |

### `workflow`

Keep:

- `workflow` as umbrella bundle

Add:

- `workflow-planning`
- `workflow-git`
- `workflow-execution`

Suggested membership:

| Manifest | Skills |
|---|---|
| `workflow-planning` | `create-plans`, `deliver-edge-cases`, `develop-adr`, `develop-spike-summary`, `kaizen`, `mental-models` |
| `workflow-git` | `git-analyze-issue`, `git-create-pr`, `git-worktrees`, `resolve-pr-parallel` |
| `workflow-execution` | `conductor`, `context-handoff`, `executing-plans`, `finishing-a-development-branch` |

## Implementation Order

### Batch 1

- add `security-*`
- add `devops-*`
- keep `security` and `devops` untouched until new manifests validate cleanly

### Batch 2

- add `tools-*`
- add `frontend-*`

### Batch 3

- add `core-*`
- move workflows and templates into `core-base`

### Batch 4

- add `meta-*`
- add `workflow-*`

### Batch 5

- convert umbrella manifests to dependency-led bundles
- update marketplace descriptions and tags
- document install recommendations

## Dependency Shape

Use umbrella manifests for compatibility and smaller manifests for selective
installs.

Example:

- `security` depends on `security-base`, `security-scanning`,
  `security-fuzzing`, `security-crypto`, and `security-compliance`
- `devops` depends on `devops-cloud`, `devops-platform`,
  `devops-kubernetes`, and `devops-observability`
- `core` depends on `core-base`, `core-quality`, `core-architecture`, and
  `core-operations`

Do not make narrow manifests depend on their umbrella manifest.

## Validation Checklist

For each batch:

- add the new Claude manifests
- sync Codex manifests
- validate source manifests
- build Claude marketplace output
- build Codex exports
- spot-check install behavior for umbrella and narrow manifests
- check marketplace descriptions and tags for search quality

## Success Criteria

- narrow manifests are installable on their own
- current broad plugin names still work
- no resource duplication drift appears between Claude and Codex outputs
- install behavior remains dependency-aware
- plugin catalog becomes easier to browse by task instead of domain overload

## Follow-Up Work

Once the first wave settles, reassess whether `agile-pm` and
`customer-insights` should stay separate or be grouped under a higher-order
planning and research story. That should be a later packaging decision, not a
first-wave migration.
