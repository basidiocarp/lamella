## Examples

### Example 1: SpaceX Rocket Cost Reduction

**Context:** Elon Musk wanted to buy rockets for Mars mission. Quote: $65 million per rocket.

**Input:**
> "Everyone says rockets cost $65M and that's just what they cost. Is this true? Apply First Principles."

**Output:**

**Current State Analysis:**

| Assumption | Challenge |
|------------|-----------|
| Rockets are expensive | Convention - based on historical pricing |
| Must buy from established vendors | Convention - could manufacture |
| Rockets are single-use | Convention - airplanes aren't single-use |
| Aerospace requires premium pricing | Convention - not physics |

**First Principles Breakdown:**

"What is a rocket made of?"
- Aerospace-grade aluminum
- Titanium
- Copper
- Carbon fiber
- Fuel (kerosene, liquid oxygen)

**Atomic Cost Analysis:**
```
Raw materials for Falcon 9:
├── Aluminum alloys: ~$35,000
├── Titanium: ~$15,000
├── Carbon fiber: ~$20,000
├── Avionics components: ~$100,000
├── Engines (9x Merlin): ~$1M (at scale)
└── Other materials: ~$30,000

Theoretical material cost: ~$1.2M
Industry price: $65M
Gap: 54x markup
```

**Reasoning Up:**

1. **Physics allows:** Rockets can be reusable (planes land and fly again)
2. **Minimum cost:** ~$1.2M in materials + manufacturing + margin = $5-10M possible
3. **Novel approach:**
   - Manufacture in-house (eliminate contractor margins)
   - Design for reusability (eliminate single-use assumption)
   - Vertical integration (control supply chain)

**Result:** Falcon 9 now costs ~$28M to launch, with reusability bringing marginal cost to ~$15M. Other companies still charge $100M+.

**Why This Works:** Musk didn't accept "rockets cost $65M" as a truth. He found it was a convention built on inefficient practices, not physics.

---

### Example 2: Rethinking Employee Training Costs

**Context:** Company spends $2,000 per employee on annual training. CFO says "that's industry standard."

**Input:**
> "We spend $2,000/employee on training. HR says that's normal. Is it? First Principles analysis please."

**Output:**

**Current State Analysis:**

| Assumption | Type |
|------------|------|
| Training must be instructor-led | Convention |
| Must use external vendors | Convention |
| Must be synchronous | Convention |
| Certifications require paid courses | Convention |
| Training = classroom time | Convention |

**Atomic Breakdown - What does training actually require?**

```
Training = Transfer of Knowledge + Skill Practice + Verification

├── Knowledge Transfer
│   ├── Content (can be recorded once)
│   ├── Delivery (can be async/digital)
│   └── Q&A (can be AI-assisted or peer)
│
├── Skill Practice
│   ├── Exercises (can be self-paced)
│   ├── Feedback (can be automated or peer)
│   └── Repetition (individual, no instructor needed)
│
└── Verification
    ├── Testing (automated)
    └── Observation (sampling, not 100%)
```

**Cost Breakdown:**
```
Current $2,000/person:
├── Vendor fees: $800 (40%)
├── Instructor time: $500 (25%)
├── Travel/facilities: $400 (20%)
├── Materials: $200 (10%)
└── Admin overhead: $100 (5%)

First Principles minimum:
├── One-time content creation: $50/person (amortized)
├── Platform/LMS: $30/person/year
├── Peer mentoring time: $100/person
├── Verification tools: $20/person
└── Buffer: $50/person

Theoretical minimum: ~$250/person
```

**Reasoning Up - New Model:**

1. **Create content once:** Record best trainer explaining each topic. Amortize over 5 years.
2. **Async delivery:** Employees learn at their pace, no scheduling costs
3. **AI Q&A:** Claude/GPT handles 80% of questions
4. **Peer practice:** Employees practice together (free)
5. **Automated verification:** Digital assessments, spot-check practical

**New Solution:**
- Year 1: $500/person (content creation investment)
- Year 2+: $250/person (75% reduction maintained)

**Validation:**
- Still transfers knowledge? Yes
- Still builds skills? Yes (peer practice)
- Still verifies? Yes (automated + sampling)
- Respects laws of learning? Yes

---
