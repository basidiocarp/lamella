# Communication Protocols

Use this reference to choose the right communication pattern for embedded
systems. It is a routing guide, not a full peripheral-driver implementation.

## I2C

Best for:
- low-pin-count peripheral buses
- configuration registers
- small sensor payloads

Review points:
- open-drain pins and pull-ups
- address size and register addressing
- timeout handling for stuck buses
- recovery path for arbitration loss or a held-low line

Use DMA or interrupt-driven transfers only when bus load justifies the added
complexity.

## SPI

Best for:
- higher-throughput peripheral traffic
- displays, flash, ADCs, DACs, radios
- deterministic master-driven transfers

Review points:
- clock polarity and phase
- chip-select timing
- full-duplex vs half-duplex assumptions
- buffer ownership during DMA transfers

SPI is usually simpler than I2C electrically, but easier to misconfigure at the
timing and framing layer.

## UART

Best for:
- console access
- simple point-to-point links
- bootloader, telemetry, and debugging channels

Review points:
- baud-rate error tolerance
- framing and parity configuration
- interrupt or DMA receive path
- circular-buffer overflow behavior

Always define how receive buffers recover from burst traffic and framing errors.

## CAN

Best for:
- multi-node industrial or automotive networks
- high-reliability bus arbitration
- systems that need message IDs and hardware filtering

Review points:
- bit timing and bus speed
- identifier allocation
- acceptance filters
- error passive / bus-off recovery

Treat CAN configuration as a network-design problem, not only a peripheral setup
task.

## Cross-Protocol Guidance

Regardless of protocol:
- use explicit timeouts
- validate message framing and checksums where applicable
- keep ISR work minimal
- protect shared buffers and state transitions
- define recovery behavior for bus or peripheral faults

## Selection Guide

| Protocol | Better for |
|---|---|
| I2C | simple multi-device control and sensor buses |
| SPI | higher-throughput local peripherals |
| UART | point-to-point links and console/debugging |
| CAN | robust multi-node message networks |

If you need a full driver example, split that into a protocol-specific reference
instead of overloading this guide.
