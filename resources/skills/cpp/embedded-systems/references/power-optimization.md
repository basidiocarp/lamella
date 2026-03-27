# Power Optimization

## Sleep Mode Strategy

```c
#include "stm32f4xx.h"

typedef enum {
    POWER_MODE_RUN,
    POWER_MODE_SLEEP,
    POWER_MODE_STOP,
} PowerMode_t;

void EnterPowerMode(PowerMode_t mode) {
    switch (mode) {
    case POWER_MODE_SLEEP:
        __WFI();
        break;
    case POWER_MODE_STOP:
        PreparePeripheralsForStop();
        PWR->CR |= PWR_CR_LPDS;
        SCB->SCR |= SCB_SCR_SLEEPDEEP_Msk;
        __WFI();
        RestorePeripherals();
        break;
    default:
        break;
    }
}
```

## Dynamic Clock Scaling

```c
typedef enum {
    CLOCK_SPEED_LOW,
    CLOCK_SPEED_MEDIUM,
    CLOCK_SPEED_HIGH,
} ClockSpeed_t;

void SetClockSpeed(ClockSpeed_t speed) {
    switch (speed) {
    case CLOCK_SPEED_LOW:
        ConfigureSystemClock48MHz();
        break;
    case CLOCK_SPEED_MEDIUM:
        ConfigureSystemClock84MHz();
        break;
    case CLOCK_SPEED_HIGH:
        ConfigureSystemClock168MHz();
        break;
    }
}
```

## Peripheral Power Management

```c
void DisableUnusedPeripherals(void) {
    RCC->APB1ENR &= ~(RCC_APB1ENR_SPI2EN | RCC_APB1ENR_I2C2EN);
    RCC->AHB1ENR &= ~(RCC_AHB1ENR_DMA1EN | RCC_AHB1ENR_DMA2EN);
}
```

## GPIO Power Optimization

```c
void ConfigureUnusedPins(void) {
    GPIOD->MODER = 0xFFFFFFFF;  /* Analog mode for lowest leakage */
    GPIOE->MODER = 0xFFFFFFFF;
}
```

## RTC Wakeup

```c
void RTC_Init_Wakeup(void) {
    RCC->APB1ENR |= RCC_APB1ENR_PWREN;
    PWR->CR |= PWR_CR_DBP;
    RTC->WPR = 0xCA;
    RTC->WPR = 0x53;
    RTC->CR |= RTC_CR_WUTE;
}
```

## Best Practices

- Use stop mode for long idle periods.
- Disable peripheral clocks when blocks are inactive.
- Batch work to reduce wake frequency.
- Reconfigure unused GPIOs to low-leakage states.
