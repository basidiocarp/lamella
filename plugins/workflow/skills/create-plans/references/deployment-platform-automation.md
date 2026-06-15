# Deployment Platform Automation

Plan Claude to automate deployment platforms such as Vercel, Railway, and
Fly.io.

## What to Include

- project creation or linking commands
- environment or secret setup
- deployment command
- machine-verifiable success check

```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <action>Run `vercel --yes` and capture the deployment URL.</action>
  <verify>`vercel ls` shows the deployment and `curl {url}` returns 200.</verify>
</task>
```
