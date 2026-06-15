# Error Handling & Troubleshooting

This document covers error handling strategies, communication guidelines, and version awareness for Helm chart validation.

## Error Handling Strategies

### Tool Not Available
- Run `scripts/setup_tools.sh` to check availability
- Provide installation instructions
- Skip optional stages but document what was skipped
- Continue with available tools

### Template Rendering Errors
- Show the specific template file and line number
- Check if values are defined in values.yaml
- Verify template function syntax
- Test with simpler value combinations
- Use `--debug` flag for detailed error messages

### Cluster Access Issues
- Fall back to client-side validation
- Use rendered templates with kubectl
- Skip cluster validation if no kubectl config
- Document limitations in validation report

### CRD Documentation Not Found
- Document that documentation lookup failed
- Attempt validation with kubeconform CRD schemas
- Suggest manual CRD inspection:
  ```bash
  kubectl get crd <crd-name>.group -o yaml
  kubectl explain <kind>
  ```

### Validation Stage Failures
- Continue to next stage even if one fails
- Collect all errors before presenting to user
- Prioritize fixing Helm lint errors first
- Then fix template errors
- Finally fix schema/validation errors

### macOS Extended Attributes Issue

**Symptom:** Helm reports "Chart.yaml file is missing" even though the file exists and is readable.

**Cause:** On macOS, files created programmatically (via Write tool, scripts, or certain editors) may have extended attributes (e.g., `com.apple.provenance`, `com.apple.quarantine`) that interfere with Helm's file detection.

**Diagnosis:**
```bash
# Check for extended attributes
xattr /path/to/chart/Chart.yaml

# If attributes are present, you'll see output like:
# com.apple.provenance
# com.apple.quarantine
```

**Solutions:**

1. **Remove extended attributes:**
   ```bash
   # Remove all extended attributes from a file
   xattr -c /path/to/chart/Chart.yaml

   # Remove all extended attributes recursively from chart directory
   xattr -cr /path/to/chart/
   ```

2. **Create files using shell commands instead:**
   ```bash
   # Use cat with heredoc instead of direct file writes
   cat > Chart.yaml << 'EOF'
   apiVersion: v2
   name: mychart
   version: 0.1.0
   EOF
   ```

3. **Copy from helm-created chart:**
   ```bash
   # Create a fresh chart and copy structure
   helm create temp-chart
   cp -r temp-chart/* /path/to/your/chart/
   rm -rf temp-chart
   ```

**Prevention:** When creating new chart files on macOS, prefer using `helm create` as a base or use shell heredocs (`cat > file << 'EOF'`) rather than direct file creation tools.

## Communication Guidelines

When presenting validation results and fixes:

1. **Be clear and concise** about what was found
2. **Explain why issues matter** (e.g., "This will cause pod creation to fail")
3. **Provide context** from Helm best practices when relevant
4. **Group related issues** (e.g., all missing helper issues together)
5. **Use file:line references** when available
6. **Show confidence level** for auto-fixes (high confidence = syntax, low = logic changes)
7. **Always provide a summary after proposing fixes** (and after applying fixes when explicitly requested) including:
   - What was changed and why
   - File and line references for each fix
   - Total count of issues resolved
   - Final validation status
   - Any remaining warnings or recommendations

## Version Awareness

Always consider Kubernetes and Helm version compatibility:
- Check for deprecated Kubernetes APIs
- Ensure Helm chart apiVersion is v2 (for Helm 3+)
- For CRDs, ensure the apiVersion matches what's in the cluster
- Use `kubectl api-versions` to list available API versions
- Reference version-specific documentation when available
- Set `kubeVersion` constraint in Chart.yaml if needed
