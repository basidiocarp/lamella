<overview>
Prompt patterns for execution tasks that produce artifacts (code, documents, designs, etc.).
</overview>

<prompt_template>
```xml
<objective>
{Clear statement of what to build/create/fix}

Purpose: {Why this matters, what it enables}
Output: {What artifact(s) will be produced}
// ... (48 lines trimmed)
- {Criterion 2}
- SUMMARY.md created with files list and next step
</success_criteria>
```
</prompt_template>

<key_principles>

<reference_chain_artifacts>
If research or plan exists, always reference them:
```xml
<context>
Research findings: @.prompts/001-auth-research/auth-research.md
Implementation plan: @.prompts/002-auth-plan/auth-plan.md
</context>
```
</reference_chain_artifacts>

<explicit_output_location>
Every artifact needs a clear path:
```xml
<output>
Create files in ./src/auth/:
- `./src/auth/middleware.ts` - JWT validation middleware
- `./src/auth/types.ts` - Auth type definitions
- `./src/auth/utils.ts` - Helper functions
</output>
```
</explicit_output_location>

<verification_matching>
Include verification that matches the task:
- Code: run tests, type check, lint
- Documents: check structure, validate links
- Designs: review against requirements
</verification_matching>

</key_principles>

<complexity_variations>

<simple_do>
Single artifact example:
```xml
<objective>
Create a utility function that validates email addresses.
</objective>

<requirements>
// ... (9 lines trimmed)
<verification>
Test with: valid emails, invalid formats, edge cases
</verification>
```
</simple_do>

<complex_do>
Multiple artifacts with dependencies:
```xml
<objective>
Implement user authentication system with JWT tokens.

Purpose: Enable secure user sessions for the application
Output: Auth middleware, routes, types, and tests
// ... (48 lines trimmed)
- Tokens properly secured
- Follows patterns from research
</success_criteria>
```
</complex_do>

</complexity_variations>

<non_code_examples>

<document_creation>
```xml
<objective>
Create API documentation for the authentication endpoints.

Purpose: Enable frontend team to integrate auth
Output: OpenAPI spec + markdown guide
// ... (21 lines trimmed)
- Check all endpoints documented
- Verify examples match actual implementation
</verification>
```
</document_creation>

<design_architecture>
```xml
<objective>
Design database schema for multi-tenant SaaS application.

Purpose: Support customer isolation and scaling
Output: Schema diagram + migration files
// ... (21 lines trimmed)
- RLS policies correctly isolate data
- Performance acceptable with 1000 tenants
</verification>
```
</design_architecture>

</non_code_examples>
