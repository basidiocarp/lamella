# Microcontroller Programming

## GPIO Configuration (STM32)

```c
#include "stm32f4xx.h"

// Configure GPIO pin as output
void GPIO_Init_Output(GPIO_TypeDef *port, uint32_t pin) {
    // Enable clock for GPIO port
// ... (46 lines trimmed)
        port->BSRR = (1 << (pin + 16));  // Reset
    }
}
```

## Timer Configuration

```c
// Configure TIM2 for 1kHz interrupt (84MHz clock)
void Timer_Init_1kHz(void) {
    // Enable TIM2 clock
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;

// ... (49 lines trimmed)
void PWM_SetDutyCycle(uint16_t duty) {
    TIM3->CCR1 = duty;
}
```

## External Interrupt (EXTI)

```c
// Configure PA0 as external interrupt (rising edge)
void EXTI_Init_PA0(void) {
    // Enable GPIOA and SYSCFG clocks
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;
// ... (23 lines trimmed)
        Button_Pressed();
    }
}
```

## ADC Configuration

```c
// Configure ADC1 for single conversion
void ADC_Init(void) {
    // Enable ADC1 clock
    RCC->APB2ENR |= RCC_APB2ENR_ADC1EN;

// ... (61 lines trimmed)
    // Start conversion
    ADC1->CR2 |= ADC_CR2_SWSTART;
}
```

## UART Communication

```c
// Configure USART2 (115200 baud, 8N1)
void UART_Init(void) {
    // Enable USART2 and GPIOA clocks
    RCC->APB1ENR |= RCC_APB1ENR_USART2EN;
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
// ... (28 lines trimmed)
        UART_SendByte(*str++);
    }
}
```

## System Clock Configuration

```c
// Configure system clock to 168MHz (STM32F4)
void SystemClock_Config(void) {
    // Enable HSE
    RCC->CR |= RCC_CR_HSEON;
    while (!(RCC->CR & RCC_CR_HSERDY));
// ... (26 lines trimmed)
    // Update SystemCoreClock variable
    SystemCoreClock = 168000000;
}
```

## Watchdog Timer

```c
// Configure independent watchdog (IWDG)
void Watchdog_Init(void) {
    // Enable write access to IWDG registers
    IWDG->KR = 0x5555;

// ... (14 lines trimmed)
void Watchdog_Refresh(void) {
    IWDG->KR = 0xAAAA;
}
```

## Low-Power Modes

```c
// Enter sleep mode (CPU stopped, peripherals running)
void Enter_Sleep(void) {
    __WFI();  // Wait for interrupt
}

// ... (31 lines trimmed)

    __WFI();
}
```

## Best Practices

- Always use `volatile` for hardware register access
- Use bit-banding for atomic single-bit operations
- Clear interrupt flags in ISRs to prevent re-entry
- Configure clock tree before enabling peripherals
- Use BSRR register for atomic GPIO writes
- Enable interrupts with appropriate priorities
- Add timeout checks for polling operations
- Protect RMW operations with critical sections if needed
