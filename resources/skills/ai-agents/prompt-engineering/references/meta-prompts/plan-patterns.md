<overview>
Prompt patterns for producing plans, roadmaps, and execution strategies that a
later prompt or agent will consume.
</overview>

<prompt_template>
```xml
<objective>
Create a {plan_type} for {topic}.

Purpose: {what decision or implementation this enables}
Input: {research, constraints, or context}
Output: {target file or artifact}
</objective>

<planning_requirements>
- Keep phases executable by a single downstream prompt or worker.
- Make dependencies explicit.
- Surface assumptions, open questions, and confidence.
- Prefer concrete deliverables over abstract milestones.
</planning_requirements>

<output_structure>
<plan>
  <summary>{one-paragraph overview}</summary>
  <phases>
    <phase number="1" name="{phase-name}">
      <objective>{what this phase accomplishes}</objective>
      <tasks>
        <task priority="high">{specific task}</task>
      </tasks>
      <deliverables>
        <deliverable>{artifact or decision}</deliverable>
      </deliverables>
      <dependencies>{what must already exist}</dependencies>
    </phase>
  </phases>
  <metadata>
    <confidence level="{high|medium|low}">{why}</confidence>
    <dependencies>{external dependencies}</dependencies>
    <open_questions>{unresolved issues}</open_questions>
    <assumptions>{assumptions made}</assumptions>
  </metadata>
</plan>
</output_structure>
```
</prompt_template>

<key_principles>

<reference_research>
Plans should inherit conclusions from prior research instead of restating raw
notes. Pull forward:
- recommended approach
- constraints and tradeoffs
- decisions that are already settled
</reference_research>

<prompt_sized_phases>
Each phase should be small enough for one downstream prompt or worker to own.
If a phase needs multiple independent implementers, split it before execution.
</prompt_sized_phases>

<execution_hints>
Add short execution notes only when the next prompt truly needs them, such as:
- files or modules it must reuse
- order-sensitive constraints
- test or verification expectations
</execution_hints>

</key_principles>

<plan_types>

<implementation_roadmap>
Use for phased delivery plans where the main question is how to build
something safely and incrementally.
</implementation_roadmap>

<decision_framework>
Use when the output is a choice among options, with recommendation, rationale,
risks, and mitigations.
</decision_framework>

<process_definition>
Use when the output is a repeatable workflow with explicit steps, checks, and
rollback or recovery points.
</process_definition>

</plan_types>
