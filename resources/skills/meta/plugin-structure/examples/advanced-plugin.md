# Advanced Plugin Example

A complex, enterprise-grade plugin with MCP integration and advanced organization.

## Directory Structure

```
enterprise-devops/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── ci/
// ... (83 lines trimmed)
    └── templates/
        ├── deployment.yaml
        └── service.yaml
```

## File Contents

### .claude-plugin/plugin.json

```json
{
  "name": "enterprise-devops",
  "version": "2.3.1",
  "description": "Comprehensive DevOps automation for enterprise CI/CD pipelines, infrastructure management, and monitoring",
  "author": {
// ... (29 lines trimmed)
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

### .mcp.json

```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/kubernetes-mcp/index.js"],
// ... (20 lines trimmed)
    }
  }
}
```

### commands/ci/build.md

```markdown
---
name: build
description: Trigger and monitor CI build pipeline
---

// ... (34 lines trimmed)
- Offer to deploy to staging
- Suggest performance optimizations
- Generate deployment checklist
```

### agents/orchestration/deployment-orchestrator.md

```markdown
---
description: Orchestrates complex multi-environment deployments with rollback capabilities and health monitoring
capabilities:
  - Plan and execute multi-stage deployments
  - Coordinate service dependencies
// ... (72 lines trimmed)
  metadata: deploymentPlan
})
\`\`\`
```

### skills/kubernetes-ops/SKILL.md

```markdown
---
name: Kubernetes Operations
description: This skill should be used when deploying to Kubernetes, managing K8s resources, troubleshooting cluster issues, configuring ingress/services, scaling deployments, or working with Kubernetes manifests. Provides comprehensive Kubernetes operational knowledge and best practices.
version: 2.0.0
---
// ... (306 lines trimmed)
\`\`\`bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/kubernetes-ops/scripts/validate-manifest.sh deployment.yaml
\`\`\`
```

### hooks/hooks.json

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
// ... (57 lines trimmed)
    }
  ]
}
```

## Key Features

### Multi-Level Organization

**Commands**: Organized by function (CI, monitoring, admin)
**Agents**: Separated by role (orchestration vs. specialized)
**Skills**: Rich resources (references, examples, scripts)

### MCP Integration

Three custom MCP servers:
- **Kubernetes**: Cluster operations
- **Terraform**: Infrastructure provisioning
- **GitHub Actions**: CI/CD automation

### Shared Libraries

Reusable code in `lib/`:
- **Core**: Common utilities (logging, config, auth)
- **Integrations**: External services (Slack, Datadog)
- **Utils**: Helper functions (retry, validation)

### Configuration Management

Environment-specific configs in `config/`:
- **Environments**: Per-environment settings
- **Templates**: Reusable deployment templates

### Security Automation

Multiple security hooks:
- Secret scanning before writes
- Permission validation on session start
- Configuration auditing on completion

### Monitoring Integration

Built-in monitoring via lib integrations:
- Datadog for metrics
- PagerDuty for alerts
- Slack for notifications

## Use Cases

1. **Multi-environment deployments**: Orchestrated rollouts across dev/staging/prod
2. **Infrastructure as code**: Terraform automation with state management
3. **CI/CD automation**: Build, test, deploy pipelines
4. **Monitoring and observability**: Integrated metrics and alerting
5. **Security enforcement**: Automated security scanning and validation
6. **Team collaboration**: Slack notifications and status updates

## When to Use This Pattern

- Large-scale enterprise deployments
- Multiple environment management
- Complex CI/CD workflows
- Integrated monitoring requirements
- Security-critical infrastructure
- Team collaboration needs

## Scaling Considerations

- **Performance**: Separate MCP servers for parallel operations
- **Organization**: Multi-level directories for scalability
- **Maintainability**: Shared libraries reduce duplication
- **Flexibility**: Environment configs enable customization
- **Security**: Layered security hooks and validation
