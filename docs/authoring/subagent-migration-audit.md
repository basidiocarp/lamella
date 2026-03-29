# Subagent Migration Audit

Tracks which legacy Claude-era agents have been migrated into the shared
`resources/subagents/` model, where they now build, and which names were
consolidated during migration.

Related:

- `docs/authoring/shared-subagent-model.md`
- `resources/subagents/`

## Current Status

- Shared subagents validated: `128`
- Claude artifacts emitted: `132`
- Codex artifacts emitted: `129`
- Legacy `resources/agents/` sources removed from the repo
- Removed legacy duplicates: `128`

## Deprecation Stages

Use these states for the historical migration record:

| Stage | Meaning |
|-------|---------|
| `Legacy active` | No shared replacement yet, or replacement is not ready |
| `Migrated` | Shared replacement exists and builds, but legacy file is still the practical source for some users or workflows |
| `Ready to deprecate` | Shared replacement is validated and should become the documented source of truth; legacy file should gain a deprecation note |
| `Ready to remove` | Legacy file is deprecated, no longer needed for coverage, and can be deleted in a cleanup pass |
| `Removed` | Legacy file has been deleted; shared subagent is the only source of truth |

Current default:

- Shared replacement exists + validated build coverage = `Ready to deprecate`
- Shared replacement exists but overlap or consolidation is unresolved = `Migrated`
- Legacy file deleted = `Removed`
- Legacy file absent from this audit = `Legacy active`

## Migration Inventory

| Shared Name | Legacy Source | Shared Source | Claude Plugin | Codex Profile | Status | Notes |
|-------------|---------------|---------------|---------------|---------------|--------|-------|
| `code-reviewer` | `resources/agents/code-quality/code-reviewer.md` | `resources/subagents/code-quality/code-reviewer/SUBAGENT.md` | `core` | `core` | Migrated | Canonical shared reviewer |
| `code-explorer` | `resources/agents/code-quality/code-explorer.md` | `resources/subagents/code-quality/code-explorer/SUBAGENT.md` | `core` | `core` | Migrated | Canonical shared explorer |
| `planner` | `resources/agents/planning/planner.md` | `resources/subagents/planning/planner/SUBAGENT.md` | `core` | `core` | Migrated | Canonical shared planner |
| `build-error-resolver` | `resources/agents/debugging/build-error-resolver.md` | `resources/subagents/debugging/build-error-resolver/SUBAGENT.md` | `core` | `core` | Migrated | Canonical shared fix worker |
| `docs-writer` | `resources/agents/documentation/docs-writer.md` | `resources/subagents/documentation/docs-writer/SUBAGENT.md` | `writing` | `writing` | Migrated | Code-aligned documentation writer |
| `refactorer` | `resources/agents/code-quality/refactorer.md` | `resources/subagents/code-quality/refactorer/SUBAGENT.md` | `core` | `core` | Migrated | Shared behavior-preserving refactor worker |
| `test-runner` | `resources/agents/testing/test-runner.md` | `resources/subagents/testing/test-runner/SUBAGENT.md` | `core` | `core` | Migrated | Shared verification runner |
| `git-history-analyzer` | `resources/agents/analysis/git-history-analyzer.md` | `resources/subagents/analysis/git-history-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared history/evidence analyzer |
| `doc-auditor` | `resources/agents/documentation/doc-auditor.md` | `resources/subagents/documentation/doc-auditor/SUBAGENT.md` | `writing`, `security` | `writing` | Migrated | Shared documentation audit worker |
| `framework-researcher` | `resources/agents/research/framework-researcher.md` | `resources/subagents/research/framework-researcher/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared authoritative framework research worker |
| `database-architect` | `resources/agents/data/database-architect.md` | `resources/subagents/data/database-architect/SUBAGENT.md` | `database`, `security` | `database` | Migrated | Shared schema/query/migration review worker |
| `dependency-auditor` | `resources/agents/code-quality/dep-auditor.md` | `resources/subagents/security/dependency-auditor/SUBAGENT.md` | `security` | `security` | Migrated with rename | Canonical name expanded from `dep-auditor` |
| `security-reviewer` | `resources/agents/security/security-reviewer.md` | `resources/subagents/security/security-reviewer/SUBAGENT.md` | `security` | `security` | Migrated | Shared security review worker |
| `fact-checker` | `resources/agents/research/fact-checker.md` | `resources/subagents/research/fact-checker/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared factual verification worker |
| `infra-auditor` | `resources/agents/devops/infra-auditor.md` | `resources/subagents/devops/infra-auditor/SUBAGENT.md` | `security`, `devops` | `security` | Migrated | Shared deployment configuration audit worker |
| `code-auditor` | `resources/agents/code-quality/code-auditor.md` | `resources/subagents/code-quality/code-auditor/SUBAGENT.md` | `security` | `security` | Migrated | Shared structural quality audit worker |
| `api-documenter` | `resources/agents/documentation/api-documenter.md` | `resources/subagents/documentation/api-documenter/SUBAGENT.md` | `writing`, `tools` | `writing`, `tools` | Migrated | Shared API documentation worker with multi-target distribution |
| `tech-writer` | `resources/agents/documentation/tech-writer.md` | `resources/subagents/documentation/tech-writer/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared audience-oriented technical writing worker |
| `researcher` | `resources/agents/research/researcher.md` | `resources/subagents/research/researcher/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared multi-source technology research worker |
| `source-researcher` | `resources/agents/research/source-researcher.md` | `resources/subagents/research/source-researcher/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared editorial research worker |
| `threat-modeler` | `resources/agents/security/threat-modeler.md` | `resources/subagents/security/threat-modeler/SUBAGENT.md` | `security` | `security` | Migrated | Shared threat-modeling worker |
| `ui-auditor` | `resources/agents/frontend/ui-auditor.md` | `resources/subagents/frontend/ui-auditor/SUBAGENT.md` | `security` | `security` | Migrated | Shared UI audit worker |
| `content-writer` | `resources/agents/content/content-writer.md` | `resources/subagents/content/content-writer/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared marketing and editorial content worker |
| `accessibility-reviewer` | `resources/agents/frontend/accessibility-reviewer.md` | `resources/subagents/frontend/accessibility-reviewer/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared accessibility audit and remediation worker |
| `reverse-engineer` | `resources/agents/security/reverse-engineer.md` | `resources/subagents/security/reverse-engineer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared authorized reverse-engineering worker |
| `incident-responder` | `resources/agents/security/incident-responder.md` | `resources/subagents/security/incident-responder/SUBAGENT.md` | `security` | `security` | Migrated | Shared incident coordination worker |
| `contracts-reviewer` | `resources/agents/security/contracts-reviewer.md` | `resources/subagents/security/contracts-reviewer/SUBAGENT.md` | `security` | `security` | Migrated | Shared contract and schema review worker |
| `bug-auditor` | `resources/agents/debugging/bug-auditor.md` | `resources/subagents/debugging/bug-auditor/SUBAGENT.md` | `security` | `security` | Migrated | Shared runtime defect audit worker |
| `malware-analyst` | `resources/agents/security/malware-analyst.md` | `resources/subagents/security/malware-analyst/SUBAGENT.md` | `security` | `security` | Migrated | Shared defensive malware triage worker |
| `exploitability-verifier` | `resources/agents/security/exploitability-verifier.md` | `resources/subagents/security/exploitability-verifier/SUBAGENT.md` | `security` | `security` | Migrated | Shared read-only exploitability verification worker |
| `deploy-checker` | `resources/agents/devops/deploy-checker.md` | `resources/subagents/devops/deploy-checker/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared release readiness checker |
| `tutorial-engineer` | `resources/agents/documentation/tutorial-engineer.md` | `resources/subagents/documentation/tutorial-engineer/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared tutorial and onboarding content worker |
| `bug-hunter` | `resources/agents/debugging/bug-hunter.md` | `resources/subagents/debugging/bug-hunter/SUBAGENT.md` | `core` | `core` | Migrated | Shared proactive diff-oriented bug finder |
| `bug-reproduction-validator` | `resources/agents/debugging/bug-reproduction-validator.md` | `resources/subagents/debugging/bug-reproduction-validator/SUBAGENT.md` | `core` | `core` | Migrated | Shared bug report verification worker |
| `semgrep-scanner` | `resources/agents/security/semgrep-scanner.md` | `resources/subagents/security/semgrep-scanner/SUBAGENT.md` | `security` | `security` | Migrated | Shared Semgrep scan worker |
| `deployment-engineer` | `resources/agents/devops/deployment-engineer.md` | `resources/subagents/devops/deployment-engineer/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared CI/CD and GitOps implementation worker |
| `qa-engineer` | `resources/agents/testing/qa-engineer.md` | `resources/subagents/testing/qa-engineer/SUBAGENT.md` | `core` | `core` | Migrated | Shared verification-definition authoring worker |
| `perf-auditor` | `resources/agents/code-quality/perf-auditor.md` | `resources/subagents/code-quality/perf-auditor/SUBAGENT.md` | `security` | `security` | Migrated | Shared performance audit worker |
| `debugger` | `resources/agents/debugging/debugger.md` | `resources/subagents/debugging/debugger/SUBAGENT.md` | `core` | `core` | Migrated | Shared reactive debugging worker |
| `browser-tester` | `resources/agents/testing/browser-tester.md` | `resources/subagents/testing/browser-tester/SUBAGENT.md` | `core` | `core` | Migrated | Shared live-browser verification worker |
| `e2e-runner` | `resources/agents/testing/e2e-runner.md` | `resources/subagents/testing/e2e-runner/SUBAGENT.md` | `core` | `core` | Migrated | Shared end-to-end test authoring and execution worker |
| `fullstack-qa-orchestrator` | `resources/agents/testing/fullstack-qa-orchestrator.md` | `resources/subagents/testing/fullstack-qa-orchestrator/SUBAGENT.md` | `core` | `core` | Migrated | Shared find-fix-verify QA coordinator |
| `socratic-mentor` | `resources/agents/teams/socratic-mentor.md` | `resources/subagents/collaboration/socratic-mentor/SUBAGENT.md` | `collaboration` | `collaboration` | Migrated | Shared discovery-learning mentor |
| `team-debugger` | `resources/agents/teams/team-debugger.md` | `resources/subagents/collaboration/team-debugger/SUBAGENT.md` | `collaboration` | `collaboration` | Migrated | Shared parallel debugging hypothesis worker |
| `team-implementer` | `resources/agents/teams/team-implementer.md` | `resources/subagents/collaboration/team-implementer/SUBAGENT.md` | `collaboration` | `collaboration` | Migrated | Shared bounded parallel implementation worker |
| `team-lead` | `resources/agents/teams/team-lead.md` | `resources/subagents/collaboration/team-lead/SUBAGENT.md` | `collaboration` | `collaboration` | Migrated | Shared multi-worker orchestration lead |
| `team-reviewer` | `resources/agents/teams/team-reviewer.md` | `resources/subagents/collaboration/team-reviewer/SUBAGENT.md` | `collaboration` | `collaboration` | Migrated | Shared lane-specific parallel review worker |
| `implementer` | `resources/agents/teams/implementer.md` | `resources/subagents/core/implementer/SUBAGENT.md` | `core` | `core` | Migrated | Shared bounded mechanical execution worker |
| `api-tester` | `resources/agents/testing/api-tester.md` | `resources/subagents/testing/api-tester/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared API route validation worker |
| `tdd-guide` | `resources/agents/testing/tdd-guide.md` | `resources/subagents/testing/tdd-guide/SUBAGENT.md` | `core` | `core` | Migrated | Shared RED-GREEN-IMPROVE implementation worker |
| `test-coverage-reviewer` | `resources/agents/testing/test-coverage-reviewer.md` | `resources/subagents/testing/test-coverage-reviewer/SUBAGENT.md` | `core` | `core` | Migrated | Shared behavioral coverage review worker |
| `code-fixer` | `resources/agents/code-quality/code-fixer.md` | `resources/subagents/code-quality/code-fixer/SUBAGENT.md` | `core` | `core` | Migrated | Shared fix-list implementation worker |
| `refactor-cleaner` | `resources/agents/code-quality/refactor-cleaner.md` | `resources/subagents/code-quality/refactor-cleaner/SUBAGENT.md` | `core` | `core` | Migrated | Shared cleanup-focused refactor worker |
| `self-review` | `resources/agents/code-quality/self-review.md` | `resources/subagents/code-quality/self-review/SUBAGENT.md` | `core` | `core` | Migrated | Shared post-implementation readiness reviewer |
| `content-architect` | `resources/agents/content/content-architect.md` | `resources/subagents/content/content-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared content structure and hook planner |
| `architecture-reviewer` | `resources/agents/architecture/architecture-reviewer.md` | `resources/subagents/architecture/architecture-reviewer/SUBAGENT.md` | `core` | `core` | Migrated | Shared read-only structural review worker |
| `comment-analyzer` | `resources/agents/analysis/comment-analyzer.md` | `resources/subagents/analysis/comment-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared code-comment quality reviewer |
| `repo-analyzer` | `resources/agents/analysis/repo-analyzer.md` | `resources/subagents/analysis/repo-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared repository onboarding and convention analyzer |
| `performance-analyzer` | `resources/agents/analysis/performance-analyzer.md` | `resources/subagents/analysis/performance-analyzer/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared static performance and scalability reviewer |
| `architect` | `resources/agents/architecture/architect.md` | `resources/subagents/architecture/architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared general-purpose architecture planner |
| `backend-architect` | `resources/agents/architecture/backend-architect.md` | `resources/subagents/architecture/backend-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared backend service and API architect |
| `function-analyzer` | `resources/agents/analysis/function-analyzer.md` | `resources/subagents/analysis/function-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared deep per-function structural analyzer |
| `pattern-analyzer` | `resources/agents/analysis/pattern-analyzer.md` | `resources/subagents/analysis/pattern-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared design-pattern and anti-pattern reviewer |
| `conversation-analyzer` | `resources/agents/analysis/conversation-analyzer.md` | `resources/subagents/analysis/conversation-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared transcript-to-hook pattern analyzer |
| `c4-architect` | `resources/agents/architecture/c4-architect.md` | `resources/subagents/architecture/c4-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared C4 model documentation worker |
| `cloud-architect` | `resources/agents/architecture/cloud-architect.md` | `resources/subagents/architecture/cloud-architect/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared cloud platform architecture worker |
| `frontend-architect` | `resources/agents/architecture/frontend-architect.md` | `resources/subagents/architecture/frontend-architect/SUBAGENT.md` | `typescript` | `typescript` | Migrated | Shared frontend structure and design-system planner |
| `graphql-architect` | `resources/agents/architecture/graphql-architect.md` | `resources/subagents/architecture/graphql-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared GraphQL architecture worker |
| `vector-db-architect` | `resources/agents/data/vector-db-architect.md` | `resources/subagents/data/vector-db-architect/SUBAGENT.md` | `database` | `database` | Migrated | Shared vector retrieval architecture worker |
| `service-mesh-architect` | `resources/agents/devops/service-mesh-architect.md` | `resources/subagents/devops/service-mesh-architect/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared service mesh design worker |
| `event-sourcing-architect` | `resources/agents/architecture/event-sourcing-architect.md` | `resources/subagents/architecture/event-sourcing-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared event-sourced domain design worker |
| `kubernetes-architect` | `resources/agents/architecture/kubernetes-architect.md` | `resources/subagents/architecture/kubernetes-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared Kubernetes platform architecture worker |
| `monorepo-architect` | `resources/agents/architecture/monorepo-architect.md` | `resources/subagents/architecture/monorepo-architect/SUBAGENT.md` | `core` | `core` | Migrated | Shared monorepo structure and task-graph planner |
| `frontend-developer` | `resources/agents/frontend/frontend-developer.md` | `resources/subagents/frontend/frontend-developer/SUBAGENT.md` | `typescript` | `typescript` | Migrated | Shared frontend implementation worker |
| `network-engineer` | `resources/agents/devops/network-engineer.md` | `resources/subagents/devops/network-engineer/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared network design and troubleshooting worker |
| `data-flow-analyzer` | `resources/agents/analysis/data-flow-analyzer.md` | `resources/subagents/analysis/data-flow-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared source-to-sink evidence and trust-boundary analyzer |
| `spec-flow-analyzer` | `resources/agents/analysis/spec-flow-analyzer.md` | `resources/subagents/analysis/spec-flow-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared requirements and user-flow gap analyzer |
| `type-design-analyzer` | `resources/agents/analysis/type-design-analyzer.md` | `resources/subagents/analysis/type-design-analyzer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared invariant and type-model quality reviewer |
| `devops-sre` | `resources/agents/devops/devops-sre.md` | `resources/subagents/devops/devops-sre/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared infrastructure incident and reliability responder |
| `docker-engineer` | `resources/agents/devops/docker-engineer.md` | `resources/subagents/devops/docker-engineer/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared Dockerfile and Compose implementation worker |
| `observability-engineer` | `resources/agents/devops/observability-engineer.md` | `resources/subagents/devops/observability-engineer/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared monitoring, tracing, and alerting implementation worker |
| `terraform-specialist` | `resources/agents/devops/terraform-specialist.md` | `resources/subagents/devops/terraform-specialist/SUBAGENT.md` | `devops` | `devops` | Migrated | Shared Terraform and OpenTofu infrastructure worker |
| `data-engineer` | `resources/agents/data/data-engineer.md` | `resources/subagents/data/data-engineer/SUBAGENT.md` | `database` | `database` | Migrated | Shared pipeline and warehouse implementation worker |
| `data-integrity-guardian` | `resources/agents/data/data-integrity-guardian.md` | `resources/subagents/data/data-integrity-guardian/SUBAGENT.md` | `database` | `database` | Migrated | Shared migration, persistence, and privacy safety reviewer |
| `seed-generator` | `resources/agents/data/seed-generator.md` | `resources/subagents/data/seed-generator/SUBAGENT.md` | `database` | `database` | Migrated | Shared realistic and idempotent seed-data generator |
| `data-scientist` | `resources/agents/data/data-scientist.md` | `resources/subagents/data/data-scientist/SUBAGENT.md` | `database` | `database` | Migrated | Shared statistical analysis and modeling worker |
| `ai-engineer` | `resources/agents/ai-ml/ai-engineer.md` | `resources/subagents/ai-ml/ai-engineer/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared LLM and RAG application engineer |
| `ml-engineer` | `resources/agents/ai-ml/ml-engineer.md` | `resources/subagents/ai-ml/ml-engineer/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared production ML training and serving engineer |
| `mlops-engineer` | `resources/agents/ai-ml/mlops-engineer.md` | `resources/subagents/ai-ml/mlops-engineer/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared ML lifecycle automation and registry engineer |
| `prompt-engineer` | `resources/agents/ai-ml/prompt-engineer.md` | `resources/subagents/ai-ml/prompt-engineer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared prompt design and evaluation worker |
| `language-developer` | `resources/agents/languages/language-developer.md` | `resources/subagents/languages/language-developer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared idiomatic polyglot implementation worker |
| `legacy-modernizer` | `resources/agents/specialized/legacy-modernizer.md` | `resources/subagents/specialized/legacy-modernizer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared incremental legacy modernization worker |
| `poc-builder` | `resources/agents/specialized/poc-builder.md` | `resources/subagents/specialized/poc-builder/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared proof-of-concept artifact builder for verified issues |
| `pr-comment-resolver` | `resources/agents/specialized/pr-comment-resolver.md` | `resources/subagents/specialized/pr-comment-resolver/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared focused review-comment resolution worker |
| `terminal-engineer` | `resources/agents/specialized/terminal-engineer.md` | `resources/subagents/specialized/terminal-engineer/SUBAGENT.md` | `tools` | `tools` | Migrated | Shared terminal, shell, and PTY behavior specialist |
| `agent-creator` | `resources/agents/meta/agent-creator.md` | `resources/subagents/meta/agent-creator/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared agent-definition authoring worker |
| `agent-native-reviewer` | `resources/agents/meta/agent-native-reviewer.md` | `resources/subagents/meta/agent-native-reviewer/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared agent-native parity reviewer |
| `agent-sdk-verifier-py` | `resources/agents/meta/agent-sdk-verifier-py.md` | `resources/subagents/meta/agent-sdk-verifier-py/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared Python Agent SDK verification worker |
| `agent-sdk-verifier-ts` | `resources/agents/meta/agent-sdk-verifier-ts.md` | `resources/subagents/meta/agent-sdk-verifier-ts/SUBAGENT.md` | `ai-agents` | `ai-agents` | Migrated | Shared TypeScript Agent SDK verification worker |
| `output-evaluator` | `resources/agents/meta/output-evaluator.md` | `resources/subagents/meta/output-evaluator/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared first-pass output quality gate |
| `plugin-validator` | `resources/agents/meta/plugin-validator.md` | `resources/subagents/meta/plugin-validator/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared plugin structure and packaging validator |
| `post-dev-orchestrator` | `resources/agents/meta/post-dev-orchestrator.md` | `resources/subagents/meta/post-dev-orchestrator/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared multi-step post-development workflow orchestrator |
| `skill-reviewer` | `resources/agents/meta/skill-reviewer.md` | `resources/subagents/meta/skill-reviewer/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared skill quality and progressive-disclosure reviewer |
| `slash-command-auditor` | `resources/agents/meta/slash-command-auditor.md` | `resources/subagents/meta/slash-command-auditor/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared slash-command audit worker |
| `subagent-auditor` | `resources/agents/meta/subagent-auditor.md` | `resources/subagents/meta/subagent-auditor/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared subagent audit worker |
| `workflow-skill-reviewer` | `resources/agents/meta/workflow-skill-reviewer.md` | `resources/subagents/meta/workflow-skill-reviewer/SUBAGENT.md` | `meta` | `meta` | Migrated | Shared workflow-skill parity reviewer |
| `business-analyst` | `resources/agents/business/business-analyst.md` | `resources/subagents/business/business-analyst/SUBAGENT.md` | `agile-pm` | `agile-pm` | Migrated | Shared product and operations analysis worker |
| `business-council` | `resources/agents/business/business-council.md` | `resources/subagents/business/business-council/SUBAGENT.md` | `agile-pm` | `agile-pm` | Migrated | Shared multi-angle business strategy advisor |
| `quant-analyst` | `resources/agents/business/quant-analyst.md` | `resources/subagents/business/quant-analyst/SUBAGENT.md` | `agile-pm` | `agile-pm` | Migrated | Shared quantitative modeling and scenario analysis worker |
| `startup-analyst` | `resources/agents/business/startup-analyst.md` | `resources/subagents/business/startup-analyst/SUBAGENT.md` | `agile-pm` | `agile-pm` | Migrated | Shared startup positioning and GTM analysis worker |
| `clarity-editor` | `resources/agents/content/clarity-editor.md` | `resources/subagents/content/clarity-editor/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared prose simplification and clarity editing worker |
| `seo-optimizer` | `resources/agents/content/seo-optimizer.md` | `resources/subagents/content/seo-optimizer/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared SEO audit and optimization worker |
| `voice-guardian` | `resources/agents/content/voice-guardian.md` | `resources/subagents/content/voice-guardian/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared voice consistency review worker |
| `design-iterator` | `resources/agents/frontend/design-iterator.md` | `resources/subagents/frontend/design-iterator/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared iterative UI refinement worker |
| `dx-optimizer` | `resources/agents/frontend/dx-optimizer.md` | `resources/subagents/frontend/dx-optimizer/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared developer-experience workflow optimizer |
| `figma-design-sync` | `resources/agents/frontend/figma-design-sync.md` | `resources/subagents/frontend/figma-design-sync/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared Figma-to-implementation parity worker |
| `ui-designer` | `resources/agents/frontend/ui-designer.md` | `resources/subagents/frontend/ui-designer/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared design-system and interface specification worker |
| `ui-visual-validator` | `resources/agents/frontend/ui-visual-validator.md` | `resources/subagents/frontend/ui-visual-validator/SUBAGENT.md` | `frontend` | `frontend` | Migrated | Shared screenshot-based visual verification worker |
| `django-developer` | `resources/agents/languages/django-developer.md` | `resources/subagents/languages/django-developer/SUBAGENT.md` | `python` | `python` | Migrated | Shared Django implementation specialist |
| `fastapi-developer` | `resources/agents/languages/fastapi-developer.md` | `resources/subagents/languages/fastapi-developer/SUBAGENT.md` | `python` | `python` | Migrated | Shared FastAPI implementation specialist |
| `python-developer` | `resources/agents/languages/python-developer.md` | `resources/subagents/languages/python-developer/SUBAGENT.md` | `python` | `python` | Migrated | Shared general Python implementation specialist |
| `rust-developer` | `resources/agents/languages/rust-developer.md` | `resources/subagents/languages/rust-developer/SUBAGENT.md` | `rust` | `rust` | Migrated | Shared Rust implementation specialist |
| `context-manager` | `resources/agents/planning/context-manager.md` | `resources/subagents/planning/context-manager/SUBAGENT.md` | `workflow` | `workflow` | Migrated | Shared context assembly and handoff planner |
| `fix-planner` | `resources/agents/planning/fix-planner.md` | `resources/subagents/planning/fix-planner/SUBAGENT.md` | `workflow` | `workflow` | Migrated | Shared audit-finding consolidation planner |
| `prd-interviewer` | `resources/agents/planning/prd-interviewer.md` | `resources/subagents/planning/prd-interviewer/SUBAGENT.md` | `workflow` | `workflow` | Migrated | Shared structured PRD discovery worker |
| `repo-index` | `resources/agents/planning/repo-index.md` | `resources/subagents/planning/repo-index/SUBAGENT.md` | `workflow` | `workflow` | Migrated | Shared lightweight repository indexing worker |
| `requirements-analyst` | `resources/agents/planning/requirements-analyst.md` | `resources/subagents/planning/requirements-analyst/SUBAGENT.md` | `workflow` | `workflow` | Migrated | Shared structured requirements discovery worker |
| `pr-writer` | `resources/agents/specialized/pr-writer.md` | `resources/subagents/specialized/pr-writer/SUBAGENT.md` | `writing` | `writing` | Migrated | Shared pull-request summary and verification writer |

## Renames And Consolidation Decisions

| Legacy Name | Shared Canonical Name | Decision |
|-------------|-----------------------|----------|
| `dep-auditor` | `dependency-auditor` | Renamed for clarity and consistency with the existing security skill taxonomy |

Current policy:

- `resources/subagents/` is the canonical source for migrated shared subagents
- `resources/agents/` remains in place as legacy source during migration
- Legacy files are not removed until the shared replacement has proven stable in validation and build output
- `distribution.claude_plugin` and `distribution.codex_profile` may be a string or an array when one shared subagent belongs in multiple built outputs

## Deprecation Tracker

| Legacy Source | Shared Replacement | Legacy Status | Blocker Or Next Action |
|---------------|--------------------|---------------|------------------------|
| `resources/agents/code-quality/code-reviewer.md` | `resources/subagents/code-quality/code-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/code-explorer.md` | `resources/subagents/code-quality/code-explorer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/planner.md` | `resources/subagents/planning/planner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/debugging/build-error-resolver.md` | `resources/subagents/debugging/build-error-resolver/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/documentation/docs-writer.md` | `resources/subagents/documentation/docs-writer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/refactorer.md` | `resources/subagents/code-quality/refactorer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/test-runner.md` | `resources/subagents/testing/test-runner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/git-history-analyzer.md` | `resources/subagents/analysis/git-history-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/documentation/doc-auditor.md` | `resources/subagents/documentation/doc-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/research/framework-researcher.md` | `resources/subagents/research/framework-researcher/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/database-architect.md` | `resources/subagents/data/database-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/dep-auditor.md` | `resources/subagents/security/dependency-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted; canonical name is `dependency-auditor` |
| `resources/agents/security/security-reviewer.md` | `resources/subagents/security/security-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/research/fact-checker.md` | `resources/subagents/research/fact-checker/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/infra-auditor.md` | `resources/subagents/devops/infra-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/code-auditor.md` | `resources/subagents/code-quality/code-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/documentation/api-documenter.md` | `resources/subagents/documentation/api-documenter/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/documentation/tech-writer.md` | `resources/subagents/documentation/tech-writer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/research/researcher.md` | `resources/subagents/research/researcher/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/research/source-researcher.md` | `resources/subagents/research/source-researcher/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/threat-modeler.md` | `resources/subagents/security/threat-modeler/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/ui-auditor.md` | `resources/subagents/frontend/ui-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/content/content-writer.md` | `resources/subagents/content/content-writer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/accessibility-reviewer.md` | `resources/subagents/frontend/accessibility-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/reverse-engineer.md` | `resources/subagents/security/reverse-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/incident-responder.md` | `resources/subagents/security/incident-responder/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/contracts-reviewer.md` | `resources/subagents/security/contracts-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/debugging/bug-auditor.md` | `resources/subagents/debugging/bug-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/malware-analyst.md` | `resources/subagents/security/malware-analyst/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/exploitability-verifier.md` | `resources/subagents/security/exploitability-verifier/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/deploy-checker.md` | `resources/subagents/devops/deploy-checker/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/documentation/tutorial-engineer.md` | `resources/subagents/documentation/tutorial-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/debugging/bug-hunter.md` | `resources/subagents/debugging/bug-hunter/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/debugging/bug-reproduction-validator.md` | `resources/subagents/debugging/bug-reproduction-validator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/security/semgrep-scanner.md` | `resources/subagents/security/semgrep-scanner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/deployment-engineer.md` | `resources/subagents/devops/deployment-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/qa-engineer.md` | `resources/subagents/testing/qa-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/perf-auditor.md` | `resources/subagents/code-quality/perf-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/debugging/debugger.md` | `resources/subagents/debugging/debugger/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/browser-tester.md` | `resources/subagents/testing/browser-tester/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/e2e-runner.md` | `resources/subagents/testing/e2e-runner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/fullstack-qa-orchestrator.md` | `resources/subagents/testing/fullstack-qa-orchestrator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/socratic-mentor.md` | `resources/subagents/collaboration/socratic-mentor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/team-debugger.md` | `resources/subagents/collaboration/team-debugger/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/team-implementer.md` | `resources/subagents/collaboration/team-implementer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/team-lead.md` | `resources/subagents/collaboration/team-lead/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/team-reviewer.md` | `resources/subagents/collaboration/team-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/teams/implementer.md` | `resources/subagents/core/implementer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/api-tester.md` | `resources/subagents/testing/api-tester/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/tdd-guide.md` | `resources/subagents/testing/tdd-guide/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/testing/test-coverage-reviewer.md` | `resources/subagents/testing/test-coverage-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/code-fixer.md` | `resources/subagents/code-quality/code-fixer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/refactor-cleaner.md` | `resources/subagents/code-quality/refactor-cleaner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/code-quality/self-review.md` | `resources/subagents/code-quality/self-review/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/content/content-architect.md` | `resources/subagents/content/content-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/architecture-reviewer.md` | `resources/subagents/architecture/architecture-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/comment-analyzer.md` | `resources/subagents/analysis/comment-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/repo-analyzer.md` | `resources/subagents/analysis/repo-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/performance-analyzer.md` | `resources/subagents/analysis/performance-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/architect.md` | `resources/subagents/architecture/architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/backend-architect.md` | `resources/subagents/architecture/backend-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/function-analyzer.md` | `resources/subagents/analysis/function-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/pattern-analyzer.md` | `resources/subagents/analysis/pattern-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/conversation-analyzer.md` | `resources/subagents/analysis/conversation-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/c4-architect.md` | `resources/subagents/architecture/c4-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/cloud-architect.md` | `resources/subagents/architecture/cloud-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/frontend-architect.md` | `resources/subagents/architecture/frontend-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/graphql-architect.md` | `resources/subagents/architecture/graphql-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/vector-db-architect.md` | `resources/subagents/data/vector-db-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/service-mesh-architect.md` | `resources/subagents/devops/service-mesh-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/event-sourcing-architect.md` | `resources/subagents/architecture/event-sourcing-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/kubernetes-architect.md` | `resources/subagents/architecture/kubernetes-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/architecture/monorepo-architect.md` | `resources/subagents/architecture/monorepo-architect/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/frontend-developer.md` | `resources/subagents/frontend/frontend-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/network-engineer.md` | `resources/subagents/devops/network-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/data-flow-analyzer.md` | `resources/subagents/analysis/data-flow-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/spec-flow-analyzer.md` | `resources/subagents/analysis/spec-flow-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/analysis/type-design-analyzer.md` | `resources/subagents/analysis/type-design-analyzer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/devops-sre.md` | `resources/subagents/devops/devops-sre/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/docker-engineer.md` | `resources/subagents/devops/docker-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/observability-engineer.md` | `resources/subagents/devops/observability-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/devops/terraform-specialist.md` | `resources/subagents/devops/terraform-specialist/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/data-engineer.md` | `resources/subagents/data/data-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/data-integrity-guardian.md` | `resources/subagents/data/data-integrity-guardian/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/seed-generator.md` | `resources/subagents/data/seed-generator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/data/data-scientist.md` | `resources/subagents/data/data-scientist/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/ai-ml/ai-engineer.md` | `resources/subagents/ai-ml/ai-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/ai-ml/ml-engineer.md` | `resources/subagents/ai-ml/ml-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/ai-ml/mlops-engineer.md` | `resources/subagents/ai-ml/mlops-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/ai-ml/prompt-engineer.md` | `resources/subagents/ai-ml/prompt-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/languages/language-developer.md` | `resources/subagents/languages/language-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/specialized/legacy-modernizer.md` | `resources/subagents/specialized/legacy-modernizer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/specialized/poc-builder.md` | `resources/subagents/specialized/poc-builder/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/specialized/pr-comment-resolver.md` | `resources/subagents/specialized/pr-comment-resolver/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/specialized/terminal-engineer.md` | `resources/subagents/specialized/terminal-engineer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/agent-creator.md` | `resources/subagents/meta/agent-creator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/agent-native-reviewer.md` | `resources/subagents/meta/agent-native-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/agent-sdk-verifier-py.md` | `resources/subagents/meta/agent-sdk-verifier-py/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/agent-sdk-verifier-ts.md` | `resources/subagents/meta/agent-sdk-verifier-ts/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/output-evaluator.md` | `resources/subagents/meta/output-evaluator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/plugin-validator.md` | `resources/subagents/meta/plugin-validator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/post-dev-orchestrator.md` | `resources/subagents/meta/post-dev-orchestrator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/skill-reviewer.md` | `resources/subagents/meta/skill-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/slash-command-auditor.md` | `resources/subagents/meta/slash-command-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/subagent-auditor.md` | `resources/subagents/meta/subagent-auditor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/meta/workflow-skill-reviewer.md` | `resources/subagents/meta/workflow-skill-reviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/business/business-analyst.md` | `resources/subagents/business/business-analyst/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/business/business-council.md` | `resources/subagents/business/business-council/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/business/quant-analyst.md` | `resources/subagents/business/quant-analyst/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/business/startup-analyst.md` | `resources/subagents/business/startup-analyst/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/content/clarity-editor.md` | `resources/subagents/content/clarity-editor/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/content/seo-optimizer.md` | `resources/subagents/content/seo-optimizer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/content/voice-guardian.md` | `resources/subagents/content/voice-guardian/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/design-iterator.md` | `resources/subagents/frontend/design-iterator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/dx-optimizer.md` | `resources/subagents/frontend/dx-optimizer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/figma-design-sync.md` | `resources/subagents/frontend/figma-design-sync/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/ui-designer.md` | `resources/subagents/frontend/ui-designer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/frontend/ui-visual-validator.md` | `resources/subagents/frontend/ui-visual-validator/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/languages/django-developer.md` | `resources/subagents/languages/django-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/languages/fastapi-developer.md` | `resources/subagents/languages/fastapi-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/languages/python-developer.md` | `resources/subagents/languages/python-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/languages/rust-developer.md` | `resources/subagents/languages/rust-developer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/context-manager.md` | `resources/subagents/planning/context-manager/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/fix-planner.md` | `resources/subagents/planning/fix-planner/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/prd-interviewer.md` | `resources/subagents/planning/prd-interviewer/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/repo-index.md` | `resources/subagents/planning/repo-index/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/planning/requirements-analyst.md` | `resources/subagents/planning/requirements-analyst/SUBAGENT.md` | `Removed` | Legacy file deleted |
| `resources/agents/specialized/pr-writer.md` | `resources/subagents/specialized/pr-writer/SUBAGENT.md` | `Removed` | Legacy file deleted |

## Deprecation Workflow

1. Migrate to `resources/subagents/` and validate.
2. Confirm integrated Claude and Codex build coverage for every required destination.
3. Mark the legacy source `Ready to deprecate` in this audit.
4. Add a deprecation note to the legacy file or delete it immediately if no compatibility window is needed.
5. When the legacy file is deleted, mark the entry `Removed`.
6. Keep the removal record here until the migration is no longer worth tracking.

## Not Yet Consolidated

These areas still need an explicit keep/merge decision before wider migration:

- `docs-writer` vs `tech-writer`
- `framework-researcher` vs `researcher`
- `database-architect` vs adjacent architecture/data specialists
- `security-reviewer` vs narrower audit workers
- `api-documenter` vs broader documentation writers
- `source-researcher` vs `researcher`
- `tutorial-engineer` vs `tech-writer`
- `ui-auditor` vs broader frontend specialist coverage
- `content-writer` vs other writing/content specialists
- `bug-auditor` vs `bug-hunter` and adjacent debugging workers
- `bug-reproduction-validator` vs `debugger`
- `perf-auditor` vs `performance-analyzer` and adjacent analysis workers
- `deploy-checker` vs `deployment-engineer`
- `semgrep-scanner` vs higher-level security scanning workflows
- `qa-engineer` vs `test-runner` and planning-oriented verification helpers
- `browser-tester` vs `e2e-runner`
- `fullstack-qa-orchestrator` vs `browser-tester` and `e2e-runner`
- `team-implementer` vs `implementer`
- `team-debugger` vs `debugger`
- `team-reviewer` vs domain reviewers
- `team-lead` vs `planner`
- `socratic-mentor` vs direct tutoring or implementation guidance
- `api-tester` vs `browser-tester`
- `tdd-guide` vs `implementer`
- `test-coverage-reviewer` vs `code-reviewer`
- `code-fixer` vs `implementer`
- `refactor-cleaner` vs `refactorer`
- `self-review` vs `code-reviewer`
- `content-architect` vs `content-writer`
- `architecture-reviewer` vs `code-reviewer`
- `repo-analyzer` vs `git-history-analyzer`
- `architect` vs `architecture-reviewer`
- `backend-architect` vs `architect`
- `function-analyzer` vs `repo-analyzer`
- `pattern-analyzer` vs `repo-analyzer`
- `conversation-analyzer` vs hook-generation workflows
- `c4-architect` vs `architect`
- `cloud-architect` vs `service-mesh-architect`
- `frontend-architect` vs `frontend-developer`
- `graphql-architect` vs `backend-architect`
- `vector-db-architect` vs `database-architect`
- `event-sourcing-architect` vs `backend-architect`
- `kubernetes-architect` vs `cloud-architect`
- `monorepo-architect` vs `repo-analyzer`
- `network-engineer` vs `cloud-architect`
- `data-flow-analyzer` vs `function-analyzer`
- `spec-flow-analyzer` vs planning-oriented requirement reviewers
- `type-design-analyzer` vs `architecture-reviewer`
- `devops-sre` vs `incident-responder`
- `docker-engineer` vs `deployment-engineer`
- `observability-engineer` vs `devops-sre`
- `terraform-specialist` vs `cloud-architect`
- `data-engineer` vs `database-architect`
- `data-integrity-guardian` vs `database-architect`
- `seed-generator` vs `data-engineer`
- `data-scientist` vs `data-engineer`
- `ai-engineer` vs `prompt-engineer`
- `ml-engineer` vs `data-scientist`
- `mlops-engineer` vs `deployment-engineer`
- `prompt-engineer` vs `ai-engineer`
- `language-developer` vs dedicated language specialists
- `legacy-modernizer` vs `implementer`
- `poc-builder` vs security verification workers
- `pr-comment-resolver` vs `code-fixer`
- `terminal-engineer` vs `language-developer`
- `agent-creator` vs `subagent-auditor`
- `agent-native-reviewer` vs `architecture-reviewer`
- `agent-sdk-verifier-py` vs `agent-sdk-verifier-ts`
- `output-evaluator` vs `code-reviewer`
- `plugin-validator` vs `skill-reviewer`
- `post-dev-orchestrator` vs narrower launch-content workers
- `skill-reviewer` vs `workflow-skill-reviewer`
- `workflow-skill-reviewer` vs `skill-reviewer`
- `slash-command-auditor` vs `subagent-auditor`
- `subagent-auditor` vs `agent-creator`
- `incident-responder` vs deeper operations responders
- `business-analyst` vs `startup-analyst`
- `business-council` vs `startup-analyst`
- `quant-analyst` vs `business-analyst`
- `clarity-editor` vs `tech-writer`
- `seo-optimizer` vs `content-writer`
- `voice-guardian` vs `clarity-editor`
- `design-iterator` vs `figma-design-sync`
- `dx-optimizer` vs `frontend-developer`
- `figma-design-sync` vs `ui-visual-validator`
- `ui-designer` vs `frontend-developer`
- `ui-visual-validator` vs `figma-design-sync`
- `django-developer` vs `python-developer`
- `fastapi-developer` vs `python-developer`
- `python-developer` vs `language-developer`
- `rust-developer` vs `language-developer`
- `context-manager` vs `repo-index`
- `fix-planner` vs `planner`
- `prd-interviewer` vs `planner`
- `repo-index` vs `repo-analyzer`
- `requirements-analyst` vs `prd-interviewer`
- `pr-writer` vs `pr-comment-resolver`

## Next Candidates

Good next migration candidates after the current set:

- No remaining legacy agent files under `resources/agents/`
- Review the negotiation protocol docs under `resources/protocols/negotiation/`
- Remove stray filesystem artifacts such as `.DS_Store` if present

## Verification

Current audit reflects these commands:

```bash
node scripts/ci/validate-subagents.js
bash builders/build-claude-subagents.sh
bash builders/build-codex-agents.sh
```
