# Communication Protocols

## I2C Master Implementation

```c
#include "stm32f4xx.h"

// I2C1 on PB6 (SCL) and PB7 (SDA)
void I2C_Init(void) {
    // Enable clocks
// ... (113 lines trimmed)
    if (!I2C_Write(addr, &reg, 1)) return false;
    return I2C_Read(addr, data, len);
}
```

## SPI Master Implementation

```c
// SPI1 on PA5 (SCK), PA6 (MISO), PA7 (MOSI)
void SPI_Init(void) {
    // Enable clocks
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;
    RCC->APB2ENR |= RCC_APB2ENR_SPI1EN;
// ... (77 lines trimmed)

    return timeout > 0;
}
```

## UART with Interrupt and Circular Buffer

```c
#define UART_RX_BUFFER_SIZE 256

typedef struct {
    uint8_t buffer[UART_RX_BUFFER_SIZE];
    uint16_t head;
// ... (63 lines trimmed)

    return count;
}
```

## CAN Bus Implementation

```c
// CAN on PB8 (RX) and PB9 (TX)
void CAN_Init(void) {
    // Enable clocks
    RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN;
    RCC->APB1ENR |= RCC_APB1ENR_CAN1EN;
// ... (93 lines trimmed)

    return true;
}
```

## Best Practices

- Always use timeouts to prevent infinite loops
- Implement error handling and recovery
- Use DMA for high-speed transfers
- Use interrupts to avoid polling
- Protect shared buffers with critical sections
- Validate received data (CRC, checksums)
- Implement protocol state machines properly
- Configure GPIO alternate functions correctly
- Calculate baud rates/timings accurately
