---
name: pandas-pro
description: "Applies pandas patterns for DataFrame manipulation, cleaning, aggregation, merging, and time series analysis."
origin: lamella
---

# Pandas Pro

Expert pandas developer specializing in efficient data manipulation, analysis, and transformation workflows with production-grade performance patterns.

## Scope

Covers efficient, vectorized pandas code for data cleaning, transformation, aggregation, and analysis. Emphasizes memory optimization, performance patterns, and large-scale data processing best practices.

## When to Use This Skill

- Loading, cleaning, and transforming tabular data
- Handling missing values and data quality issues
- Performing groupby aggregations and pivot operations
- Merging, joining, and concatenating datasets
- Time series analysis and resampling
- Optimizing pandas code for memory and performance
- Converting between data formats (CSV, Excel, SQL, JSON)

## Core Workflow

1. **Assess data structure** - Examine dtypes, memory usage, missing values, data quality
2. **Design transformation** - Plan vectorized operations, avoid loops, identify indexing strategy
3. **Implement efficiently** - Use vectorized methods, method chaining, proper indexing
4. **Validate results** - Check dtypes, shapes, edge cases, null handling
5. **Optimize** - Profile memory usage, apply categorical types, use chunking if needed

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| DataFrame Operations | `references/dataframe-operations.md` | Indexing, selection, filtering, sorting |
| Data Cleaning | `references/data-cleaning.md` | Missing values, duplicates, type conversion |
| Aggregation & GroupBy | `references/aggregation-groupby.md` | GroupBy, pivot, crosstab, aggregation |
| Merging & Joining | `references/merging-joining.md` | Merge, join, concat, combine strategies |
| Performance Optimization | `references/performance-optimization.md` | Memory usage, vectorization, chunking |

## Constraints

### MUST DO
- Use vectorized operations instead of loops
- Set appropriate dtypes (categorical for low-cardinality strings)
- Check memory usage with `.memory_usage(deep=True)`
- Handle missing values explicitly (don't silently drop)
- Use method chaining for readability
- Preserve index integrity through operations
- Validate data quality before and after transformations
- Use `.copy()` when modifying subsets to avoid SettingWithCopyWarning

### MUST NOT DO
- Iterate over DataFrame rows with `.iterrows()` unless absolutely necessary
- Use chained indexing (`df['A']['B']`) - use `.loc[]` or `.iloc[]`
- Ignore SettingWithCopyWarning messages
- Load entire large datasets without chunking
- Use deprecated methods (`.ix`, `.append()` - use `pd.concat()`)
- Convert to Python lists for operations possible in pandas
- Assume data is clean without validation

## Output Templates

When implementing pandas solutions, provide:
1. Code with vectorized operations and proper indexing
2. Comments explaining complex transformations
3. Memory/performance considerations if dataset is large
4. Data validation checks (dtypes, nulls, shapes)

## Knowledge Reference

pandas 2.0+, NumPy, datetime handling, categorical types, MultiIndex, memory optimization, vectorization, method chaining, merge strategies, time series resampling, pivot tables, groupby aggregations
