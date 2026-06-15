# Tracking Debug Playbook

Use this when events are missing, duplicated, or carrying the wrong parameters.

## Debug Stack

```text
Layer 5: reports and dashboards
Layer 4: analytics ingestion
Layer 3: network request
Layer 2: GTM tag firing
Layer 1: app code or data layer
```

Always start at Layer 1 and move upward.

## Checklist

- [ ] confirm the expected event name and parameters
- [ ] verify the app or data layer emitted the event
- [ ] verify GTM fired the right tag
- [ ] inspect the network request payload
- [ ] confirm the event reaches debug or real-time views
- [ ] confirm filters, consent, and property selection are not hiding the data

## Common Failures

### Event fires in GTM but not in analytics

Check:

- consent mode state
- property or measurement ID mismatch
- debug mode settings
- filters blocking internal or test traffic

### Event never fires in GTM

Check:

- trigger conditions
- exact event-name match for data layer events
- SPA timing and route changes
- whether the tracked element exists when the trigger evaluates

### Parameters show as missing

Check:

- data layer keys
- GTM variable names
- network payload
- custom dimension registration if needed for reports

### Duplicate events

Look for:

- enhanced measurement overlapping with manual GTM tags
- duplicate config tags
- multiple triggers matching the same action
