# Multi-Item Step Pattern

Use this when one step creates multiple similar artifacts.

## Flow

1. dispatch one implementation agent per item
2. wait for all item reports
3. dispatch one judge flow per item
4. aggregate pass/fail results across the set
5. revise only failed items instead of redoing the whole batch

## Use When

- generating several files from one spec step
- parallelizable artifact creation
- item-by-item scoring matters more than one aggregate judgment
