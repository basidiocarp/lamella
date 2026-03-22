# Human Checkpoints in Plans

Plans execute autonomously. Checkpoints formalize the interaction points where human verification or decisions are needed.

**Core principle:** Claude automates everything with CLI/API. Checkpoints are for verification and decisions, not manual work.

## Checkpoint Types

### 1. `checkpoint:human-verify` (Most Common)

**When:** Claude completed automated work, human confirms it works correctly.

**Use for:**
- Visual UI checks (layout, styling, responsiveness)
- Interactive flows (click through wizard, test user flows)
- Functional verification (feature works as expected)
- Audio/video playback quality
- Animation smoothness
- Accessibility testing

**Structure:**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[What Claude automated and deployed/built]</what-built>
  <how-to-verify>
    [Exact steps to test - URLs, commands, expected behavior]
  </how-to-verify>
  <resume-signal>[How to continue - "approved", "yes", or describe issues]</resume-signal>
</task>
```

**Key elements:**
- `<what-built>`: What Claude automated (deployed, built, configured)
- `<how-to-verify>`: Exact steps to confirm it works (numbered, specific)
- `<resume-signal>`: Clear indication of how to continue

**Example: Vercel Deployment**
```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <files>.vercel/, vercel.json</files>
  <action>Run `vercel --yes` to create project and deploy. Capture deployment URL from output.</action>
  <verify>vercel ls shows deployment, curl {url} returns 200</verify>
// ... (10 lines trimmed)
  </how-to-verify>
  <resume-signal>Type "approved" to continue, or describe issues to fix</resume-signal>
</task>
```

**Example: UI Component**
```xml
<task type="auto">
  <name>Build responsive dashboard layout</name>
  <files>src/components/Dashboard.tsx, src/app/dashboard/page.tsx</files>
  <action>Create dashboard with sidebar, header, and content area. Use Tailwind responsive classes for mobile.</action>
  <verify>npm run build succeeds, no TypeScript errors</verify>
// ... (12 lines trimmed)
  </how-to-verify>
  <resume-signal>Type "approved" or describe layout issues</resume-signal>
</task>
```

**Example: Xcode Build**
```xml
<task type="auto">
  <name>Build macOS app with Xcode</name>
  <files>App.xcodeproj, Sources/</files>
  <action>Run `xcodebuild -project App.xcodeproj -scheme App build`. Check for compilation errors in output.</action>
  <verify>Build output contains "BUILD SUCCEEDED", no errors</verify>
// ... (11 lines trimmed)
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

### 2. `checkpoint:decision`

**When:** Human must make choice that affects implementation direction.

**Use for:**
- Technology selection (which auth provider, which database)
- Architecture decisions (monorepo vs separate repos)
- Design choices (color scheme, layout approach)
- Feature prioritization (which variant to build)
- Data model decisions (schema structure)

**Structure:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>[What's being decided]</decision>
  <context>[Why this decision matters]</context>
  <options>
    <option id="option-a">
// ... (9 lines trimmed)
  </options>
  <resume-signal>[How to indicate choice]</resume-signal>
</task>
```

**Key elements:**
- `<decision>`: What's being decided
- `<context>`: Why this matters
- `<options>`: Each option with balanced pros/cons (not prescriptive)
- `<resume-signal>`: How to indicate choice

**Example: Auth Provider Selection**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>Select authentication provider</decision>
  <context>
    Need user authentication for the app. Three solid options with different tradeoffs.
  </context>
// ... (16 lines trimmed)
  </options>
  <resume-signal>Select: supabase, clerk, or nextauth</resume-signal>
</task>
```

### 3. `checkpoint:human-action` (Rare)

**When:** Action has NO CLI/API and requires human-only interaction, OR Claude hit an authentication gate during automation.

**Use ONLY for:**
- **Authentication gates** - Claude tried to use CLI/API but needs credentials to continue (this is NOT a failure)
- Email verification links (account creation requires clicking email)
- SMS 2FA codes (phone verification)
- Manual account approvals (platform requires human review before API access)
- Credit card 3D Secure flows (web-based payment authorization)
- OAuth app approvals (some platforms require web-based approval)

**Do NOT use for pre-planned manual work:**
- Manually deploying to Vercel (use `vercel` CLI - auth gate if needed)
- Manually creating Stripe webhooks (use Stripe API - auth gate if needed)
- Manually creating databases (use provider CLI - auth gate if needed)
- Running builds/tests manually (use Bash tool)
- Creating files manually (use Write tool)

**Structure:**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>[What human must do - Claude already did everything automatable]</action>
  <instructions>
    [What Claude already automated]
    [The ONE thing requiring human action]
  </instructions>
  <verification>[What Claude can check afterward]</verification>
  <resume-signal>[How to continue]</resume-signal>
</task>
```

**Key principle:** Claude automates EVERYTHING possible first, only asks human for the truly unavoidable manual step.

**Example: Email Verification**
```xml
<task type="auto">
  <name>Create SendGrid account via API</name>
  <action>Use SendGrid API to create subuser account with provided email. Request verification email.</action>
  <verify>API returns 201, account created</verify>
  <done>Account created, verification email sent</done>
// ... (8 lines trimmed)
  <verification>SendGrid API key works: curl test succeeds</verification>
  <resume-signal>Type "done" when email verified</resume-signal>
</task>
```

**Example: Credit Card 3D Secure**
```xml
<task type="auto">
  <name>Create Stripe payment intent</name>
  <action>Use Stripe API to create payment intent for $99. Generate checkout URL.</action>
  <verify>Stripe API returns payment intent ID and URL</verify>
  <done>Payment intent created</done>
// ... (8 lines trimmed)
  <verification>Stripe webhook receives payment_intent.succeeded event</verification>
  <resume-signal>Type "done" when payment completes</resume-signal>
</task>
```

**Example: Authentication Gate (Dynamic Checkpoint)**
```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <files>.vercel/, vercel.json</files>
  <action>Run `vercel --yes` to deploy</action>
  <verify>vercel ls shows deployment, curl returns 200</verify>
// ... (19 lines trimmed)
  <action>Run `vercel --yes` (now authenticated)</action>
  <verify>vercel ls shows deployment, curl returns 200</verify>
</task>
```

**Key distinction:** Authentication gates are created dynamically when Claude encounters auth errors during automation. They're NOT pre-planned - Claude tries to automate first, only asks for credentials when blocked.

See references/cli-automation.md "Authentication Gates" section for more examples and full protocol.

## Execution Protocol

When Claude encounters `type="checkpoint:*"`:

1. **Stop immediately** - do not proceed to next task
2. **Display checkpoint clearly:**

```
════════════════════════════════════════
CHECKPOINT: [Type]
════════════════════════════════════════

Task [X] of [Y]: [Name]

[Display checkpoint-specific content]

[Resume signal instruction]
════════════════════════════════════════
```

3. **Wait for user response** - do not hallucinate completion
4. **Verify if possible** - check files, run tests, whatever is specified
5. **Resume execution** - continue to next task only after confirmation

**For checkpoint:human-verify:**
```
════════════════════════════════════════
CHECKPOINT: Verification Required
════════════════════════════════════════

Task 5 of 8: Responsive dashboard layout
// ... (8 lines trimmed)

Type "approved" to continue, or describe issues.
════════════════════════════════════════
```

**For checkpoint:decision:**
```
════════════════════════════════════════
CHECKPOINT: Decision Required
════════════════════════════════════════

Task 2 of 6: Select authentication provider
// ... (9 lines trimmed)

Select: supabase, clerk, or nextauth
════════════════════════════════════════
```

## Writing Good Checkpoints

**DO:**
- Automate everything with CLI/API before checkpoint
- Be specific: "Visit https://myapp.vercel.app" not "check deployment"
- Number verification steps: easier to follow
- State expected outcomes: "You should see X"
- Provide context: why this checkpoint exists
- Make verification executable: clear, testable steps

**DON'T:**
- Ask human to do work Claude can automate (deploy, create resources, run builds)
- Assume knowledge: "Configure the usual settings" ❌
- Skip steps: "Set up database" ❌ (too vague)
- Mix multiple verifications in one checkpoint (split them)
- Make verification impossible (Claude can't check visual appearance without user confirmation)

## When to Use Checkpoints

**Use checkpoint:human-verify for:**
- Visual verification (UI, layouts, animations)
- Interactive testing (click flows, user journeys)
- Quality checks (audio/video playback, animation smoothness)
- Confirming deployed apps are accessible

**Use checkpoint:decision for:**
- Technology selection (auth providers, databases, frameworks)
- Architecture choices (monorepo, deployment strategy)
- Design decisions (color schemes, layout approaches)
- Feature prioritization

**Use checkpoint:human-action for:**
- Email verification links (no API)
- SMS 2FA codes (no API)
- Manual approvals with no automation
- 3D Secure payment flows

**Don't use checkpoints for:**
- Things Claude can verify programmatically (tests pass, build succeeds)
- File operations (Claude can read files to verify)
- Code correctness (use tests and static analysis)
- Anything automatable via CLI/API

## Checkpoint Placement

Place checkpoints:
- **After automation completes** - not before Claude does the work
- **After UI buildout** - before declaring phase complete
- **Before dependent work** - decisions before implementation
- **At integration points** - after configuring external services

Bad placement:
- Before Claude automates (asking human to do automatable work) ❌
- Too frequent (every other task is a checkpoint) ❌
- Too late (checkpoint is last task, but earlier tasks needed its result) ❌

## Complete Examples

### Example 1: Deployment Flow (Correct)

```xml
<!-- Claude automates everything -->
<task type="auto">
  <name>Deploy to Vercel</name>
  <files>.vercel/, vercel.json, package.json</files>
  <action>
// ... (22 lines trimmed)
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>
```

### Example 2: Database Setup (Correct)

```xml
<!-- Claude automates everything -->
<task type="auto">
  <name>Create Upstash Redis database</name>
  <files>.env</files>
  <action>
// ... (11 lines trimmed)
</task>

<!-- NO CHECKPOINT NEEDED - Claude automated everything and verified programmatically -->
```

### Example 3: Stripe Webhooks (Correct)

```xml
<!-- Claude automates everything -->
<task type="auto">
  <name>Configure Stripe webhooks</name>
  <files>.env, src/app/api/webhooks/route.ts</files>
  <action>
// ... (19 lines trimmed)
  </how-to-verify>
  <resume-signal>Type "yes" if correct</resume-signal>
</task>
```

## Anti-Patterns

### ❌ BAD: Asking human to automate

```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>Deploy to Vercel</action>
  <instructions>
    1. Visit vercel.com/new
// ... (5 lines trimmed)
  <resume-signal>Paste URL</resume-signal>
</task>
```

**Why bad:** Vercel has a CLI. Claude should run `vercel --yes`.

### ✅ GOOD: Claude automates, human verifies

```xml
<task type="auto">
  <name>Deploy to Vercel</name>
  <action>Run `vercel --yes`. Capture URL.</action>
  <verify>vercel ls shows deployment, curl returns 200</verify>
// ... (5 lines trimmed)
  <resume-signal>Type "approved"</resume-signal>
</task>
```

### ❌ BAD: Too many checkpoints

```xml
<task type="auto">Create schema</task>
<task type="checkpoint:human-verify">Check schema</task>
<task type="auto">Create API route</task>
<task type="checkpoint:human-verify">Check API</task>
<task type="auto">Create UI form</task>
<task type="checkpoint:human-verify">Check form</task>
```

**Why bad:** Verification fatigue. Combine into one checkpoint at end.

### ✅ GOOD: Single verification checkpoint

```xml
<task type="auto">Create schema</task>
<task type="auto">Create API route</task>
<task type="auto">Create UI form</task>

<task type="checkpoint:human-verify">
  <what-built>Complete auth flow (schema + API + UI)</what-built>
  <how-to-verify>Test full flow: register, login, access protected page</how-to-verify>
  <resume-signal>Type "approved"</resume-signal>
</task>
```

### ❌ BAD: Asking for automatable file operations

```xml
<task type="checkpoint:human-action">
  <action>Create .env file</action>
  <instructions>
    1. Create .env in project root
    2. Add: DATABASE_URL=...
    3. Add: STRIPE_KEY=...
  </instructions>
</task>
```

**Why bad:** Claude has Write tool. This should be `type="auto"`.

## Summary

Checkpoints formalize human-in-the-loop points. Use them when Claude cannot complete a task autonomously OR when human verification is required for correctness.

**The golden rule:** If Claude CAN automate it, Claude MUST automate it.

**Checkpoint priority:**
1. **checkpoint:human-verify** (90% of checkpoints) - Claude automated everything, human confirms visual/functional correctness
2. **checkpoint:decision** (9% of checkpoints) - Human makes architectural/technology choices
3. **checkpoint:human-action** (1% of checkpoints) - Truly unavoidable manual steps with no API/CLI

**See also:** references/cli-automation.md for exhaustive list of what Claude can automate.
