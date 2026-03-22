## Example Output

When the assessment is complete, you'll receive a comprehensive maturity report:

```
=== CODE MATURITY ASSESSMENT REPORT ===

Project: DeFi DEX Protocol
Platform: Solidity (Ethereum)
Assessment Date: March 15, 2024
// ... (52 lines trimmed)

**Critical Gap:**
File: src/SwapRouter.sol:127
```solidity
uint256 amountOut = (reserveOut * amountIn * 997) / (reserveIn * 1000 + amountIn * 997);
```
No specification for:
- Expected liquidity depth ranges
- Precision loss analysis
- Rounding direction justification

// ... (171 lines trimmed)

Assessment completed using Trail of Bits Building Secure Contracts
Code Maturity Evaluation Framework v0.1.0
```
