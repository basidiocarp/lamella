# Memory Optimization

## Code Size Optimization

```c
// Compiler flags for size optimization:
// -Os               : Optimize for size
// -ffunction-sections -fdata-sections : Separate functions/data
// -Wl,--gc-sections : Remove unused sections

// ... (28 lines trimmed)

// Avoid unnecessary includes
// Only include what you need
```

## RAM Optimization

```c
// Share buffers when possible
#define BUFFER_SIZE 256
static uint8_t shared_buffer[BUFFER_SIZE];

void ProcessA(void) {
// ... (60 lines trimmed)
        block->in_use = false;
    }
}
```

## Flash Memory Management

```c
// Store constants in flash with PROGMEM (AVR example)
// Or use const in ARM (automatically placed in flash)

// Large lookup tables
const uint16_t sine_table[360] = {
// ... (57 lines trimmed)

    return Flash_WriteRecord(id, data);
}
```

## Stack Optimization

```c
// Monitor stack usage (FreeRTOS)
void CheckStackUsage(void) {
    UBaseType_t high_water = uxTaskGetStackHighWaterMark(NULL);
    printf("Stack remaining: %u words\n", high_water);
}
// ... (34 lines trimmed)

    return prev1;
}
```

## Data Structure Optimization

```c
// Packed structures to save RAM
typedef struct {
    uint32_t timestamp;
    uint16_t value;
    uint8_t status;
// ... (48 lines trimmed)
    State_t state : 3;  // Only 3 bits needed for 4 states
    uint8_t retry_count : 5;
} StateMachine_t;
```

## Memory Monitoring

```c
// Linker script symbols
extern uint32_t _estack;
extern uint32_t _sdata;
extern uint32_t _edata;
extern uint32_t _sbss;
// ... (40 lines trimmed)

    return stack_top - addr;
}
```

## Compile-Time Memory Analysis

```c
// Use static_assert to enforce limits
_Static_assert(sizeof(DataRecord_t) <= 16, "DataRecord too large");
_Static_assert(sizeof(StatusReg_t) == 1, "StatusReg not packed");

// Compile-time size calculations
// ... (10 lines trimmed)
        // Safe access
    }
}
```

## Optimization Techniques Summary

```c
// 1. Use smallest appropriate data types
uint8_t  counter;        // Not int
bool     flag;           // Not int

// 2. Pack structures
// ... (32 lines trimmed)
// 10. Profile and measure
// Use .map file to identify large symbols
// Use size tool: arm-none-eabi-size firmware.elf
```

## Linker Script Customization

```ld
/* Custom linker script sections */
MEMORY
{
    FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 512K
    RAM (rwx)   : ORIGIN = 0x20000000, LENGTH = 128K
// ... (27 lines trimmed)
        _heap_end = .;
    } > RAM
}
```

## Best Practices

- Use const for all read-only data
- Prefer static allocation over dynamic
- Pack structures with `__attribute__((packed))`
- Use smallest data types possible
- Share buffers when tasks don't overlap
- Monitor heap and stack usage regularly
- Enable link-time optimization (-flto)
- Remove unused code with -ffunction-sections
- Profile with .map file and size tool
- Test with minimal memory configuration
