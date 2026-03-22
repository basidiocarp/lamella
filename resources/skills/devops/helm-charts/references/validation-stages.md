# Validation Stages Reference

This document contains the detailed validation workflow stages for the Helm Chart Validator.

## Stage 1: Tool Check

Before starting validation, verify required tools are installed:

```bash
bash scripts/setup_tools.sh
```

Required tools:
- **helm**: Helm package manager for Kubernetes (v3+)
- **yamllint**: YAML syntax and style linting
- **kubeconform**: Kubernetes schema validation with CRD support
- **kubectl**: Cluster dry-run testing (optional but recommended)

Fallback policy for unavailable tools or environment constraints:

| Condition | Action | Stage status |
|-----------|--------|--------------|
| `helm` missing | Run Stage 2 only, then report Stages 3 to 9 as skipped/blocked | ⚠️ Warning |
| `yamllint` missing | Use `yq` syntax checks if available; otherwise skip Stage 5 | ⚠️ Warning |
| `kubeconform` missing | Skip Stage 7 and rely on Stage 6 CRD/manual checks | ⚠️ Warning |
| `kubectl` missing or no kube-context | Skip Stage 8, continue with remaining stages | ⚠️ Warning |
| No internet access for CRD docs | Use local CRD manifests and kubeconform output, mark doc lookup incomplete | ⚠️ Warning |

If tools are missing, provide installation instructions from `scripts/setup_tools.sh` output and continue with the fallback path above.

## Stage 2: Helm Chart Structure Validation

Verify the chart follows the standard Helm directory structure:

```bash
bash scripts/validate_chart_structure.sh <chart-directory>
```

**Expected structure:**
```
mychart/
  Chart.yaml          # Chart metadata (required)
  values.yaml         # Default values (required)
  values.schema.json  # JSON Schema for values validation (optional)
// ... (5 lines trimmed)
  crds/               # Custom Resource Definitions (optional)
  .helmignore         # Files to ignore during packaging (optional)
```

**Common issues caught:**
- Missing required files (Chart.yaml, values.yaml, templates/)
- Invalid Chart.yaml syntax or missing required fields
- Malformed values.schema.json
- Incorrect file permissions

## Stage 3: Helm Lint

Run Helm's built-in linter to catch chart-specific issues:

```bash
helm lint <chart-directory> --strict
```

**Optional flags:**
- `--values <values-file>`: Test with specific values
- `--set key=value`: Override specific values
- `--debug`: Show detailed error information

**Common issues caught:**
- Invalid Chart.yaml metadata
- Template syntax errors
- Missing or undefined values
- Deprecated Kubernetes API versions
- Chart best practice violations

**Auto-fix approach:**
- For template errors, identify the problematic template file
- Show the user the specific line causing issues
- Propose a patch/diff for the fix
- Apply fixes only if the user explicitly asks
- Re-run `helm lint` after fixes are applied

## Stage 4: Template Rendering

Render templates locally to verify they produce valid YAML:

```bash
helm template <release-name> <chart-directory> \
  --values <values-file> \
  --debug \
  --output-dir ./rendered
```

**Options to consider:**
- `--values values.yaml`: Use specific values file
- `--set key=value`: Override individual values
- `--show-only templates/deployment.yaml`: Render specific template
- `--validate`: Validate against Kubernetes OpenAPI schema
- `--include-crds`: Include CRDs in rendered output
- `--is-upgrade`: Simulate upgrade scenario
- `--kube-version 1.28.0`: Target specific Kubernetes version

**Common issues caught:**
- Template syntax errors (Go template issues)
- Undefined variables or values
- Type mismatches (string vs. integer)
- Missing required values
- Logic errors in conditionals or loops
- Incorrect indentation in nested templates

**For template errors:**
- Identify the template file and line number
- Check if values are properly defined in values.yaml
- Verify template function usage (quote, required, default, include, etc.)
- Test with different value combinations

## Stage 5: YAML Syntax Validation

Validate YAML syntax and formatting of rendered templates:

```bash
find ./rendered -type f \( -name "*.yaml" -o -name "*.yml" \) \
  -exec yamllint -c assets/.yamllint {} +
```

**Common issues caught:**
- Indentation errors (tabs vs spaces)
- Trailing whitespace
- Line length violations
- Syntax errors
- Duplicate keys
- Document start/end markers

**Auto-fix approach:**
- For simple issues (indentation, trailing spaces), propose fixes using the Edit tool
- For template-generated issues, fix the source template, not rendered output
- Always show the user what will be changed before applying fixes

## Stage 6: CRD Detection and Documentation Lookup

Before schema validation, detect if the chart contains or renders Custom Resource Definitions:

```bash
# Check crds/ directory
if [ -d <chart-directory>/crds ]; then
  find <chart-directory>/crds -type f \( -name "*.yaml" -o -name "*.yml" \) \
    -exec bash scripts/detect_crd_wrapper.sh {} +
fi

# Check rendered templates
find ./rendered -type f \( -name "*.yaml" -o -name "*.yml" \) \
  -exec bash scripts/detect_crd_wrapper.sh {} +
```

The script outputs JSON with resource information:
```json
[
  {
    "kind": "Certificate",
    "apiVersion": "cert-manager.io/v1",
    "group": "cert-manager.io",
    "version": "v1",
    "isCRD": true,
    "name": "example-cert"
  }
]
```

**For each detected CRD:**

1. **Try context7 MCP first (preferred):**
   ```
   Use mcp__context7__resolve-library-id with the CRD project name
   Example: "cert-manager" for cert-manager.io CRDs
            "prometheus-operator" for monitoring.coreos.com CRDs
            "istio" for networking.istio.io CRDs

   Then use mcp__context7__query-docs with:
   - libraryId from resolve step
   - query: The CRD kind and relevant features (e.g., "Certificate spec required fields")
   ```

2. **Fallback to `web.search_query` (web search) if Context7 fails:**
   ```
   Search query pattern:
   "<kind>" "<group>" kubernetes CRD "<version>" documentation spec

   Example:
   "Certificate" "cert-manager.io" kubernetes CRD "v1" documentation spec
   "Prometheus" "monitoring.coreos.com" kubernetes CRD "v1" documentation spec
   ```

3. **Extract key information:**
   - Required fields in `spec`
   - Field types and validation rules
   - Examples from documentation
   - Version-specific changes or deprecations
   - Common configuration patterns

**Why this matters:** CRDs have custom schemas not available in standard Kubernetes validation tools. Understanding the CRD's spec requirements prevents validation errors and ensures correct resource configuration.

## Stage 7: Schema Validation

Validate rendered templates against Kubernetes schemas:

```bash
find ./rendered -type f \( -name "*.yaml" -o -name "*.yml" \) -exec \
  kubeconform \
    -schema-location default \
    -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json' \
    -summary \
    -verbose \
    {} +
```

**Options to consider:**
- Add `-strict` to reject unknown fields (recommended for production)
- Add `-ignore-missing-schemas` if working with custom/internal CRDs
- Add `-kubernetes-version 1.28.0` to validate against specific K8s version
- Add `-output json` for programmatic processing

**Common issues caught:**
- Invalid apiVersion or kind
- Missing required fields
- Wrong field types
- Invalid enum values
- Unknown fields (with -strict)

**For CRDs:** If kubeconform reports "no schema found", this is expected. Use the documentation from Stage 6 to manually validate the spec fields.

**Stage 7 success criteria (explicit):**
- ✅ Passed: `kubeconform` exits `0`, and no invalid resources are reported.
- ⚠️ Warning: only CRD schema-missing findings remain and Stage 6 documentation/manual verification is completed.
- ❌ Failed: any non-CRD schema violation, parse error, or unresolved required-field/type error.

## Stage 8: Cluster Dry-Run (if available)

If kubectl is configured and cluster access is available, perform a server-side dry-run:

```bash
# Test installation
helm install <release-name> <chart-directory> \
  --dry-run=server \
  --debug \
// ... (5 lines trimmed)
  --debug \
  --values <values-file>
```

If the Helm version does not support `--dry-run=server`, use `--dry-run` and document that only client-side Helm simulation was executed.

**This catches:**
- Admission controller rejections
- Policy violations (PSP, OPA, Kyverno, etc.)
- Resource quota violations
- Missing namespaces
- Invalid ConfigMap/Secret references
- Webhook validations
- Existing resource conflicts

**If dry-run is not possible:**
- Use kubectl with rendered templates: `kubectl apply --dry-run=server -f ./rendered/`
- Skip if no cluster access
- Document that cluster-specific validation was skipped

**For updates to existing releases:**
```bash
helm diff upgrade <release-name> <chart-directory>
```
This shows what would change, helping catch unintended modifications. (Requires helm-diff plugin)

**Stage 8 success criteria (explicit):**
- ✅ Passed: dry-run install and upgrade commands exit `0` with no admission/policy errors.
- ⚠️ Warning: stage skipped because `kubectl`/cluster context/access is unavailable, or only client-side fallback was possible.
- ❌ Failed: dry-run commands return non-zero due to admission webhooks, policy violations, namespace/quota errors, or reference errors.

## Stage 9: Security Best Practices Check (MANDATORY)

**IMPORTANT:** This stage is MANDATORY. Analyze rendered templates for security best practices compliance.

**Check rendered Deployment/Pod templates for:**

1. **Missing securityContext** - Look for pods/containers without security settings:
   ```yaml
   # Check if pod-level securityContext exists
   spec:
     securityContext:
       runAsNonRoot: true
       runAsUser: 1000
       fsGroup: 2000
   ```

2. **Missing container securityContext** - Each container should have:
   ```yaml
   securityContext:
     allowPrivilegeEscalation: false
     readOnlyRootFilesystem: true
     runAsNonRoot: true
     capabilities:
       drop:
         - ALL
   ```

3. **Missing resource limits/requests** - Check for:
   ```yaml
   resources:
     limits:
       cpu: "100m"
       memory: "128Mi"
     requests:
       cpu: "100m"
       memory: "128Mi"
   ```

4. **Image tag issues** - Flag if using `:latest` or no tag

5. **Missing probes** - Check for liveness/readiness probes

**How to check:** Read the rendered deployment YAML files and grep for these patterns:
```bash
# Check for securityContext
find ./rendered -type f \( -name "*.yaml" -o -name "*.yml" \) \
  -exec grep -l "securityContext" {} +

// ... (5 lines trimmed)
find ./rendered -type f \( -name "*.yaml" -o -name "*.yml" \) \
  -exec grep "image:.*:latest" {} +
```

## Stage 10: Final Report (MANDATORY)

**IMPORTANT:** This stage is MANDATORY even if all validations pass. You MUST complete ALL of the following actions.

**Default behavior is read-only.** Do not modify files unless the user explicitly asks you to apply fixes.

### Step 1: Load Reference Files (MANDATORY when warnings exist)

**If ANY warnings, errors, or security issues were found, you MUST read:**
```
Read references/helm_best_practices.md
Read references/k8s_best_practices.md
```

Use these references to provide context and recommendations for each issue found.

### Step 2: Present Validation Summary

**Always present a validation summary** formatted as a table showing:
- Each validation stage executed (Stages 1-9)
- Status of each stage (✅ Passed, ⚠️ Warning, ❌ Failed)
- Count of issues found per stage

Example:
```
| Stage | Status | Issues |
|-------|--------|--------|
| 1. Tool Check | ✅ Passed | All tools available |
| 2. Structure | ⚠️ Warning | Missing: .helmignore, NOTES.txt |
// ... (5 lines trimmed)
| 8. Dry-Run | ✅ Passed | No cluster errors |
| 9. Security Check | ⚠️ Warning | Missing securityContext |
```

### Step 3: Categorize All Issues

Group findings by severity:

**❌ Errors (must fix):**
- Template syntax errors
- Missing required fields
- Schema validation failures
- Dry-run failures

**⚠️ Warnings (should fix):**
- Deprecated Kubernetes APIs
- Missing securityContext
- Missing resource limits/requests
- Using `:latest` image tag
- Missing recommended files (_helpers.tpl, .helmignore, NOTES.txt)

**ℹ️ Info (recommendations):**
- Missing values.schema.json
- Missing README.md
- Optimization opportunities

### Step 4: List Proposed Changes (DO NOT APPLY)

For each issue, provide a **proposed fix** with:
- File path and line number (if applicable)
- Before/after code blocks
- Explanation of why this change is recommended

Example format:
```
## Proposed Changes

### 1. Add securityContext to Deployment
**File:** templates/deployment.yaml:25
**Severity:** ⚠️ Warning
**Reason:** Running containers as root is a security risk

**Current:**
```yaml
spec:
  containers:
    - name: app
      image: nginx:1.21
```

**Proposed:**
```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
    - name: app
      image: nginx:1.21
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

### 2. Add .helmignore file
**File:** .helmignore (new file)
**Severity:** ⚠️ Warning
**Reason:** Excludes unnecessary files from chart packaging

**Proposed:** Copy from `assets/.helmignore`
```

### Step 5: Automation Opportunities

List all detected automation opportunities:
- If `_helpers.tpl` is missing → Recommend: `bash scripts/generate_helpers.sh <chart>`
- If `.helmignore` is missing → Recommend: Copy from `assets/.helmignore`
- If `values.schema.json` is missing → Recommend: Copy and customize from `assets/values.schema.json`
- If `NOTES.txt` is missing → Recommend: Create post-install notes template
- If `README.md` is missing → Recommend: Create chart documentation

### Step 6: Final Summary

Provide a final summary:
```
## Validation Summary

**Chart:** <chart-name>
**Status:** ⚠️ Warnings Found (or ✅ Ready for Deployment)

// ... (8 lines trimmed)
1. Review proposed changes above
2. Apply changes manually or use helm-generator skill
3. Re-run validation to confirm fixes
```
