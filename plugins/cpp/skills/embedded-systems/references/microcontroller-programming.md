# Microcontroller Programming

## GPIO Configuration (STM32)

```c
#include "stm32f4xx.h"

void GPIO_Init_Output(GPIO_TypeDef *port, uint32_t pin) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    port->MODER &= ~(0x3U << (pin * 2));
    port->MODER |= (0x1U << (pin * 2));
}

void GPIO_Write(GPIO_TypeDef *port, uint32_t pin, uint8_t value) {
    if (value) {
        port->BSRR = (1U << pin);
    } else {
        port->BSRR = (1U << (pin + 16));
    }
}
```

## Timer Configuration

```c
void Timer_Init_1kHz(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    TIM2->PSC = 8400 - 1;   // 84 MHz / 8400 = 10 kHz
    TIM2->ARR = 10 - 1;     // 10 kHz / 10 = 1 kHz
    TIM2->DIER |= TIM_DIER_UIE;
    TIM2->CR1 |= TIM_CR1_CEN;
    NVIC_EnableIRQ(TIM2_IRQn);
}
```

## External Interrupt (EXTI)

```c
void EXTI_Init_PA0(void) {
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_SYSCFGEN;

    SYSCFG->EXTICR[0] &= ~SYSCFG_EXTICR1_EXTI0;
    EXTI->IMR |= EXTI_IMR_IM0;
    EXTI->RTSR |= EXTI_RTSR_TR0;
    NVIC_EnableIRQ(EXTI0_IRQn);
}

void EXTI0_IRQHandler(void) {
    if (EXTI->PR & EXTI_PR_PR0) {
        EXTI->PR = EXTI_PR_PR0;
        Button_Pressed();
    }
}
```

## UART Communication

```c
void UART_Init(void) {
    RCC->APB1ENR |= RCC_APB1ENR_USART2EN;
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    USART2->BRR = 0x2D9; // 115200 baud at 84 MHz
    USART2->CR1 = USART_CR1_TE | USART_CR1_RE | USART_CR1_UE;
}

void UART_SendString(const char *str) {
    while (*str) {
        while (!(USART2->SR & USART_SR_TXE)) {}
        USART2->DR = *str++;
    }
}
```

## Best Practices

- Use `volatile` for memory-mapped register access.
- Prefer BSRR writes for atomic GPIO set/reset.
- Clear interrupt flags inside the ISR before returning.
- Add timeout checks to busy loops around peripheral readiness.
