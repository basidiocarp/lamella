<overview>
Use this reference when the plan starts from a PRD, feature brief, or large
initiative that needs to become executable work.
</overview>

<core_rule>
Prefer tracer-bullet vertical slices over horizontal layer plans.

Each slice should cut through every required layer and end in a user-visible or
testable behavior.
</core_rule>

<slice_properties>
A good vertical slice is:

- Narrow enough to finish and verify on its own
- End-to-end across schema, API, UI, automation, or integration layers as needed
- Safe to demonstrate after completion
- Small enough to keep the plan at 2-3 tasks
</slice_properties>

<durable_decisions>
Before slicing, capture the decisions that should stay stable across the whole
plan:

- Route and command names
- Core data model shapes
- Auth and permission boundaries
- Third-party service boundaries
- Major workflow states

Put these decisions near the top of the plan so later tasks can stay short.
</durable_decisions>

<slice_patterns>
**Good feature slices**

- "User can create a draft invoice and see it in the list"
- "Admin can invite a teammate and the invite email is queued"
- "Operator can trigger the sync job and inspect the first status page"

**Bad feature slices**

- "Design database schema"
- "Build backend endpoints"
- "Build frontend screens"

Those are layers, not shippable slices.
</slice_patterns>

<checkpoint_mapping>
Map slice type to Lamella task types:

- Fully automatable slice -> `type="auto"`
- Slice ends with a user-visible UI review -> `checkpoint:human-verify`
- Slice depends on a genuine product or architecture choice -> `checkpoint:decision`

Do not mark work as interactive just because it spans multiple layers.
</checkpoint_mapping>

<handoff_rule>
If the user wants issues or backlog items later, first get the slice boundaries
right in the plan. Ticket systems are a packaging layer, not the source of
truth.
</handoff_rule>
