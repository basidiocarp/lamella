# Pull Request Enhancement

## Context

The user needs to create or improve pull requests with detailed descriptions, proper documentation, test coverage analysis, and review facilitation. Focus on making PRs that are easy to review, well-documented, and include all necessary context.

## Requirements

$ARGUMENTS

## Instructions

### 1. PR Analysis

Analyze the changes and generate insights:

**Change Summary Generator**

```python
import subprocess
import re
from collections import defaultdict

class PRAnalyzer:
    def analyze_changes(self, base_branch='main'):
        """
# ... (63 lines trimmed for brevity)

        return 'other'
```

### 2. PR Description Generation

Create comprehensive PR descriptions:

**Description Template Generator**

```python
def generate_pr_description(analysis, commits):
    """
    Generate detailed PR description from analysis
    """
    description = f"""
## Summary

# ... (84 lines trimmed for brevity)

    return change_list
```

### 3. Review Checklist Generation

Create automated review checklists:

**Smart Checklist Generator**

```python
def generate_review_checklist(analysis):
    """
    Generate context-aware review checklist
    """
    checklist = ["## Review Checklist\n"]

    # General items
# ... (66 lines trimmed for brevity)

    return '\n'.join(checklist)
```

### 4. Code Review Automation

Automate common review tasks:

**Automated Review Bot**

```python
class ReviewBot:
    def perform_automated_checks(self, pr_diff):
        """
        Perform automated code review checks
        """
        findings = []

# ... (51 lines trimmed for brevity)

        return findings
```

### 5. PR Size Optimization

Help split large PRs:

**PR Splitter Suggestions**

````python
def suggest_pr_splits(analysis):
    """
    Suggest how to split large PRs
    """
    stats = analysis['change_statistics']

    # Check if PR is too large
# ... (18 lines trimmed for brevity)
4. Repeat for remaining units

```bash
# Example split workflow
git checkout -b feature/part-1
git cherry-pick <commit-hashes-for-part-1>
git push origin feature/part-1
# Create PR for part 1

git checkout -b feature/part-2
git cherry-pick <commit-hashes-for-part-2>
git push origin feature/part-2
# Create PR for part 2
````

"""

    return ""

def analyze_split_opportunities(analysis):
"""Find logical units for splitting"""
# ... (17 lines trimmed for brevity)
    return suggestions

````

### 6. Visual Diff Enhancement

Generate visual representations:

**Mermaid Diagram Generator**
```python
def generate_architecture_diff(analysis):
    """
    Generate diagram showing architectural changes
    """
    if has_architectural_changes(analysis):
        return f"""
## Architecture Changes

```mermaid
graph LR
    subgraph "Before"
        A1[Component A] --> B1[Component B]
        B1 --> C1[Database]
    end

    subgraph "After"
        A2[Component A] --> B2[Component B]
        B2 --> C2[Database]
        B2 --> D2[New Cache Layer]
        A2 --> E2[New API Gateway]
    end

    style D2 fill:#90EE90
    style E2 fill:#90EE90
````

### Key Changes:

1. Added caching layer for performance
2. Introduced API gateway for better routing
3. Refactored component communication
   """
   return ""

````

### 7. Test Coverage Report

Include test coverage analysis:

**Coverage Report Generator**
```python
def generate_coverage_report(base_branch='main'):
    """
    Generate test coverage comparison
    """
    # Get coverage before and after
    before_coverage = get_coverage_for_branch(base_branch)
    after_coverage = get_coverage_for_branch('HEAD')
# ... (27 lines trimmed for brevity)
    else:
        return "No change"
````

### 8. Risk Assessment

Evaluate PR risk:

**Risk Calculator**

```python
def calculate_pr_risk(analysis):
    """
    Calculate risk score for PR
    """
    risk_factors = {
        'size': calculate_size_risk(analysis),
        'complexity': calculate_complexity_risk(analysis),
# ... (37 lines trimmed for brevity)
    else:
        return "🔴 Critical"
```

### 9. PR Templates

Generate context-specific templates:

```python
def generate_pr_template(pr_type, analysis):
    """
    Generate PR template based on type
    """
    templates = {
        'feature': f"""
## Feature: {extract_feature_name(analysis)}
# ... (74 lines trimmed for brevity)

    return templates.get(pr_type, templates['feature'])
```

### 10. Review Response Templates

Help with review responses:

```python
review_response_templates = {
    'acknowledge_feedback': """
Thank you for the thorough review! I'll address these points.
""",

    'explain_decision': """
Great question! I chose this approach because:
# ... (26 lines trimmed for brevity)
"""
}
```

## Output Format

1. **PR Summary**: Executive summary with key metrics
2. **Detailed Description**: Comprehensive PR description
3. **Review Checklist**: Context-aware review items
4. **Risk Assessment**: Risk analysis with mitigation strategies
5. **Test Coverage**: Before/after coverage comparison
6. **Visual Aids**: Diagrams and visual diffs where applicable
7. **Size Recommendations**: Suggestions for splitting large PRs
8. **Review Automation**: Automated checks and findings

Focus on creating PRs that are a pleasure to review, with all necessary context and documentation for efficient code review process.
