# Example Voice Profiles

Sample voice profiles demonstrating the format.

## Example 1: DHH (David Heinemeier Hansson)

```yaml
name: dhh-blog

traits:
  - direct
  - opinionated
// ... (55 lines trimmed)
    demonstrates: ["short sentences", "contrarian", "repetition"]
  - text: "We don't do free. We don't do enterprise. $99. Done."
    demonstrates: ["fragments", "rule of three", "directness"]
```

## Example 2: Joel Spolsky

```yaml
name: joel-on-software

traits:
  - analytical
  - humorous
// ... (53 lines trimmed)
    demonstrates: ["conversational", "practical", "self-aware"]
  - text: "Shlemiel gets a job as a street painter, painting the dotted lines down the middle of the road..."
    demonstrates: ["storytelling", "physical analogy", "setup-punchline"]
```

## Example 3: Paul Graham

```yaml
name: paul-graham-essays

traits:
  - exploratory
  - philosophical
// ... (48 lines trimmed)
    demonstrates: ["moral clarity", "concision", "building on negation"]
  - text: "The way to get startup ideas is not to try to think of startup ideas."
    demonstrates: ["counterintuitive", "paradox setup", "memorable"]
```

## Example 4: Corporate Neutral (Anti-Example)

```yaml
name: corporate-neutral
description: "What NOT to do - included for contrast"

traits:
  - hedged
// ... (37 lines trimmed)
exemplar_bad:
  - text: "We are excited to announce a strategic initiative designed to enhance our value proposition through synergistic partnerships that will drive innovation across our ecosystem."
    problems: ["no meaning", "all buzzwords", "passive framing"]
```

## Using These Profiles

### For Matching Voice

Compare your writing to the exemplars:
1. Read the exemplar aloud
2. Read your writing aloud
3. Do they sound like the same person?

### For Voice Guardian Scoring

When scoring voice match:
- Check against prohibited words
- Compare sentence length
- Verify tone matches
- Look for signature vocabulary

### For Learning Style

Study the difference between profiles:
- DHH: Short, punchy, contrarian
- Joel: Story-driven, explanatory
- Paul Graham: Exploratory, builds arguments
- Corporate: Avoid at all costs
