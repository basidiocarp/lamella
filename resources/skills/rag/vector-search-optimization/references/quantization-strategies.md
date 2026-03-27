# Quantization Strategies

Use quantization when vector memory footprint is the bottleneck.

## Common Options

| Strategy | Tradeoff | Best Fit |
|----------|----------|----------|
| Scalar quantization | Small recall hit, strong memory savings | Large general-purpose indexes |
| Product quantization | Higher compression, more tuning | Very large indexes |
| Binary quantization | Strongest compression, bigger quality tradeoff | Extreme memory pressure |

## Selection Rule

- Start with scalar quantization.
- Move to PQ only when memory pressure remains after model or dimension changes.
- Re-measure recall after quantization rather than assuming the loss is acceptable.
