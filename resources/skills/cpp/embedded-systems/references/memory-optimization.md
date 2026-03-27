# Memory Optimization

## Code Size

```c
/* Compiler and linker flags for size-sensitive builds
 * -Os
 * -ffunction-sections -fdata-sections
 * -Wl,--gc-sections
 * -flto
 */
```

Prefer removing unused code and data before hand-tuning hot paths.

## RAM Optimization

```c
#define BUFFER_SIZE 256
static uint8_t shared_buffer[BUFFER_SIZE];

void ProcessA(void) {
    /* Use shared_buffer while task A is active */
}

void ProcessB(void) {
    /* Reuse the same buffer when task B runs later */
}
```

## Flash Storage

```c
const uint16_t sine_table[8] = {0, 707, 1000, 707, 0, 65329, 64536, 65329};

const uint8_t device_name[] = "sensor-node";
```

Use `const` for read-only tables and configuration so they stay in flash.

## Stack Monitoring

```c
void CheckStackUsage(void) {
    UBaseType_t high_water = uxTaskGetStackHighWaterMark(NULL);
    printf("Stack remaining: %u words\n", (unsigned)high_water);
}
```

## Packed Data Structures

```c
typedef struct __attribute__((packed)) {
    uint32_t timestamp;
    uint16_t value;
    uint8_t status;
} DataRecord_t;

_Static_assert(sizeof(DataRecord_t) == 7, "Unexpected padding");
```

## Linker Awareness

```c
extern uint32_t _sdata;
extern uint32_t _edata;
extern uint32_t _sbss;
extern uint32_t _ebss;
```

Use the map file and linker symbols to confirm actual RAM and flash usage rather
than guessing from source structure.

## Best Practices

- Use the smallest type that fits the range.
- Prefer static allocation over fragmented dynamic allocation.
- Share buffers when execution phases do not overlap.
- Validate struct sizes with `static_assert`.
