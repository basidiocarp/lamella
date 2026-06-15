# Scrape Configuration Patterns

## Common Modes

- **Static targets** for small fixed estates
- **File-based discovery** for generated target lists
- **Kubernetes discovery** for cluster-native scraping

## Defaults

- `scrape_interval`: usually 15s to 60s
- Relabel aggressively to drop noise and normalize labels
- Keep discovery simple until target churn requires more automation
