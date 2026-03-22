# C4 Architecture Documentation Workflow

Generate C4 architecture documentation for a codebase using a bottom-up approach: Code -> Component -> Container -> Context.

All documentation is written to `C4-Documentation/` in the repository root.

## Phase 1: Code-Level Documentation (Bottom-Up)

### 1.1 Discover Subdirectories

- Identify all subdirectories in the repository
- Sort by depth (deepest first) for bottom-up processing
- Filter out non-code directories (node_modules, .git, build, dist, etc.)

### 1.2 Process Each Directory

For each directory, starting from the deepest:

- Use Task tool with subagent_type="c4-architecture::c4-code"
- Prompt: Analyze the code in `[directory_path]`. Create C4 Code-level documentation covering:
  1. Overview (name, description, location, language, purpose)
  2. Code elements with complete function/method signatures (params with types, return types), descriptions, locations, dependencies
  3. Classes/modules with methods and dependencies
  4. Internal and external dependencies
  5. Mermaid diagram if relationships are complex
- Save output as `C4-Documentation/c4-code-[sanitized-directory-name].md`

Repeat for every subdirectory.

## Phase 2: Component-Level Synthesis

### 2.1 Create Component Documentation

Collect all `c4-code-*.md` files. Identify logical component boundaries by domain, technical, or organizational lines.

For each component:

- Use Task tool with subagent_type="c4-architecture::c4-component"
- Prompt: Synthesize these code-level docs into a component:
  1. Overview (name, description, type, technology)
  2. Purpose and responsibilities
  3. Software features provided
  4. Links to contained `c4-code-*.md` files
  5. Interfaces (protocol, operations, data contracts)
  6. Dependencies (other components, external systems)
  7. Mermaid C4Component diagram
- Save as `C4-Documentation/c4-component-[name].md`

### 2.2 Create Master Component Index

- Use Task tool with subagent_type="c4-architecture::c4-component"
- Generate `C4-Documentation/c4-component.md` listing all components with descriptions, links, and a relationship diagram

## Phase 3: Container-Level Synthesis

### 3.1 Map Components to Containers

Review component docs and deployment definitions (Dockerfiles, K8s manifests, Terraform, cloud configs).

- Use Task tool with subagent_type="c4-architecture::c4-container"
- Prompt: Map components to containers based on deployment definitions:
  1. Container inventory (name, type, technology, deployment)
  2. Components deployed in each container
  3. API documentation as OpenAPI 3.1+ specs (save to `C4-Documentation/apis/[container]-api.yaml`)
  4. Container dependencies and communication protocols
  5. Infrastructure details (deployment config links, scaling, resources)
  6. Mermaid C4Container diagram
- Save as `C4-Documentation/c4-container.md`

## Phase 4: Context-Level Documentation

### 4.1 Create Context Documentation

Review container docs, component docs, README files, architecture docs, test files.

- Use Task tool with subagent_type="c4-architecture::c4-context"
- Prompt: Create C4 Context-level documentation:
  1. System overview (short and long description)
  2. Personas (human and programmatic users)
  3. System features mapped to personas
  4. User journeys for each key feature
  5. External systems and dependencies
  6. Mermaid C4Context diagram
  7. Links to container and component documentation
- Save as `C4-Documentation/c4-context.md`

## Output Structure

```
C4-Documentation/
  c4-code-*.md              # One per directory
  c4-component-*.md          # One per component
  c4-component.md            # Master component index
  c4-container.md            # Container-level docs
  c4-context.md              # Context-level docs
  apis/
    [container]-api.yaml     # OpenAPI specs
```

## Notes

- Process directories bottom-up so code-level docs exist before synthesis
- Each level builds on the previous level's documentation
- Every directory must have code-level docs before component synthesis begins
- All files link to each other for navigation
- Container APIs must have OpenAPI specifications
- Context documentation must be understandable by non-technical stakeholders
