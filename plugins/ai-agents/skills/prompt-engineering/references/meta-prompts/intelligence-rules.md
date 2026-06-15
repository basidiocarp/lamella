<overview>
Guidelines for determining prompt complexity, tool usage, and optimization patterns.
</overview>

<complexity_assessment>

<simple_prompts>
Single focused task, clear outcome:
- single artifact
- low ambiguity
- minimal dependencies
- direct verification
</simple_prompts>

<complex_prompts>
Multi-step task, multiple considerations:
- several artifacts or phases
- dependencies on files or plans
- trade-off analysis
- integration with existing systems
</complex_prompts>

</complexity_assessment>

<extended_thinking_triggers>

<when_to_include>
Use deeper reasoning language for architecture, security, performance, or trade-off-heavy work.
</when_to_include>

<trigger_phrases>
```text
"Thoroughly analyze..."
"Consider multiple approaches..."
"Carefully evaluate trade-offs..."
```
</trigger_phrases>

<when_not_to_use>
- simple CRUD tasks
- established mechanical patterns
- low-risk one-step edits
</when_not_to_use>

</extended_thinking_triggers>

<parallel_tool_calling>

<when_to_include>
Use explicit parallelism instructions when multiple reads, searches, or independent calls do not depend on one another.
</when_to_include>

</parallel_tool_calling>

<context_loading>

<loading_patterns>
```xml
<context>
Research: @.prompts/001-auth-research/auth-research.md
Plan: @.prompts/002-auth-plan/auth-plan.md
Current feature: @src/features/auth/
Similar feature: @src/features/payments/
</context>
```
</loading_patterns>

</context_loading>

<output_optimization>

<streaming_writes>
For large research or planning outputs:
1. create the output file early
2. append sections as they are completed
3. finalize summary and metadata last
</streaming_writes>

<claude_to_claude>
For Claude-to-Claude consumption, prefer structured XML with explicit metadata, open questions, and next actions.
</claude_to_claude>

<human_consumption>
For human readers, prefer concise headings, short summaries, and actionable next steps over heavy XML.
</human_consumption>

</output_optimization>
