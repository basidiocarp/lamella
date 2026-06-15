# Human Checkpoints in Plans

Plans should run autonomously unless a human must verify output, make a
decision, or unblock an authentication gate.

## Checkpoint Types

## `checkpoint:human-verify`

Use when Claude already finished the automatable work and the user needs to
confirm real-world behavior.

- visual QA
- click-through flows
- device-specific behavior
- subjective quality checks such as animation or audio playback

```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Responsive dashboard deployed to preview</what-built>
  <how-to-verify>
    1. Visit the preview URL.
    2. Check mobile and desktop layout.
    3. Confirm filters and navigation work.
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues.</resume-signal>
</task>
```

## `checkpoint:decision`

Use when the next implementation step depends on a user choice.

```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>Select authentication provider</decision>
  <context>Provider choice affects schema, SDK, and deployment setup.</context>
  <options>
    <option id="clerk">Fast setup, hosted UI, vendor lock-in.</option>
    <option id="nextauth">Flexible, more wiring, keeps auth local.</option>
  </options>
  <resume-signal>Reply with "clerk" or "nextauth".</resume-signal>
</task>
```

## `checkpoint:human-action`

Use only when Claude hit a real human-only gate after automating everything it
could, usually email verification or interactive auth.

```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>Complete the email verification step sent by the provider.</action>
  <instructions>
    Claude already created the account and requested verification.
  </instructions>
  <verification>CLI command succeeds after verification.</verification>
  <resume-signal>Type "done" when the gate is cleared.</resume-signal>
</task>
```

## Execution Rules

- stop immediately when a checkpoint task is reached
- show the checkpoint clearly and wait for a real response
- verify the resume condition if the plan specifies a check
- never ask the human to do work Claude could do with CLI or API access
