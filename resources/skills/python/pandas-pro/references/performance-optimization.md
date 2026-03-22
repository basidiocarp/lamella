# Performance Optimization

---

## Overview

Optimizing pandas performance is critical for production workflows. This reference covers memory optimization, vectorization, chunking, and profiling with pandas 2.0+.

---

## Memory Analysis

### Checking Memory Usage

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'id': range(1_000_000),
// ... (14 lines trimmed)
# Memory as percentage of total
memory_pct = (memory_usage / memory_usage.sum() * 100).round(2)
print(memory_pct)
```

### Memory Profiling Function

```python
def memory_profile(df: pd.DataFrame) -> pd.DataFrame:
    """Profile memory usage by column with optimization suggestions."""
    memory_bytes = df.memory_usage(deep=True)

    profile = pd.DataFrame({
// ... (29 lines trimmed)
    return profile

print(memory_profile(df))
```

---

## Memory Optimization Techniques

### Downcasting Numeric Types

```python
# Automatic downcasting for integers
df['count'] = pd.to_numeric(df['count'], downcast='integer')

# Automatic downcasting for floats
df['value'] = pd.to_numeric(df['value'], downcast='float')
// ... (14 lines trimmed)
df_optimized = downcast_dtypes(df)
print(f"Before: {df.memory_usage(deep=True).sum() / 1e6:.2f} MB")
print(f"After: {df_optimized.memory_usage(deep=True).sum() / 1e6:.2f} MB")
```

### Using Categorical Type

```python
# Convert low-cardinality string columns to category
# Especially effective when unique values << total rows

# Before
print(f"Object dtype: {df['category'].memory_usage(deep=True) / 1e6:.2f} MB")
// ... (13 lines trimmed)
            df[col] = df[col].astype('category')

    return df
```

### Sparse Data Types

```python
# For data with many repeated values (especially zeros/NaN)
sparse_series = pd.arrays.SparseArray([0, 0, 1, 0, 0, 0, 2, 0, 0, 0])

# Create sparse DataFrame
// ... (5 lines trimmed)
print(f"Sparse: {df_sparse['sparse_col'].memory_usage() / 1e6:.4f} MB")
print(f"Dense: {df_sparse['dense_col'].memory_usage() / 1e6:.4f} MB")
```

### Nullable Types (pandas 2.0+)

```python
# Use nullable types for proper NA handling with memory efficiency
df = df.astype({
    'id': 'Int32',          # Nullable int32
    'count': 'Int16',       # Nullable int16
// ... (6 lines trimmed)
df['name'] = df['name'].astype('string[pyarrow]')
df['category'] = df['category'].astype('category')
```

---

## Vectorization

### Replace Loops with Vectorized Operations

```python
# BAD: Row iteration (extremely slow)
result = []
for idx, row in df.iterrows():
    if row['value'] > 0:
// ... (9 lines trimmed)
df['result'] = 0
df.loc[df['value'] > 0, 'result'] = df.loc[df['value'] > 0, 'value'] * 2
```

### Multiple Conditions with np.select

```python
# BAD: Nested if-else in apply
def categorize(row):
    if row['value'] < -1:
        return 'very_low'
    elif row['value'] < 0:
// ... (13 lines trimmed)
]
choices = ['very_low', 'low', 'medium']
df['category'] = np.select(conditions, choices, default='high')
```

### String Operations - Vectorized

```python
# BAD: Apply for string operations
df['upper_name'] = df['name'].apply(lambda x: x.upper())

# GOOD: Vectorized string methods
// ... (7 lines trimmed)
    .str.replace(r'\s+', '_', regex=True)
)
```

### Avoid apply() When Possible

```python
# BAD: apply for row-wise calculation
df['total'] = df.apply(lambda row: row['a'] + row['b'] + row['c'], axis=1)

# GOOD: Direct vectorized operation
df['total'] = df['a'] + df['b'] + df['c']
// ... (13 lines trimmed)
        return row['value'] / row['divisor'] - row['adjustment']

# Consider rewriting as vectorized if performance critical
```

---

## Chunked Processing

### Reading Large Files in Chunks

```python
# Read CSV in chunks
chunk_size = 100_000
chunks = []

// ... (6 lines trimmed)
# Combine results
result = pd.concat(chunks).groupby(level=0).sum()
```

### Chunked Processing Function

```python
def process_large_csv(
    filepath: str,
    chunk_size: int = 100_000,
    filter_func=None,
    agg_func=None,
// ... (28 lines trimmed)
    filter_func=lambda df: df[df['value'] > 0],
    agg_func=lambda df: df.groupby('category').agg({'value': 'sum'}),
)
```

### Memory-Efficient Iteration

```python
# When you must iterate, use itertuples (not iterrows)
# itertuples is 10-100x faster than iterrows

# BAD: iterrows
// ... (6 lines trimmed)

# BEST: Vectorized operations (avoid iteration entirely)
```

---

## Query Optimization

### Efficient Filtering

```python
# Order matters - filter early, compute late
# BAD: Compute on all rows, then filter
df['expensive_calc'] = df['a'] * df['b'] + np.sin(df['c'])
result = df[df['category'] == 'A']

# GOOD: Filter first, compute on subset
mask = df['category'] == 'A'
result = df[mask].copy()
result['expensive_calc'] = result['a'] * result['b'] + np.sin(result['c'])
```

### Using query() for Performance

```python
# query() can be faster for large DataFrames (uses numexpr)
# Traditional boolean indexing
result = df[(df['value'] > 0) & (df['category'] == 'A')]

// ... (5 lines trimmed)
cat = 'A'
result = df.query('value > @threshold and category == @cat')
```

### eval() for Complex Expressions

```python
# eval() uses numexpr for faster computation
# Standard pandas
df['result'] = df['a'] + df['b'] * df['c'] - df['d']

# Using eval (faster for large DataFrames)
df['result'] = pd.eval('df.a + df.b * df.c - df.d')

# In-place with inplace parameter
df.eval('result = a + b * c - d', inplace=True)
```

---

## GroupBy Optimization

### Pre-sort for Faster GroupBy

```python
# Sort by groupby column first
df = df.sort_values('category')

# Use sort=False since already sorted
result = df.groupby('category', sort=False)['value'].mean()
```

### Use Built-in Aggregations

```python
# BAD: Custom function via apply
result = df.groupby('category')['value'].apply(lambda x: x.mean())

# GOOD: Built-in aggregation
result = df.groupby('category')['value'].mean()

# Built-in aggregations available:
# sum, mean, median, min, max, std, var, count, first, last, nth
# size, sem, prod, cumsum, cummax, cummin, cumprod
```

### Observed Categories

```python
# For categorical columns, use observed=True (pandas 2.0+ default)
df['category'] = df['category'].astype('category')

# Avoid computing for unobserved categories
result = df.groupby('category', observed=True)['value'].mean()
```

---

## I/O Optimization

### Efficient File Formats

```python
# Parquet - best for analytical workloads
df.to_parquet('data.parquet', compression='snappy')
df = pd.read_parquet('data.parquet')

# Feather - best for pandas interchange
// ... (8 lines trimmed)
    usecols=['id', 'category', 'value'],  # Only needed columns
    nrows=10000,  # Limit rows for testing
)
```

### Specify dtypes When Reading

```python
# Specify dtypes upfront to avoid inference overhead
dtypes = {
    'id': 'int32',
    'name': 'string',
    'category': 'category',
// ... (10 lines trimmed)
    parse_dates=['date_column'],
    date_format='%Y-%m-%d',  # Explicit format is faster
)
```

---

## Profiling and Benchmarking

### Timing Operations

```python
import time

# Simple timing
start = time.time()
// ... (5 lines trimmed)
# %%timeit
# df.groupby('category')['value'].mean()
```

### Memory Profiling

```python
# Track memory before/after
import tracemalloc

tracemalloc.start()
// ... (7 lines trimmed)

tracemalloc.stop()
```

### Comparison Template

```python
def benchmark_operations(df: pd.DataFrame, operations: dict, n_runs: int = 5):
    """Benchmark multiple operations."""
    results = {}

    for name, func in operations.items():
// ... (20 lines trimmed)

benchmark_results = benchmark_operations(df.head(10000), operations)
print(benchmark_results)
```

---

## Best Practices Summary

1. **Profile first** - Identify actual bottlenecks before optimizing
2. **Use appropriate dtypes** - int32/float32/category save memory
3. **Vectorize everything** - Avoid loops and apply when possible
4. **Filter early** - Reduce data before expensive operations
5. **Chunk large files** - Process in manageable pieces
6. **Use efficient file formats** - Parquet/Feather over CSV
7. **Leverage built-in methods** - Faster than custom functions

---

## Performance Checklist

Before deploying pandas code:

- [ ] Memory profiled with `memory_usage(deep=True)`
- [ ] Dtypes optimized (downcast, categorical)
- [ ] No iterrows/itertuples in hot paths
- [ ] GroupBy uses built-in aggregations
- [ ] Large files processed in chunks
- [ ] Filters applied before computations
- [ ] Appropriate file format used
- [ ] Benchmarked with representative data size

---

## Anti-Patterns Summary

| Anti-Pattern | Alternative |
|--------------|-------------|
| `iterrows()` for computation | Vectorized operations |
| `apply(lambda)` for simple ops | Built-in methods |
| Loading entire large file | Chunked reading |
| String columns with low cardinality | Category dtype |
| int64 for small integers | int32/int16 |
| Multiple separate filters | Combined boolean mask |
| Repeated groupby calls | Single groupby with multiple aggs |

---

## Related References

- `dataframe-operations.md` - Efficient indexing and filtering
- `aggregation-groupby.md` - Optimized aggregation patterns
- `merging-joining.md` - Efficient merge strategies
