# Evaluation Challenges

Agent evaluation differs fundamentally from traditional software or standard language model evaluation. This reference details the unique challenges and solutions.

## Non-Determinism and Multiple Valid Paths

Agents may take completely different valid paths to reach goals. One agent might search three sources while another searches ten. They might use different tools to find the same answer. Traditional evaluations that check for specific steps fail in this context.

**Solution**: Focus on outcomes, not exact execution paths. Judge whether the agent achieves the right result through a reasonable process.

**Example**:
- Task: "Find the current CEO of Apple"
- Agent A: Searches Wikipedia → Finds answer
- Agent B: Searches company website → investor relations → Finds answer
- Both paths valid if they reach correct answer efficiently

## Context-Dependent Failures

Agent failures often depend on context in subtle ways:
- An agent might succeed on complex queries but fail on simple ones
- It might work well with one tool set but fail with another
- Failures may emerge only after extended interaction when context accumulates
- Early decisions can cascade into later failures

**Solution**: Evaluation must cover a range of complexity levels and test extended interactions, not just isolated queries.

**Testing Strategy**:
1. Test across complexity levels (simple, medium, complex, very complex)
2. Test extended multi-turn interactions
3. Test with different tool configurations
4. Test with varying context window utilization

## Composite Quality Dimensions

Agent quality is not a single dimension. It includes:
- **Factual accuracy**: Is the information correct?
- **Completeness**: Are all aspects addressed?
- **Coherence**: Is the output well-structured?
- **Tool efficiency**: Were appropriate tools used efficiently?
- **Process quality**: Was the reasoning sound?

An agent might score high on accuracy but low in efficiency, or vice versa.

**Solution**: Evaluation rubrics must capture multiple dimensions with appropriate weighting for the use case.

**Dimension Weighting Examples**:

| Use Case | Primary Dimensions | Secondary Dimensions |
|----------|-------------------|---------------------|
| Fact-checking | Accuracy (0.5), Completeness (0.3) | Efficiency (0.2) |
| Code generation | Correctness (0.4), Efficiency (0.3) | Readability (0.2), Completeness (0.1) |
| Research tasks | Completeness (0.4), Accuracy (0.3) | Coherence (0.2), Sources (0.1) |

## Performance Drivers: The 95% Finding

Research on the BrowseComp evaluation (which tests browsing agents' ability to locate hard-to-find information) found that three factors explain 95% of performance variance:

| Factor | Variance Explained | Implication |
|--------|-------------------|-------------|
| Token usage | 80% | More tokens = better performance |
| Number of tool calls | ~10% | More exploration helps |
| Model choice | ~5% | Better models multiply efficiency |

**Implications for Claude Code development**:

- **Token budgets matter**: Evaluate with realistic token constraints
- **Model upgrades beat token increases**: Upgrading models provides larger gains than increasing token budgets
- **Multi-agent validation**: Validates architectures that distribute work across subagents with separate context windows

## Key Takeaways

1. **Outcome-focused evaluation**: Judge results, not process steps
2. **Multi-dimensional rubrics**: Capture various quality aspects with appropriate weights
3. **Complexity stratification**: Test across simple to very complex scenarios
4. **Extended interaction testing**: Don't just test isolated queries
5. **Resource-aware evaluation**: Consider token and tool call efficiency
