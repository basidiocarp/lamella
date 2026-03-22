# RTOS Patterns

## Task Creation and Management

```c
#include "FreeRTOS.h"
#include "task.h"
#include "queue.h"
#include "semphr.h"

// ... (44 lines trimmed)
    xTaskCreate(vProcessingTask, "Process", STACK_SIZE_PROCESS, NULL,
                PRIORITY_PROCESSING, &xProcessTaskHandle);
}
```

## Queue Communication

```c
// Queue creation and usage
QueueHandle_t xDataQueue;
QueueHandle_t xCommandQueue;

void InitQueues(void) {
// ... (37 lines trimmed)
        }
    }
}
```

## Mutex and Critical Sections

```c
SemaphoreHandle_t xI2CMutex;
SemaphoreHandle_t xUARTMutex;

void InitMutexes(void) {
    xI2CMutex = xSemaphoreCreateMutex();
// ... (26 lines trimmed)
    g_shared_counter++;
    taskEXIT_CRITICAL();
}
```

## Binary Semaphores (Signaling)

```c
SemaphoreHandle_t xDataReadySemaphore;

// Interrupt signals task
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
// ... (15 lines trimmed)
        }
    }
}
```

## Software Timers

```c
TimerHandle_t xWatchdogTimer;
TimerHandle_t xBlinkTimer;

void vWatchdogCallback(TimerHandle_t xTimer) {
    // Periodic watchdog check
// ... (19 lines trimmed)
    xTimerStart(xWatchdogTimer, 0);
    xTimerStart(xBlinkTimer, 0);
}
```

## Event Groups

```c
EventGroupHandle_t xSystemEvents;

#define EVENT_SENSOR_READY   (1 << 0)
#define EVENT_COMM_READY     (1 << 1)
#define EVENT_CALIBRATED     (1 << 2)
// ... (23 lines trimmed)
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}
```

## Memory Management

```c
// FreeRTOSConfig.h settings
#define configTOTAL_HEAP_SIZE           ((size_t)(20 * 1024))  // 20KB heap
#define configMINIMAL_STACK_SIZE        ((uint16_t)128)
#define configUSE_MALLOC_FAILED_HOOK    1

// ... (17 lines trimmed)
    printf("MALLOC FAILED\n");
    Error_Handler();
}
```

## Task Notifications (Lightweight Alternative)

```c
TaskHandle_t xWorkerTaskHandle;

// ISR notifies task (faster than semaphore)
void EXTI_IRQHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
// ... (16 lines trimmed)
        }
    }
}
```

## Best Practices

- Use `vTaskDelayUntil()` for periodic tasks (prevents drift)
- Keep ISRs short - defer work to tasks via queues/semaphores
- Size stacks appropriately (monitor with `uxTaskGetStackHighWaterMark()`)
- Use task notifications instead of semaphores when possible (lower overhead)
- Protect shared resources with mutexes, not critical sections (unless very short)
- Configure watchdog for production builds
- Monitor heap usage to prevent fragmentation
- Use priority inheritance mutexes to avoid priority inversion
