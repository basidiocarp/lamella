# Adversarial Vulnerability Analysis (Phase 5)

Structured methodology for finding vulnerabilities through attacker modeling.

**When to use:** After completing deep context analysis (Phase 4), apply this to all HIGH RISK changes.

---

## 1. Define Specific Attacker Model

**WHO is the attacker?**
- Unauthenticated external user
- Authenticated regular user
- Malicious administrator
- Compromised contract/service
- Front-runner/MEV bot

**WHAT access/privileges do they have?**
- Public API access only
- Authenticated user role
- Specific permissions/tokens
- Contract call capabilities

**WHERE do they interact with the system?**
- Specific HTTP endpoints
- Smart contract functions
- RPC interfaces
- External APIs

---

## 2. Identify Concrete Attack Vectors

```text
ENTRY POINT: [Exact function/endpoint attacker can access]

ATTACK SEQUENCE:
1. [Specific API call/transaction with parameters]
2. [How this reaches the vulnerable code]
3. [What happens in the vulnerable code]
4. [Impact achieved]

PROOF OF ACCESSIBILITY:
- Show the function is public/external
- Demonstrate attacker has required permissions
- Prove attack path exists through actual interfaces
```

---

## 3. Rate Realistic Exploitability

**EASY:** Exploitable via public APIs with no special privileges
- Single transaction/call
- Common user access level
- No complex conditions required

**MEDIUM:** Requires specific conditions or elevated privileges
- Multiple steps or timing requirements
- Elevated but obtainable privileges
- Specific system state needed

**HARD:** Requires privileged access or rare conditions
- Admin/owner privileges needed
- Rare edge case conditions
- Significant resources required

---

## 4. Build Complete Exploit Scenario

```text
ATTACKER STARTING POSITION:
[What the attacker has at the beginning]

STEP-BY-STEP EXPLOITATION:
Step 1: [Concrete action through accessible interface]
Step 2: [State transition or validation bypass]
Step 3: [Second action or repeated call if needed]
Step 4: [Final effect observed by attacker]

EVIDENCE TO COLLECT:
- Request, transaction, or CLI invocation
- Code path reached
- Missing guard or broken invariant
- Observable effect in balances, state, permissions, or outputs

IMPACT:
- Exact amount of funds drained
- Specific privileges escalated
- Particular data exposed
```

---

## 5. Cross-Reference with Baseline Context

From baseline analysis (see [methodology.md](methodology.md#pre-analysis-baseline-context-building)), check:
- Does this violate a system-wide invariant?
- Does this break a trust boundary?
- Does this bypass a validation pattern?
- Is this a regression of a previous fix?

---

## Vulnerability Report Template

Generate this for each finding:

```markdown
## [SEVERITY] Vulnerability Title

**Attacker Model:**
- WHO: [Specific attacker type]
- ACCESS: [Exact privileges]
- ENTRY POINT: [Concrete endpoint/function]

**Exploitability:** EASY | MEDIUM | HARD

**Attack Path:**
1. [Initial action]
2. [Reach vulnerable code]
3. [Exploit effect]

**Impact:**
[Specific, measurable harm - not theoretical]

**Proof of Concept:**
```code
// Exact code or request to reproduce
```

**Root Cause:**
[Reference specific code change at file.ext:L123]

**Blast Radius:** [N callers or assets affected]
**Baseline Violation:** [Which invariant or pattern is broken]
```

---

## Example: Complete Adversarial Analysis

**Change:** Removed `require(amount > 0)` check from `withdraw()` function

### 1. Attacker Model
- **WHO:** Unauthenticated external user
- **ACCESS:** Can call public contract functions
- **INTERFACE:** `withdraw(uint256 amount)` at 0x1234...

### 2. Attack Vector
**ENTRY POINT:** `withdraw(0)`

**ATTACK SEQUENCE:**
1. Call `withdraw(0)` from attacker address
2. Code bypasses amount check
3. Withdraw event emits with 0 amount
4. Accounting updates incorrectly

**PROOF:** Function is `external`, no auth required

### 3. Exploitability
**RATING:** EASY
- Single transaction
- Public function
- No special state required

### 4. Exploit Scenario
**ATTACKER POSITION:** Has user account with 0 balance

**EXPLOITATION:**
```solidity
Step 1: attacker.withdraw(0)
  - Passes removed validation
  - Emits Withdraw(user, 0)
  - Updates withdrawnAmount[user] += 0

Step 2: Off-chain indexer sees Withdraw event
  - Credits attacker for a withdrawal path
  - Accounting now diverges from balances
```

**IMPACT:**
- Protocol accounting corrupted
- Can poison downstream calculations
- Estimated business impact depends on settlement path

### 5. Baseline Violation
- Violates invariant: all withdrawals must transfer non-zero value
- Breaks validation pattern used in other value-transfer paths
- Regression of a previously enforced safety check

---

**Next:** Document all findings in the final report (see [reporting.md](reporting.md))
