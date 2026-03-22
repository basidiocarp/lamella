# GitHub Issue Resolution Expert

## Context

The user needs comprehensive GitHub issue resolution that goes beyond simple fixes. Focus on thorough investigation, proper branch management, systematic implementation with testing, and professional pull request creation that follows modern CI/CD practices.

## Requirements

GitHub Issue ID or URL: $ARGUMENTS

## Instructions

### 1. Issue Analysis and Triage

**Initial Investigation**

```bash
# Get complete issue details
gh issue view $ISSUE_NUMBER --comments

# Check issue metadata
gh issue view $ISSUE_NUMBER --json title,body,labels,assignees,milestone,state

# Review linked PRs and related issues
gh issue view $ISSUE_NUMBER --json linkedBranches,closedByPullRequests
```

**Triage Assessment Framework**

- **Priority Classification**:
  - P0/Critical: Production breaking, security vulnerability, data loss
  - P1/High: Major feature broken, significant user impact
  - P2/Medium: Minor feature affected, workaround available
  - P3/Low: Cosmetic issue, enhancement request

**Context Gathering**

```bash
# Search for similar resolved issues
gh issue list --search "similar keywords" --state closed --limit 10

# Check recent commits related to affected area
git log --oneline --grep="component_name" -20

# Review PR history for regression possibilities
gh pr list --search "related_component" --state merged --limit 5
```

### 2. Investigation and Root Cause Analysis

**Code Archaeology**

```bash
# Find when the issue was introduced
git bisect start
git bisect bad HEAD
git bisect good <last_known_good_commit>

# Automated bisect with test script
git bisect run ./test_issue.sh

# Blame analysis for specific file
git blame -L <start>,<end> path/to/file.js
```

**Codebase Investigation**

```bash
# Search for all occurrences of problematic function
rg "functionName" --type js -A 3 -B 3

# Find all imports/usages
rg "import.*ComponentName|from.*ComponentName" --type tsx

# Analyze call hierarchy
grep -r "methodName(" . --include="*.py" | head -20
```

**Dependency Analysis**

```javascript
// Check for version conflicts
const checkDependencies = () => {
  const package = require("./package.json");
  const lockfile = require("./package-lock.json");

  Object.keys(package.dependencies).forEach((dep) => {
    const specVersion = package.dependencies[dep];
    const lockVersion = lockfile.dependencies[dep]?.version;

    if (lockVersion && !satisfies(lockVersion, specVersion)) {
      console.warn(
        `Version mismatch: ${dep} - spec: ${specVersion}, lock: ${lockVersion}`,
      );
    }
  });
};
```

### 3. Branch Strategy and Setup

**Branch Naming Conventions**

```bash
# Feature branches
git checkout -b feature/issue-${ISSUE_NUMBER}-short-description

# Bug fix branches
git checkout -b fix/issue-${ISSUE_NUMBER}-component-bug

# Hotfix for production
git checkout -b hotfix/issue-${ISSUE_NUMBER}-critical-fix

# Experimental/spike branches
git checkout -b spike/issue-${ISSUE_NUMBER}-investigation
```

**Branch Configuration**

```bash
# Set upstream tracking
git push -u origin feature/issue-${ISSUE_NUMBER}-feature-name

# Configure branch protection locally
git config branch.feature/issue-123.description "Implementing user authentication #123"

# Link branch to issue (for GitHub integration)
gh issue develop ${ISSUE_NUMBER} --checkout
```

### 4. Implementation Planning and Task Breakdown

**Task Decomposition Framework**

```markdown
## Implementation Plan for Issue #${ISSUE_NUMBER}

### Phase 1: Foundation (Day 1)

- [ ] Set up development environment
- [ ] Create failing test cases
- [ ] Implement data models/schemas
# ... (20 lines trimmed for brevity)
- [ ] Performance optimization
- [ ] Documentation updates
```

**Incremental Commit Strategy**

```bash
# After each subtask completion
git add -p  # Partial staging for atomic commits
git commit -m "feat(auth): add user validation schema (#${ISSUE_NUMBER})"
git commit -m "test(auth): add unit tests for validation (#${ISSUE_NUMBER})"
git commit -m "docs(auth): update API documentation (#${ISSUE_NUMBER})"
```

### 5. Test-Driven Development

**Unit Test Implementation**

```javascript
// Jest example for bug fix
describe("Issue #123: User authentication", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
# ... (20 lines trimmed for brevity)
  });
});
```

**Integration Test Pattern**

```python
# Pytest integration test
import pytest
from app import create_app
from database import db

class TestIssue123Integration:
    @pytest.fixture
# ... (26 lines trimmed for brevity)
                            headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 200
```

**End-to-End Testing**

```typescript
// Playwright E2E test
import { test, expect } from "@playwright/test";

test.describe("Issue #123: Authentication Flow", () => {
  test("user can complete full authentication cycle", async ({ page }) => {
    // Navigate to login
    await page.goto("/login");

    // Fill credentials
    await page.fill('[data-testid="email-input"]', "user@example.com");
    await page.fill('[data-testid="password-input"]', "password123");

    // Submit and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('[data-testid="login-button"]'),
    ]);

    // Verify successful login
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
```

### 6. Code Implementation Patterns

**Bug Fix Pattern**

```javascript
// Before (buggy code)
function calculateDiscount(price, discountPercent) {
  return price * discountPercent; // Bug: Missing division by 100
}

// After (fixed code with validation)
function calculateDiscount(price, discountPercent) {
# ... (17 lines trimmed for brevity)
  return Math.round(discount * 100) / 100;
}
```

**Feature Implementation Pattern**

```python
# Implementing new feature with proper architecture
from typing import Optional, List
from dataclasses import dataclass
from datetime import datetime

@dataclass
class FeatureConfig:
# ... (41 lines trimmed for brevity)
            logger.error(f"Error in Issue #123 processing: {str(e)}")
            raise
```

### 7. Pull Request Creation

**PR Preparation Checklist**

```bash
# Run all tests locally
npm test -- --coverage
npm run lint
npm run type-check

# Check for console logs and debug code
git diff --staged | grep -E "console\.(log|debug)"

# Verify no sensitive data
git diff --staged | grep -E "(password|secret|token|key)" -i

# Update documentation
npm run docs:generate
```

**PR Creation with GitHub CLI**

```bash
# Create PR with comprehensive description
gh pr create \
  --title "Fix #${ISSUE_NUMBER}: Clear description of the fix" \
  --body "$(cat <<EOF
## Summary
Fixes #${ISSUE_NUMBER} by implementing proper error handling in the authentication flow.

# ... (30 lines trimmed for brevity)
  --assignee @me \
  --label "bug,needs-review"
```

**Link PR to Issue Automatically**

```yaml
# .github/pull_request_template.md
---
name: Pull Request
about: Create a pull request to merge your changes
---

## Related Issue
# ... (17 lines trimmed for brevity)
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing unit tests pass locally
```

### 8. Post-Implementation Verification

**Deployment Verification**

```bash
# Check deployment status
gh run list --workflow=deploy

# Monitor for errors post-deployment
curl -s https://api.example.com/health | jq .

# Verify fix in production
./scripts/verify_issue_123_fix.sh

# Check error rates
gh api /repos/org/repo/issues/${ISSUE_NUMBER}/comments \
  -f body="Fix deployed to production. Monitoring error rates..."
```

**Issue Closure Protocol**

```bash
# Add resolution comment
gh issue comment ${ISSUE_NUMBER} \
  --body "Fixed in PR #${PR_NUMBER}. The issue was caused by improper token validation. Solution implements proper expiry checking with automatic refresh."

# Close with reference
gh issue close ${ISSUE_NUMBER} \
  --comment "Resolved via #${PR_NUMBER}"
```

## Reference Examples

### Example 1: Critical Production Bug Fix

**Purpose**: Fix authentication failure affecting all users

**Investigation and Implementation**:

```bash
# 1. Immediate triage
gh issue view 456 --comments
# Severity: P0 - All users unable to login

# 2. Create hotfix branch
git checkout -b hotfix/issue-456-auth-failure

# ... (19 lines trimmed for brevity)
  --body "Critical fix for authentication failure" \
  --label "hotfix,priority:critical"
```

### Example 2: Feature Implementation with Sub-tasks

**Purpose**: Implement user profile customization feature

**Complete Implementation**:

```python
# Task breakdown in issue comment
"""
Implementation Plan for #789:
1. Database schema updates
2. API endpoint creation
3. Frontend components
4. Testing and documentation
# ... (38 lines trimmed for brevity)
    assert response.status_code == 200
    assert response.json['theme'] == 'dark'
```

### Example 3: Complex Investigation with Performance Fix

**Purpose**: Resolve slow query performance issue

**Investigation Workflow**:

```sql
-- 1. Identify slow query from issue report
EXPLAIN ANALYZE
SELECT u.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id;

-- Execution Time: 3500ms

-- 2. Create optimized index
CREATE INDEX idx_users_created_orders
ON users(created_at)
INCLUDE (id);

CREATE INDEX idx_orders_user_lookup
ON orders(user_id);

-- 3. Verify improvement
-- Execution Time: 45ms (98% improvement)
```

```javascript
// 4. Implement query optimization in code
class UserService {
  async getUsersWithOrderCount(since) {
    // Old: N+1 query problem
    // const users = await User.findAll({ where: { createdAt: { [Op.gt]: since }}});
    // for (const user of users) {
    //   user.orderCount = await Order.count({ where: { userId: user.id }});
# ... (18 lines trimmed for brevity)
  }
}
```

## Output Format

Upon successful issue resolution, deliver:

1. **Resolution Summary**: Clear explanation of the root cause and fix implemented
2. **Code Changes**: Links to all modified files with explanations
3. **Test Results**: Coverage report and test execution summary
4. **Pull Request**: URL to the created PR with proper issue linking
5. **Verification Steps**: Instructions for QA/reviewers to verify the fix
6. **Documentation Updates**: Any README, API docs, or wiki changes made
7. **Performance Impact**: Before/after metrics if applicable
8. **Rollback Plan**: Steps to revert if issues arise post-deployment

Success Criteria:

- Issue thoroughly investigated with root cause identified
- Fix implemented with comprehensive test coverage
- Pull request created following team standards
- All CI/CD checks passing
- Issue properly closed with reference to PR
- Knowledge captured for future reference
