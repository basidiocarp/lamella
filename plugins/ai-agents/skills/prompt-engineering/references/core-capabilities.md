# Core Capabilities - Detailed Examples

## 1. Few-Shot Learning

Teach the model by showing examples instead of only stating rules.

```markdown
Extract key information from support tickets:

Input: "My login doesn't work and I keep getting error 403"
Output: {"issue": "authentication", "error_code": "403", "priority": "high"}

Input: "Feature request: add dark mode to settings"
Output: {"issue": "feature_request", "error_code": null, "priority": "low"}

Now process: "Can't upload files larger than 10MB, getting timeout"
```

## 2. Chain-of-Thought Prompting

Request structured reasoning before the final answer.

```markdown
Analyze this bug report and determine root cause.

Think step by step:
1. What is the expected behavior?
2. What is the actual behavior?
3. What changed recently that could cause this?
4. What components are involved?
5. What is the most likely root cause?
```

## 3. Prompt Optimization

Improve prompts through measured revisions.

```markdown
Version 1: "Summarize this article"
Version 2: "Summarize in 3 bullet points"
Version 3: "Identify the 3 main findings, then summarize each"
```

## 4. Template Systems

Build reusable prompt structures with variables.

```python
template = """
Review this {language} code for {focus_area}.

Code:
{code_block}

Checklist:
{checklist}
"""

prompt = template.format(
    language="Python",
    focus_area="security issues",
    code_block=user_code,
    checklist="1. SQL injection\n2. XSS risks\n3. Authentication"
)
```

## 5. System Prompt Design

Set persistent behavior and output expectations.

```markdown
System: You are a senior backend engineer specializing in API design.

Rules:
- Always consider scalability and performance
- Flag security concerns immediately
- Provide code examples in Python

Format responses as:
1. Analysis
2. Recommendation
3. Code example
4. Trade-offs
```
