# Common Vulnerability Patterns

Quick reference for detecting common security issues in code changes.

## Security Regressions

**Pattern:** Previously removed code is re-added.

```bash
git log -S "pattern" --all --grep="security|fix|CVE"
```

## Double Decrease/Increase Bugs

**Pattern:** Same accounting action happens twice for one event.

## Missing Validation

**Pattern:** A removed `require`, `assert`, or guard is not replaced elsewhere.

```bash
git diff <range> | grep "^-.*require"
git diff <range> | grep "^-.*assert"
```

## Underflow/Overflow

**Pattern:** Arithmetic proceeds without protection or an `unchecked` block is introduced carelessly.

## Reentrancy

**Pattern:** External call before state update.

```solidity
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool ok,) = msg.sender.call{value: amount}("");
    require(ok);
    balances[msg.sender] = 0;
}
```

Update state before the external call or use reentrancy protection.

## Access Control Bypass

**Pattern:** Permission checks are removed or broadened.

## Race Conditions / Front-Running

**Pattern:** Multi-step state transitions are exposed without commit-reveal, sequencing protection, or other mitigation.

## Timestamp Manipulation

**Pattern:** Security logic depends on `block.timestamp` when a miner-controlled skew is enough to matter.
