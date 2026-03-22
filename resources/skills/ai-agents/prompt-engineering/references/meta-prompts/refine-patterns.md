<overview>
Prompt patterns for improving existing research or plan outputs based on feedback.
</overview>

<prompt_template>
```xml
<objective>
Refine {topic}-{original_purpose} based on feedback.

Target: @.prompts/{num}-{topic}-{original_purpose}/{topic}-{original_purpose}.md
Current summary: @.prompts/{num}-{topic}-{original_purpose}/SUMMARY.md
// ... (49 lines trimmed)
- SUMMARY.md reflects version and changes
- Quality demonstrably improved
</success_criteria>
```
</prompt_template>

<key_principles>

<preserve_context>
Refine builds on existing work, not replaces it:
```xml
<context>
Original output: @.prompts/001-auth-research/auth-research.md

Key strengths to preserve:
- Library comparison structure
- Security recommendations
- Code examples format
</context>
```
</preserve_context>

<specific_feedback>
Feedback must be actionable:
```xml
<feedback>
Issues to address:
- Security analysis was surface-level - need CVE references and vulnerability patterns
- Performance benchmarks missing - add actual timing data
- Rate limiting patterns not covered

Do NOT change:
- Library comparison structure
- Recommendation format
</feedback>
```
</specific_feedback>

<version_tracking>
Archive before overwriting:
```xml
<output>
1. Archive: `.prompts/001-auth-research/archive/auth-research-v1.md`
2. Write improved: `.prompts/001-auth-research/auth-research.md`
3. Update SUMMARY.md with version info
</output>
```
</version_tracking>

</key_principles>

<refine_types>

<deepen_research>
When research was too surface-level:

```xml
<objective>
Refine auth-research based on feedback.

Target: @.prompts/001-auth-research/auth-research.md
</objective>
// ... (16 lines trimmed)
- Add rate limiting patterns section
- Increase confidence if gaps are filled
</requirements>
```
</deepen_research>

<expand_scope>
When research missed important areas:

```xml
<objective>
Refine stripe-research to include webhooks.

Target: @.prompts/005-stripe-research/stripe-research.md
</objective>
// ... (16 lines trimmed)
- Cover retry and idempotency patterns
- Update summary to reflect expanded scope
</requirements>
```
</expand_scope>

<update_plan>
When plan needs adjustment:

```xml
<objective>
Refine auth-plan to add rate limiting phase.

Target: @.prompts/002-auth-plan/auth-plan.md
</objective>
// ... (15 lines trimmed)
- Update phase count in summary
- Ensure new phase is prompt-sized
</requirements>
```
</update_plan>

<correct_errors>
When output has factual errors:

```xml
<objective>
Refine jwt-research to correct library recommendation.

Target: @.prompts/003-jwt-research/jwt-research.md
</objective>
// ... (16 lines trimmed)
- Add note about jsonwebtoken deprecation concerns
- Lower confidence if other findings may need verification
</requirements>
```
</correct_errors>

</refine_types>

<folder_structure>
Refine prompts get their own folder (new number), but output goes to the original folder:

```
.prompts/
├── 001-auth-research/
│   ├── completed/
│   │   └── 001-auth-research.md       # Original prompt
│   ├── archive/
│   │   └── auth-research-v1.md        # Archived v1
│   ├── auth-research.md               # Current (v2)
│   └── SUMMARY.md                     # Reflects v2
├── 004-auth-research-refine/
│   ├── completed/
│   │   └── 004-auth-research-refine.md  # Refine prompt
│   └── (no output here - goes to 001)
```

This maintains:
- Clear prompt history (each prompt is numbered)
- Single source of truth for each output
- Visible iteration count in SUMMARY.md
</folder_structure>

<execution_notes>

<dependency_handling>
Refine prompts depend on the target output existing:
- Check target file exists before execution
- If target folder missing, offer to create the original prompt first

```xml
<dependency_check>
If `.prompts/{num}-{topic}-{original_purpose}/{topic}-{original_purpose}.md` not found:
- Error: "Cannot refine - target output doesn't exist"
- Offer: "Create the original {purpose} prompt first?"
</dependency_check>
```
</dependency_handling>

<archive_creation>
Before overwriting, ensure archive exists:
```bash
mkdir -p .prompts/{num}-{topic}-{original_purpose}/archive/
mv .prompts/{num}-{topic}-{original_purpose}/{topic}-{original_purpose}.md \
   .prompts/{num}-{topic}-{original_purpose}/archive/{topic}-{original_purpose}-v{n}.md
```
</archive_creation>

<summary_update>
SUMMARY.md must reflect the refinement:
- Update version number
- Add "Changes from Previous" section
- Update one-liner if findings changed
- Update confidence if improved
</summary_update>

</execution_notes>
