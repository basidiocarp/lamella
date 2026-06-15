## Example Output

When the assessment is complete, you'll receive a comprehensive maturity report:

```
=== CODE MATURITY ASSESSMENT REPORT ===

Project: DeFi DEX Protocol
Platform: Solidity (Ethereum)
Assessment Date: March 15, 2024

Overall Score: 2.7 / 5.0
Assessment Confidence: Medium

Category Scores
- Specification maturity: 2.0
- Test depth: 3.0
- Invariant coverage: 2.0
- Operational readiness: 2.5
- Dependency governance: 4.0

Summary
The protocol has solid dependency hygiene and reasonable unit test coverage, but
it is still missing explicit protocol invariants, clear numerical assumptions,
and production-ready operational controls. The largest risk is silent
correctness drift in swap and liquidity calculations.

**Critical Gap:**
File: src/SwapRouter.sol:127
```solidity
uint256 amountOut = (reserveOut * amountIn * 997) / (reserveIn * 1000 + amountIn * 997);
```
No specification for:
- Expected liquidity depth ranges
- Precision loss analysis
- Rounding direction justification

Why this matters:
- Integrators cannot tell whether the rounding behavior is intentional
- Auditors must infer invariants from implementation details
- Future optimizations could change economics without a failing test

Recommended action:
1. Add a spec note defining the intended constant-product invariant.
2. Document the fee model and expected rounding behavior.
3. Add property tests for:
   - zero-liquidity rejection
   - monotonic output with increasing input
   - bounded slippage under representative pool depths

Additional Gaps
- `src/LiquidityManager.sol`
  Missing limits for max position size and rebalance thresholds.
- `src/OracleAdapter.sol`
  No stale-price policy or fallback behavior documented.
- `test/SwapRouter.t.sol`
  Covers happy-path swaps but not precision edge cases around tiny amounts.

Quick Wins (1-2 days)
- Add invariant comments above swap math and fee math
- Add table-driven edge-case tests for tiny inputs and large reserves
- Document oracle freshness assumptions in the adapter interface

30-Day Plan
- Write a short protocol specification covering swap math, fee math, and oracle assumptions
- Add invariant and fuzz tests for routing and liquidity accounting
- Create an operations runbook for pausing, oracle failure, and upgrade review

Conclusion
The project is promising but not yet mature enough for high-value deployment.
The next maturity milestone is to make protocol assumptions explicit and test
them as invariants instead of relying on implementation intuition.

Assessment completed using Trail of Bits Building Secure Contracts
Code Maturity Evaluation Framework v0.1.0
```
