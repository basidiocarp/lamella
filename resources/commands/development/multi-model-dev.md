---
description: Multi-model focused development workflow (backend or frontend)
argument-hint: <task description>
---

# Multi-Model Development

Backend or frontend focused workflow (Research → Ideation → Plan → Execute → Optimize → Review) using multi-model collaboration.

## Usage

```bash
/multi-model-dev <task description>
```

## Task Type Routing

Automatically select the lead model based on task type:

| Task Type | Lead Model | Auxiliary | Examples |
|-----------|-----------|-----------|----------|
| **Backend** | Codex | Gemini | API design, algorithms, database optimization, business logic |
| **Frontend** | Gemini | Codex | Component design, responsive layout, UI animations, style optimization |

**Detection**: If task mentions UI, components, styles, layout, design, responsive, accessibility → Frontend. Otherwise → Backend.

## Your Role

Coordinate multi-model collaboration (Research → Ideation → Plan → Execute → Optimize → Review).

**Collaborative Models**:
- **Codex** – Backend logic, algorithms
- **Gemini** – Frontend UI/UX
- **Claude (self)** – Orchestration, planning, execution, delivery

**Trust rules**: The lead model's domain opinions are authoritative. The auxiliary model's domain opinions are for reference only.

---

## Multi-Model Call Specification

**Call Syntax** (substitute `{backend}` and `{model_flag}` per routing above):

```
# New session call
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend {backend} {model_flag} - \"$PWD\" <<'EOF'\nROLE_FILE: <role prompt path>\n<TASK>\nRequirement: <enhanced requirement>\nContext: <project context>\n</TASK>\nOUTPUT: Expected output format\nEOF",
  run_in_background: false,
  timeout: 3600000,
  description: "Brief description"
})
```

- **Backend routing**: `--backend codex`
- **Frontend routing**: `--backend gemini --gemini-model gemini-3-pro-preview`
- **Resume**: Add `resume <SESSION_ID>` after the backend flag

**Role Prompts**:

| Phase | Codex (backend) | Gemini (frontend) |
|-------|-----------------|-------------------|
| Analysis | `~/.claude/.ccg/prompts/codex/analyzer.md` | `~/.claude/.ccg/prompts/gemini/analyzer.md` |
| Planning | `~/.claude/.ccg/prompts/codex/architect.md` | `~/.claude/.ccg/prompts/gemini/architect.md` |
| Review | `~/.claude/.ccg/prompts/codex/reviewer.md` | `~/.claude/.ccg/prompts/gemini/reviewer.md` |

**Session Reuse**: Save `SESSION_ID` from Phase 2, use `resume` in Phases 3 and 5.

---

## Communication Guidelines

1. Start responses with mode label `[Mode: X]`, initial is `[Mode: Research]`
2. Follow strict sequence: `Research → Ideation → Plan → Execute → Optimize → Review`
3. Use `AskUserQuestion` tool for user interaction when needed

---

## Core Workflow

### Phase 0: Prompt Enhancement (Optional)

`[Mode: Prepare]` - If ace-tool MCP available, call `mcp__ace-tool__enhance_prompt`, replace original $ARGUMENTS with enhanced result.

### Phase 1: Research

`[Mode: Research]` - Understand requirements and gather context

1. **Code Retrieval** (if ace-tool MCP available): Call `mcp__ace-tool__search_context` to retrieve existing codebase context relevant to the task type
2. Requirement completeness score (0-10): >=7 continue, <7 stop and supplement

### Phase 2: Ideation

`[Mode: Ideation]` - Lead model analysis

**MUST call lead model** (follow call specification above):
- ROLE_FILE: Lead model's `analyzer.md`
- Requirement: Enhanced requirement (or $ARGUMENTS)
- Context: Project context from Phase 1
- OUTPUT: Feasibility analysis, recommended solutions (at least 2), risk/UX assessment

**Save SESSION_ID** for subsequent phase reuse. Output solutions, wait for user selection.

### Phase 3: Planning

`[Mode: Plan]` - Lead model planning

**MUST call lead model** (use `resume <SESSION_ID>`):
- ROLE_FILE: Lead model's `architect.md`
- Requirement: User's selected solution
- Context: Analysis results from Phase 2
- OUTPUT: File structure, component/function design, dependency relationships

Save plan to `.claude/plan/task-name.md` after user approval.

### Phase 4: Implementation

`[Mode: Execute]` - Code development

- Strictly follow approved plan
- Follow existing project code standards
- Ensure error handling, security, performance, accessibility as appropriate

### Phase 5: Optimization

`[Mode: Optimize]` - Lead model review

**MUST call lead model** (follow call specification):
- ROLE_FILE: Lead model's `reviewer.md`
- Requirement: Review the code changes
- Context: git diff or code content
- OUTPUT: Issues list (security, performance, accessibility, design consistency)

Integrate review feedback, execute optimization after user confirmation.

### Phase 6: Quality Review

`[Mode: Review]` - Final evaluation

- Check completion against plan
- Run tests to verify functionality
- Report issues and recommendations

---

## Key Rules

1. **Lead model's domain opinions are trustworthy**
2. **Auxiliary model's domain opinions are for reference only**
3. External models have **zero filesystem write access**
4. Claude handles all code writes and file operations
