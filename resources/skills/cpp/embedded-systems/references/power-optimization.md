# Power Optimization

## Sleep Mode Strategy

```c
#include "stm32f4xx.h"

typedef enum {
    POWER_MODE_RUN,
    POWER_MODE_SLEEP,
// ... (56 lines trimmed)
    // Re-enable peripherals
    RestorePeripherals();
}
```

## Dynamic Clock Scaling

```c
typedef enum {
    CLOCK_SPEED_LOW = 0,     // 48MHz
    CLOCK_SPEED_MEDIUM,      // 84MHz
    CLOCK_SPEED_HIGH         // 168MHz
} ClockSpeed_t;
// ... (50 lines trimmed)
        total_ticks = 0;
    }
}
```

## Peripheral Power Management

```c
// Smart peripheral enabling/disabling
typedef struct {
    uint32_t last_used_ms;
    bool is_enabled;
    uint32_t timeout_ms;
// ... (44 lines trimmed)
    // Disable DMA if not needed
    RCC->AHB1ENR &= ~(RCC_AHB1ENR_DMA1EN | RCC_AHB1ENR_DMA2EN);
}
```

## GPIO Power Optimization

```c
// Configure unused pins to minimize leakage
void ConfigureUnusedPins(void) {
    // All unused pins: analog mode (lowest power)
    GPIOD->MODER = 0xFFFFFFFF;  // All pins analog
    GPIOE->MODER = 0xFFFFFFFF;
// ... (23 lines trimmed)
    // Restore GPIO configuration
    GPIOA->MODER = gpioa_moder;
}
```

## ADC Power Optimization

```c
// ADC with automatic power-down
void ADC_LowPower_Init(void) {
    RCC->APB2ENR |= RCC_APB2ENR_ADC1EN;

    // Enable auto power-down mode
// ... (29 lines trimmed)

    return result;
}
```

## Battery Monitoring

```c
// Battery voltage monitoring with low-power ADC
#define VREFINT_CAL_ADDR  ((uint16_t*)0x1FFF7A2A)
#define VREFINT_CAL_VREF  3300  // mV

uint16_t GetBatteryVoltage_mV(void) {
// ... (55 lines trimmed)
            break;
    }
}
```

## RTC Wakeup

```c
// Configure RTC for periodic wakeup
void RTC_Init_Wakeup(void) {
    // Enable PWR clock
    RCC->APB1ENR |= RCC_APB1ENR_PWREN;

// ... (39 lines trimmed)
        PeriodicTask();
    }
}
```

## Power Measurement

```c
// Estimate power consumption
typedef struct {
    uint32_t cpu_active_ms;
    uint32_t cpu_sleep_ms;
    uint32_t peripherals;  // Bitmap of active peripherals
// ... (28 lines trimmed)

    return power;
}
```

## Best Practices

- Use stop mode for sleeps > 1 second
- Configure unused pins as analog or output-low
- Disable peripheral clocks when not in use
- Use RTC wakeup instead of systick in low-power modes
- Reduce clock speed during low-activity periods
- Use DMA to reduce CPU wakeups
- Batch operations to minimize wakeup frequency
- Monitor battery and adapt behavior
- Profile actual power consumption with current meter
