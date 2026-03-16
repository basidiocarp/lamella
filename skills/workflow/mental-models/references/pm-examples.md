## Examples

### Example 1: Product Launch Pre-Mortem

**Context:** SaaS company launching new enterprise product in 3 months.

**Input:**
> "We're launching our enterprise product in Q2. Everyone's excited. Run a Pre-Mortem—what killed us?"

**Output:**

**The Scenario:**
"It's September. Our Q2 enterprise launch failed. We've burned through our runway, the product hasn't gained traction, and we're considering a pivot. What went wrong?"

**Failure Reasons Generated:**

**EXECUTION FAILURES:**
1. We underestimated enterprise sales cycle (6-12 months, not 2)
2. Security review requirements we didn't anticipate (SOC2, etc.)
3. The product wasn't actually enterprise-ready (missing audit logs, SSO)
4. Support couldn't handle enterprise customer expectations

**MARKET/TIMING:**
5. Enterprise budgets were frozen due to economic conditions
6. Two competitors launched similar products in Q1
7. Target companies in "wait and see" mode

**INTERNAL/TEAM:**
8. Sales team had no enterprise experience
9. Engineering bandwidth split between launch and bug fixes
10. Marketing message didn't resonate with enterprise buyers

**RESOURCE:**
11. Ran out of runway before enough deals closed
12. Couldn't hire enterprise sales rep fast enough

**Risk Assessment:**

| Failure Reason | Likelihood | Impact | Priority |
|----------------|------------|--------|----------|
| Enterprise sales cycle underestimated | HIGH | HIGH | CRITICAL |
| Product not enterprise-ready | HIGH | HIGH | CRITICAL |
| Budget freeze | MEDIUM | HIGH | WATCH |
| Competitive launch | MEDIUM | MEDIUM | MONITOR |
| Sales team inexperience | HIGH | HIGH | CRITICAL |

**Prevention Plan:**

**Risk 1: Sales Cycle Underestimated**
- Prevention: Start enterprise conversations NOW (3 months early)
- Validation: Have 5 LOIs before launch, not 5 "interested" calls
- Tripwire: If no LOIs by Week 4, pause launch

**Risk 2: Product Not Enterprise-Ready**
- Prevention: Hire enterprise advisor to audit requirements
- Action: Prioritize SSO, audit logs, SLA before launch
- Tripwire: If security questionnaire failure, delay launch

**Risk 3: Sales Team Inexperience**
- Prevention: Hire one senior enterprise rep or consultant
- Alternative: Partner with enterprise-focused reseller
- Validation: Close one pilot before full launch

**Updated Plan:**
- Push launch to Q3 (realistic timeline)
- Add SOC2 certification to roadmap
- Hire enterprise sales lead in Q1
- Secure 3 design partners before public launch

---

### Example 2: Hiring Decision Pre-Mortem

**Context:** Startup about to make critical senior hire.

**Input:**
> "We're about to hire a VP of Engineering. $300K salary, equity, big commitment. Pre-Mortem this decision—how did this hire fail?"

**Output:**

**The Scenario:**
"It's 12 months later. The VP of Engineering hire was a disaster. We've parted ways (expensively), the team is demoralized, and we've lost 6 months of progress. What happened?"

**Failure Reasons:**

**WRONG FIT:**
1. Great at BigCo process, couldn't handle startup ambiguity
2. Culture mismatch—too hierarchical for our flat structure
3. Technical skills outdated (legacy stack experience)
4. Wanted to build empire, not ship product

**POOR PROCESS:**
5. We were desperate and moved too fast
6. References were from friends, not actual reports
7. Didn't test actual work (no trial project)
8. Founder charisma masked red flags in interviews

**WRONG EXPECTATIONS:**
9. We said "VP" but needed "player-coach"
10. Compensation expectations kept growing
11. They expected more team/budget than we had

**EXTERNAL:**
12. Counter-offers pulled them back mentally
13. Their spouse hated the relocation
14. They took the job as a "stepping stone"

**Risk Assessment:**

| Failure Reason | Likelihood | Impact | Priority |
|----------------|------------|--------|----------|
| Wrong for startup stage | HIGH | CRITICAL | CRITICAL |
| Poor reference checking | MEDIUM | HIGH | CRITICAL |
| Expectations mismatch | HIGH | HIGH | CRITICAL |
| No trial period | MEDIUM | HIGH | ACTION |

**Prevention Plan:**

**Risk 1: Wrong for Startup Stage**
- Prevention: Explicitly discuss startup chaos in interview
- Test: "Tell me about a time you shipped with incomplete specs"
- Red flag: All examples from large companies

**Risk 2: Poor Reference Checking**
- Prevention: Talk to people THEY didn't list
- Minimum: 2 former direct reports (not friends)
- Ask: "Would you enthusiastically rehire them?"

**Risk 3: Expectations Mismatch**
- Prevention: Written expectations doc, signed
- Include: Budget, team size, first-year goals
- Discuss: "What if budget is cut in half?"

**Risk 4: No Trial Period**
- Prevention: Paid 2-week trial project before offer
- Alternative: Advisory period first
- At minimum: Pair on real problem for half-day

**Updated Hiring Process:**
1. Add "startup chaos" scenarios to interview
2. Reference check includes LinkedIn outreach to unlisted people
3. Written expectations document
4. 2-week paid trial before final offer
5. 90-day milestone check-in

---
