---
name: embedded-systems
description: "Builds embedded and firmware systems in C and C++."
origin: lamella
---

# Embedded Systems Engineer

Microcontroller programming, RTOS implementation, and hardware-software integration for resource-constrained devices.

## When to Use This Skill

- Developing firmware for microcontrollers (STM32, ESP32, Nordic, etc.)
- Implementing RTOS-based applications (FreeRTOS, Zephyr)
- Creating hardware drivers and HAL layers
- Optimizing power consumption and memory usage
- Building real-time systems with strict timing requirements
- Implementing communication protocols (I2C, SPI, UART, CAN)

## Core Workflow

1. **Analyze constraints** - Identify MCU specs, memory limits, timing requirements, power budget
2. **Design architecture** - Plan task structure, interrupts, peripherals, memory layout
3. **Implement drivers** - Write HAL, peripheral drivers, RTOS integration
4. **Optimize resources** - Minimize code size, RAM usage, power consumption
5. **Test and verify** - Validate timing, test edge cases, measure performance

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| RTOS Patterns | `references/rtos-patterns.md` | FreeRTOS tasks, queues, synchronization |
| Microcontroller | `references/microcontroller-programming.md` | Bare-metal, registers, peripherals, interrupts |
| Power Management | `references/power-optimization.md` | Sleep modes, low-power design, battery life |
| Communication | `references/communication-protocols.md` | I2C, SPI, UART, CAN implementation |
| Memory & Performance | `references/memory-optimization.md` | Code size, RAM usage, flash management |

## Constraints

### MUST DO
- Optimize for code size and RAM usage
- Use volatile for hardware registers
- Implement proper interrupt handling (short ISRs)
- Add watchdog timer for reliability
- Use proper synchronization primitives
- Document resource usage (flash, RAM, power)
- Handle all error conditions
- Consider timing constraints and jitter

### MUST NOT DO
- Use blocking operations in ISRs
- Allocate memory dynamically without bounds checking
- Skip critical section protection
- Ignore hardware errata and limitations
- Use floating-point without hardware support awareness
- Access shared resources without synchronization
- Hardcode hardware-specific values
- Ignore power consumption requirements

## Output Templates

When implementing embedded features, provide:
1. Hardware initialization code (clocks, peripherals, GPIO)
2. Driver implementation (HAL layer, interrupt handlers)
3. Application code (RTOS tasks or main loop)
4. Resource usage summary (flash, RAM, power estimate)
5. Brief explanation of timing and optimization decisions

## Knowledge Reference

ARM Cortex-M, STM32, ESP32, Nordic nRF, FreeRTOS, Zephyr, bare-metal, interrupts, DMA, timers, ADC/DAC, I2C, SPI, UART, CAN, low-power modes, JTAG/SWD, memory-mapped I/O, bootloaders, OTA updates
