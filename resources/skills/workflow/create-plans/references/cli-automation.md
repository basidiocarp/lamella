# CLI and API Automation Reference

**Core principle:** If it has a CLI or API, Claude does it. Never ask the human to perform manual steps that Claude can automate.

This reference documents what Claude CAN and SHOULD automate during plan execution.

## Deployment Platforms

### Vercel
**CLI:** `vercel`

**What Claude automates:**
- Create and deploy projects: `vercel --yes`
- Set environment variables: `vercel env add KEY production`
- Link to git repo: `vercel link`
- Trigger deployments: `vercel --prod`
- Get deployment URLs: `vercel ls`
- Manage domains: `vercel domains add example.com`

**Never ask human to:**
- Visit vercel.com/new to create project
- Click through dashboard to add env vars
- Manually link repository

**Checkpoint pattern:**
```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <action>Run `vercel --yes` to deploy. Capture deployment URL.</action>
  <verify>vercel ls shows deployment, curl {url} returns 200</verify>
// ... (5 lines trimmed)
  <resume-signal>Type "yes" if correct</resume-signal>
</task>
```

### Railway
**CLI:** `railway`

**What Claude automates:**
- Initialize project: `railway init`
- Link to repo: `railway link`
- Deploy: `railway up`
- Set variables: `railway variables set KEY=value`
- Get deployment URL: `railway domain`

### Fly.io
**CLI:** `fly`

**What Claude automates:**
- Launch app: `fly launch --no-deploy`
- Deploy: `fly deploy`
- Set secrets: `fly secrets set KEY=value`
- Scale: `fly scale count 2`

## Payment & Billing

### Stripe
**CLI:** `stripe`

**What Claude automates:**
- Create webhook endpoints: `stripe listen --forward-to localhost:3000/api/webhooks`
- Trigger test events: `stripe trigger payment_intent.succeeded`
- Create products/prices: Stripe API via curl/fetch
- Manage customers: Stripe API via curl/fetch
- Check webhook logs: `stripe webhooks list`

**Never ask human to:**
- Visit dashboard.stripe.com to create webhook
- Click through UI to create products
- Manually copy webhook signing secret

**Checkpoint pattern:**
```xml
<task type="auto">
  <name>Configure Stripe webhooks</name>
  <action>Use Stripe API to create webhook endpoint at /api/webhooks. Save signing secret to .env.</action>
  <verify>stripe webhooks list shows endpoint, .env contains STRIPE_WEBHOOK_SECRET</verify>
// ... (5 lines trimmed)
  <resume-signal>Type "yes" if correct</resume-signal>
</task>
```

## Databases & Backend

### Supabase
**CLI:** `supabase`

**What Claude automates:**
- Initialize project: `supabase init`
- Link to remote: `supabase link --project-ref {ref}`
- Create migrations: `supabase migration new {name}`
- Push migrations: `supabase db push`
- Generate types: `supabase gen types typescript`
- Deploy functions: `supabase functions deploy {name}`

**Never ask human to:**
- Visit supabase.com to create project manually
- Click through dashboard to run migrations
- Copy/paste connection strings

**Note:** Project creation may require web dashboard initially (no CLI for initial project creation), but all subsequent work (migrations, functions, etc.) is CLI-automated.

### Upstash (Redis/Kafka)
**CLI:** `upstash`

**What Claude automates:**
- Create Redis database: `upstash redis create {name} --region {region}`
- Get connection details: `upstash redis get {id}`
- Create Kafka cluster: `upstash kafka create {name} --region {region}`

**Never ask human to:**
- Visit console.upstash.com
- Click through UI to create database
- Copy/paste connection URLs manually

**Checkpoint pattern:**
```xml
<task type="auto">
  <name>Create Upstash Redis database</name>
  <action>Run `upstash redis create myapp-cache --region us-east-1`. Save URL to .env.</action>
  <verify>.env contains UPSTASH_REDIS_URL, upstash redis list shows database</verify>
</task>
```

### PlanetScale
**CLI:** `pscale`

**What Claude automates:**
- Create database: `pscale database create {name} --region {region}`
- Create branch: `pscale branch create {db} {branch}`
- Deploy request: `pscale deploy-request create {db} {branch}`
- Connection string: `pscale connect {db} {branch}`

## Version Control & CI/CD

### GitHub
**CLI:** `gh`

**What Claude automates:**
- Create repo: `gh repo create {name} --public/--private`
- Create issues: `gh issue create --title "{title}" --body "{body}"`
- Create PR: `gh pr create --title "{title}" --body "{body}"`
- Manage secrets: `gh secret set {KEY}`
- Trigger workflows: `gh workflow run {name}`
- Check status: `gh run list`

**Never ask human to:**
- Visit github.com to create repo
- Click through UI to add secrets
- Manually create issues/PRs

## Build Tools & Testing

### Node/npm/pnpm/bun
**What Claude automates:**
- Install dependencies: `npm install`, `pnpm install`, `bun install`
- Run builds: `npm run build`
- Run tests: `npm test`, `npm run test:e2e`
- Type checking: `tsc --noEmit`

**Never ask human to:** Run these commands manually

### Xcode (macOS/iOS)
**CLI:** `xcodebuild`

**What Claude automates:**
- Build project: `xcodebuild -project App.xcodeproj -scheme App build`
- Run tests: `xcodebuild test -project App.xcodeproj -scheme App`
- Archive: `xcodebuild archive -project App.xcodeproj -scheme App`
- Check compilation: Parse xcodebuild output for errors

**Never ask human to:**
- Open Xcode and click Product > Build
- Click Product > Test manually
- Check for errors by looking at Xcode UI

**Checkpoint pattern:**
```xml
<task type="auto">
  <name>Build macOS app</name>
  <action>Run `xcodebuild -project App.xcodeproj -scheme App build`. Check output for errors.</action>
  <verify>Build succeeds with "BUILD SUCCEEDED" in output</verify>
// ... (5 lines trimmed)
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

## Environment Configuration

### .env Files
**Tool:** Write tool

**What Claude automates:**
- Create .env files: Use Write tool
- Append variables: Use Edit tool
- Read current values: Use Read tool

**Never ask human to:**
- Manually create .env file
- Copy/paste values into .env
- Edit .env in text editor

**Pattern:**
```xml
<task type="auto">
  <name>Configure environment variables</name>
  <action>Write .env file with: DATABASE_URL, STRIPE_KEY, JWT_SECRET (generated).</action>
  <verify>Read .env confirms all variables present</verify>
</task>
```

## Email & Communication

### Resend
**API:** Resend API via HTTP

**What Claude automates:**
- Create API keys via dashboard API (if available) or instructions for one-time setup
- Send emails: Resend API
- Configure domains: Resend API

### SendGrid
**API:** SendGrid API via HTTP

**What Claude automates:**
- Create API keys via API
- Send emails: SendGrid API
- Configure webhooks: SendGrid API

**Note:** Initial account setup may require email verification (checkpoint:human-action), but all subsequent work is API-automated.

## Authentication Gates

**Critical distinction:** When Claude tries to use a CLI/API and gets an authentication error, this is NOT a failure - it's a gate that requires human input to unblock automation.

**Pattern: Claude encounters auth error → creates checkpoint → you authenticate → Claude continues**

### Example: Vercel CLI Not Authenticated

```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <files>.vercel/, vercel.json</files>
  <action>Run `vercel --yes` to deploy</action>
  <verify>vercel ls shows deployment</verify>
// ... (19 lines trimmed)
  <action>Run `vercel --yes` (now authenticated)</action>
  <verify>vercel ls shows deployment, curl returns 200</verify>
</task>
```

### Example: Stripe CLI Needs API Key

```xml
<task type="auto">
  <name>Create Stripe webhook endpoint</name>
  <action>Use Stripe API to create webhook at /api/webhooks</action>
</task>

// ... (22 lines trimmed)
  </action>
  <verify>.env contains both keys, webhook endpoint exists</verify>
</task>
```

### Example: GitHub CLI Not Logged In

```xml
<task type="auto">
  <name>Create GitHub repository</name>
  <action>Run `gh repo create myapp --public`</action>
</task>

// ... (15 lines trimmed)
  <action>Run `gh repo create myapp --public`</action>
  <verify>gh repo view shows repository exists</verify>
</task>
```

### Example: Upstash CLI Needs API Key

```xml
<task type="auto">
  <name>Create Upstash Redis database</name>
  <action>Run `upstash redis create myapp-cache --region us-east-1`</action>
</task>

// ... (21 lines trimmed)
  </action>
  <verify>upstash redis list shows database, .env contains URL</verify>
</task>
```

### Authentication Gate Protocol

**When Claude encounters authentication error during execution:**

1. **Recognize it's not a failure** - Missing auth is expected, not a bug
2. **Stop current task** - Don't retry repeatedly
3. **Create checkpoint:human-action on the fly** - Dynamic checkpoint, not pre-planned
4. **Provide exact authentication steps** - CLI commands, where to get keys
5. **Verify authentication** - Test that auth works before continuing
6. **Retry the original task** - Resume automation where it left off
7. **Continue normally** - One auth gate doesn't break the flow

**Key difference from pre-planned checkpoints:**
- Pre-planned: "I need you to do X" (wrong - Claude should automate)
- Auth gate: "I tried to automate X but need credentials to continue" (correct - unblocks automation)

**This preserves agentic flow:**
- Claude tries automation first
- Only asks for help when blocked by credentials
- Continues automating after unblocked
- You never manually deploy/create resources - just provide keys

## When checkpoint:human-action is REQUIRED

**Truly rare cases where no CLI/API exists:**

1. **Email verification links** - Account signup requires clicking verification email
2. **SMS verification codes** - 2FA requiring phone
3. **Manual account approvals** - Platform requires human review before API access
4. **Domain DNS records at registrar** - Some registrars have no API
5. **Credit card input** - Payment methods requiring 3D Secure web flow
6. **OAuth app approval** - Some platforms require web-based app approval flow

**For these rare cases:**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>Complete email verification for SendGrid account</action>
  <instructions>
    I created the account and requested verification email.
    Check your inbox for verification link and click it.
  </instructions>
  <verification>SendGrid API key works: curl test succeeds</verification>
  <resume-signal>Type "done" when verified</resume-signal>
</task>
```

**Key difference:** Claude does EVERYTHING possible first (account creation, API requests), only asks human for the one thing with no automation path.

## Quick Reference: "Can Claude automate this?"

| Action | CLI/API? | Claude does it? |
|--------|----------|-----------------|
| Deploy to Vercel | ✅ `vercel` | YES |
| Create Stripe webhook | ✅ Stripe API | YES |
| Run xcodebuild | ✅ `xcodebuild` | YES |
| Write .env file | ✅ Write tool | YES |
| Create Upstash DB | ✅ `upstash` CLI | YES |
| Install npm packages | ✅ `npm` | YES |
| Create GitHub repo | ✅ `gh` | YES |
| Run tests | ✅ `npm test` | YES |
| Create Supabase project | ⚠️ Web dashboard | NO (then CLI for everything else) |
| Click email verification link | ❌ No API | NO |
| Enter credit card with 3DS | ❌ No API | NO |

**Default answer: YES.** Unless explicitly in the "NO" category, Claude automates it.

## Decision Tree

```
┌─────────────────────────────────────┐
│ Task requires external resource?    │
└──────────────┬──────────────────────┘
               │
               ▼
// ... (23 lines trimmed)
    │ checkpoint:human-verify                │
    │ Human confirms visual/functional       │
    └────────────────────────────────────────┘
```

## Summary

**The rule:** If Claude CAN do it, Claude MUST do it.

Checkpoints are for:
- **Verification** - Confirming Claude's automated work looks/behaves correctly
- **Decisions** - Choosing between valid approaches
- **True blockers** - Rare actions with literally no API/CLI (email links, 2FA)

Checkpoints are NOT for:
- Deploying (use CLI)
- Creating resources (use CLI/API)
- Running builds (use Bash)
- Writing files (use Write tool)
- Anything with automation available

**This keeps the agentic coding workflow intact - Claude does the work, you verify results.**
