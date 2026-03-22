---
name: postmortem-writing
description: Write effective blameless postmortems with root cause analysis, timelines, and action items. Use when conducting incident reviews, writing postmortem documents, or improving incident response processes.
---

# Postmortem Writing


## Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Core Concepts](#core-concepts)
  - [1. Blameless Culture](#1-blameless-culture)
  - [2. Postmortem Triggers](#2-postmortem-triggers)
- [Quick Start](#quick-start)
  - [Postmortem Timeline](#postmortem-timeline)
- [Templates](#templates)
  - [Template 1: Standard Postmortem](#template-1-standard-postmortem)
- [Executive Summary](#executive-summary)
- [Timeline (All times UTC)](#timeline-all-times-utc)
- [Root Cause Analysis](#root-cause-analysis)
  - [What Happened](#what-happened)
  - [Why It Happened](#why-it-happened)
  - [System Diagram](#system-diagram)
- [Detection](#detection)
  - [What Worked](#what-worked)
  - [What Didn't Work](#what-didnt-work)
  - [Detection Gap](#detection-gap)
- [Response](#response)
  - [What Worked](#what-worked)
  - [What Could Be Improved](#what-could-be-improved)
- [Impact](#impact)
  - [Customer Impact](#customer-impact)
  - [Business Impact](#business-impact)
  - [Technical Impact](#technical-impact)
- [Lessons Learned](#lessons-learned)
  - [What Went Well](#what-went-well)
  - [What Went Wrong](#what-went-wrong)
  - [Where We Got Lucky](#where-we-got-lucky)
- [Action Items](#action-items)
- [Appendix](#appendix)
  - [Supporting Data](#supporting-data)
  - [Related Incidents](#related-incidents)
  - [References](#references)
  - [Template 2: 5 Whys Analysis](#template-2-5-whys-analysis)
- [Problem Statement](#problem-statement)
- [Analysis](#analysis)
  - [Why #1: Why did the service fail?](#why-1-why-did-the-service-fail)
  - [Why #2: Why were database connections exhausted?](#why-2-why-were-database-connections-exhausted)
  - [Why #3: Why did the code bypass the connection pool?](#why-3-why-did-the-code-bypass-the-connection-pool)
  - [Why #4: Why wasn't this caught in code review?](#why-4-why-wasnt-this-caught-in-code-review)
  - [Why #5: Why isn't there a safety net for this type of change?](#why-5-why-isnt-there-a-safety-net-for-this-type-of-change)
- [Root Causes Identified](#root-causes-identified)
- [Systemic Improvements](#systemic-improvements)
  - [Template 3: Quick Postmortem (Minor Incidents)](#template-3-quick-postmortem-minor-incidents)
- [What Happened](#what-happened)
- [Timeline](#timeline)
- [Root Cause](#root-cause)
- [Fix](#fix)
- [Lessons](#lessons)
- [Facilitation Guide](#facilitation-guide)
  - [Running a Postmortem Meeting](#running-a-postmortem-meeting)
- [Meeting Structure (60 minutes)](#meeting-structure-60-minutes)
  - [1. Opening (5 min)](#1-opening-5-min)
  - [2. Timeline Review (15 min)](#2-timeline-review-15-min)
  - [3. Analysis Discussion (20 min)](#3-analysis-discussion-20-min)
  - [4. Action Items (15 min)](#4-action-items-15-min)
  - [5. Closing (5 min)](#5-closing-5-min)
- [Facilitation Tips](#facilitation-tips)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Best Practices](#best-practices)
  - [Do's](#dos)
  - [Don'ts](#donts)
- [Resources](#resources)


Comprehensive guide to writing effective, blameless postmortems that drive organizational learning and prevent incident recurrence.

## When to Use This Skill

- Conducting post-incident reviews
- Writing postmortem documents
- Facilitating blameless postmortem meetings
- Identifying root causes and contributing factors
- Creating actionable follow-up items
- Building organizational learning culture

## Core Concepts

### 1. Blameless Culture

| Blame-Focused            | Blameless                         |
| ------------------------ | --------------------------------- |
| "Who caused this?"       | "What conditions allowed this?"   |
| "Someone made a mistake" | "The system allowed this mistake" |
| Punish individuals       | Improve systems                   |
| Hide information         | Share learnings                   |
| Fear of speaking up      | Psychological safety              |

### 2. Postmortem Triggers

- SEV1 or SEV2 incidents
- Customer-facing outages > 15 minutes
- Data loss or security incidents
- Near-misses that could have been severe
- Novel failure modes
- Incidents requiring unusual intervention

## Quick Start

### Postmortem Timeline

```
Day 0: Incident occurs
Day 1-2: Draft postmortem document
Day 3-5: Postmortem meeting
Day 5-7: Finalize document, create tickets
Week 2+: Action item completion
Quarterly: Review patterns across incidents
```

## Templates

### Template 1: Standard Postmortem

```markdown
# Postmortem: [Incident Title]

**Date**: 2024-01-15
**Authors**: @alice, @bob
**Status**: Draft | In Review | Final
// ... (50 lines trimmed)
   - Why was developer unfamiliar? → No documentation on connection management patterns

### System Diagram
```

[Client] → [Load Balancer] → [Payment Service] → [Database]
↓
Connection Pool (broken)
↓
Direct connections (cause)

```

## Detection

### What Worked
- Error rate alert fired within 8 minutes of deployment
// ... (84 lines trimmed)
### References
- [Connection Pool Best Practices](internal-wiki/connection-pools)
- [Deployment Runbook](internal-wiki/deployment-runbook)
```

### Template 2: 5 Whys Analysis

```markdown
# 5 Whys Analysis: [Incident]

## Problem Statement

Payment service experienced 47-minute outage due to database connection exhaustion.
// ... (52 lines trimmed)
| Missing docs  | Document connection patterns      | Prevention |
| Review gaps   | Update review checklist           | Detection  |
| No canary     | Implement canary deployments      | Mitigation |
```

### Template 3: Quick Postmortem (Minor Incidents)

```markdown
# Quick Postmortem: [Brief Title]

**Date**: 2024-01-15 | **Duration**: 12 min | **Severity**: SEV3

## What Happened
// ... (20 lines trimmed)
## Lessons

Don't full-flush cache in production; use targeted invalidation.
```

## Facilitation Guide

### Running a Postmortem Meeting

```markdown
## Meeting Structure (60 minutes)

### 1. Opening (5 min)

- Remind everyone of blameless culture
// ... (32 lines trimmed)
- Encourage quiet participants
- Document dissenting views
- Time-box tangents
```

## Anti-Patterns to Avoid

| Anti-Pattern            | Problem                    | Better Approach                 |
| ----------------------- | -------------------------- | ------------------------------- |
| **Blame game**          | Shuts down learning        | Focus on systems                |
| **Shallow analysis**    | Doesn't prevent recurrence | Ask "why" 5 times               |
| **No action items**     | Waste of time              | Always have concrete next steps |
| **Unrealistic actions** | Never completed            | Scope to achievable tasks       |
| **No follow-up**        | Actions forgotten          | Track in ticketing system       |

## Best Practices

### Do's

- **Start immediately** - Memory fades fast
- **Be specific** - Exact times, exact errors
- **Include graphs** - Visual evidence
- **Assign owners** - No orphan action items
- **Share widely** - Organizational learning

### Don'ts

- **Don't name and shame** - Ever
- **Don't skip small incidents** - They reveal patterns
- **Don't make it a blame doc** - That kills learning
- **Don't create busywork** - Actions should be meaningful
- **Don't skip follow-up** - Verify actions completed

## Resources

- [Google SRE - Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Etsy's Blameless Postmortems](https://codeascraft.com/2012/05/22/blameless-postmortems/)
- [PagerDuty Postmortem Guide](https://postmortems.pagerduty.com/)
