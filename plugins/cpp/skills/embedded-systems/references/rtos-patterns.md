# RTOS Patterns

## Task Creation

```c
#include "FreeRTOS.h"
#include "queue.h"
#include "semphr.h"
#include "task.h"

static void vSensorTask(void *arg) {
    for (;;) {
        ReadSensors();
        vTaskDelay(pdMS_TO_TICKS(20));
    }
}

static void vProcessingTask(void *arg) {
    for (;;) {
        ProcessTelemetry();
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}

void InitTasks(void) {
    xTaskCreate(vSensorTask, "Sensor", 256, NULL, 2, NULL);
    xTaskCreate(vProcessingTask, "Process", 384, NULL, 3, NULL);
}
```

## Queue Communication

```c
QueueHandle_t xDataQueue;

void InitQueues(void) {
    xDataQueue = xQueueCreate(8, sizeof(SensorSample_t));
}

void vProducerTask(void *arg) {
    SensorSample_t sample;
    for (;;) {
        sample = ReadSample();
        xQueueSend(xDataQueue, &sample, portMAX_DELAY);
    }
}

void vConsumerTask(void *arg) {
    SensorSample_t sample;
    for (;;) {
        if (xQueueReceive(xDataQueue, &sample, portMAX_DELAY) == pdPASS) {
            HandleSample(sample);
        }
    }
}
```

## Mutexes and Critical Sections

```c
SemaphoreHandle_t xI2CMutex;

void InitMutexes(void) {
    xI2CMutex = xSemaphoreCreateMutex();
}

void ReadSharedSensor(void) {
    if (xSemaphoreTake(xI2CMutex, pdMS_TO_TICKS(20)) == pdTRUE) {
        ReadSensorOverI2C();
        xSemaphoreGive(xI2CMutex);
    }
}
```

## Task Notifications

```c
TaskHandle_t xWorkerTaskHandle;

void EXTI_IRQHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    vTaskNotifyGiveFromISR(xWorkerTaskHandle, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}

void vWorkerTask(void *arg) {
    for (;;) {
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
        HandleInterruptWork();
    }
}
```

## Best Practices

- Use `vTaskDelayUntil()` for periodic work to avoid drift.
- Prefer task notifications over semaphores for one-to-one ISR signaling.
- Keep ISRs short and push work into tasks.
- Watch stack high-water marks and tune task stack sizes.
