# Aggregation and GroupBy

---

## Overview

Aggregation transforms data from individual records to summary statistics. This reference covers GroupBy, pivot tables, crosstab, and advanced aggregation patterns with pandas 2.0+.

---

## GroupBy Fundamentals

### Basic GroupBy

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'department': ['Eng', 'Eng', 'Sales', 'Sales', 'Eng', 'HR'],
// ... (14 lines trimmed)

# Reset index to get DataFrame instead of Series
grouped = df.groupby('department')['salary'].mean().reset_index()
```

### Multiple Columns, Multiple Aggregations

```python
# Named aggregation (pandas 2.0+ preferred)
result = df.groupby('department').agg(
    avg_salary=('salary', 'mean'),
    max_salary=('salary', 'max'),
    total_years=('years', 'sum'),
// ... (8 lines trimmed)

# Flatten multi-level column names
result.columns = ['_'.join(col).strip() for col in result.columns.values]
```

### Custom Aggregation Functions

```python
# Lambda functions
result = df.groupby('department').agg({
    'salary': lambda x: x.max() - x.min(),  # Range
    'years': lambda x: x.quantile(0.75),    # 75th percentile
})
// ... (16 lines trimmed)
    ('iqr', lambda x: x.quantile(0.75) - x.quantile(0.25)),
    ('median', 'median'),
])
```

---

## Transform and Apply

### Transform - Returns Same Shape

```python
# Transform returns Series with same index as original
# Useful for adding aggregated values back to original DataFrame

# Add group mean as new column
df['dept_avg_salary'] = df.groupby('department')['salary'].transform('mean')
// ... (15 lines trimmed)
df['salary'] = df.groupby('department')['salary'].transform(
    lambda x: x.fillna(x.mean())
)
```

### Apply - Flexible Operations

```python
# Apply runs function on each group DataFrame
def top_n_by_salary(group, n=2):
    return group.nlargest(n, 'salary')

top_earners = df.groupby('department').apply(top_n_by_salary, n=2)
// ... (13 lines trimmed)
    })

summary = df.groupby('department').apply(group_summary)
```

### Filter - Keep/Remove Groups

```python
# Keep only groups meeting a condition
# Groups with average salary > 70000
filtered = df.groupby('department').filter(lambda x: x['salary'].mean() > 70000)

// ... (5 lines trimmed)
    lambda x: (len(x) >= 2) and (x['salary'].mean() > 65000)
)
```

---

## Pivot Tables

### Basic Pivot Table

```python
df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=6),
    'product': ['A', 'B', 'A', 'B', 'A', 'B'],
    'region': ['East', 'East', 'West', 'West', 'East', 'West'],
    'sales': [100, 150, 120, 180, 90, 200],
// ... (23 lines trimmed)
    columns='region',
    aggfunc=['sum', 'mean', 'count']
)
```

### Advanced Pivot Table Options

```python
# Fill missing values
pivot = df.pivot_table(
    values='sales',
    index='product',
    columns='region',
// ... (27 lines trimmed)
    aggfunc='sum',
    observed=True  # pandas 2.0+ default changed
)
```

### Unpivoting (Melt)

```python
# Wide to long format
wide_df = pd.DataFrame({
    'product': ['A', 'B'],
    'Q1_sales': [100, 150],
    'Q2_sales': [120, 180],
// ... (11 lines trimmed)

# Clean quarter column
long_df['quarter'] = long_df['quarter'].str.replace('_sales', '')
```

---

## Crosstab

### Basic Crosstab

```python
df = pd.DataFrame({
    'gender': ['M', 'F', 'M', 'F', 'M', 'F', 'M', 'M'],
    'department': ['Eng', 'Eng', 'Sales', 'Sales', 'Eng', 'HR', 'HR', 'Eng'],
    'level': ['Senior', 'Junior', 'Senior', 'Senior', 'Junior', 'Junior', 'Senior', 'Junior'],
})
// ... (14 lines trimmed)
    [df['gender'], df['level']],
    df['department']
)
```

### Crosstab with Aggregation

```python
df['salary'] = [80000, 75000, 65000, 70000, 85000, 60000, 72000, 78000]

# Crosstab with values and aggregation
ct = pd.crosstab(
    df['gender'],
// ... (9 lines trimmed)
    values=df['salary'],
    aggfunc=['mean', 'sum', 'count']
)
```

---

## Window Functions with GroupBy

### Rolling Aggregations

```python
df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=10),
    'product': ['A', 'B'] * 5,
    'sales': [100, 150, 110, 160, 120, 170, 130, 180, 140, 190],
})
// ... (12 lines trimmed)

# Rank within groups
df['sales_rank'] = df.groupby('product')['sales'].rank(method='dense')
```

### Shift and Diff

```python
# Previous value within group
df['prev_sales'] = df.groupby('product')['sales'].shift(1)

# Next value
// ... (5 lines trimmed)
# Percentage change
df['sales_pct_change'] = df.groupby('product')['sales'].pct_change()
```

---

## Common Aggregation Patterns

### Summary Statistics

```python
# Comprehensive summary by group
def full_summary(group):
    return pd.Series({
        'count': len(group),
// ... (9 lines trimmed)

summary = df.groupby('department').apply(full_summary)
```

### Top N Per Group

```python
# Top 2 salaries per department
top_2 = df.groupby('department', group_keys=False).apply(
    lambda x: x.nlargest(2, 'salary')
)
// ... (8 lines trimmed)
    lambda x: x.nsmallest(2, 'salary')
)
```

### First/Last Per Group

```python
# First row per group
first = df.groupby('department').first()

# Last row per group
// ... (7 lines trimmed)
# Nth row
nth = df.groupby('department').nth(1)  # Second row (0-indexed)
```

### Cumulative Operations

```python
# Cumulative sum
df['cum_sales'] = df.groupby('department')['salary'].cumsum()

# Cumulative max/min
// ... (8 lines trimmed)
    lambda x: x.cumsum() / x.sum() * 100
)
```

---

## Performance Tips for GroupBy

### Efficient GroupBy Operations

```python
# Pre-sort for faster groupby operations
df = df.sort_values('department')
grouped = df.groupby('department', sort=False)  # Already sorted

# Use observed=True for categorical columns (pandas 2.0+ default)
// ... (10 lines trimmed)
@numba.jit(nopython=True)
def custom_agg(values):
    return values.sum() / len(values)
```

### Memory-Efficient Aggregation

```python
# For large DataFrames, compute aggregations separately
groups = df.groupby('department')

means = groups['salary'].mean()
sums = groups['salary'].sum()
// ... (13 lines trimmed)
group_stats = df.groupby('department')['salary'].agg(['mean', 'std'])
df = df.merge(group_stats, on='department')
df['z_score'] = (df['salary'] - df['mean']) / df['std']
```

---

## Best Practices Summary

1. **Use named aggregation** - Clearer than dictionary syntax
2. **Choose transform vs apply wisely** - Transform for same-shape, apply for flexible
3. **Pre-sort for performance** - Use `sort=False` after sorting
4. **Prefer built-in aggregations** - Faster than lambda/apply
5. **Use observed=True** - Especially for categorical data
6. **Reset index when needed** - Keep DataFrames easier to work with
7. **Validate group counts** - Check for unexpected groups

---

## Anti-Patterns to Avoid

```python
# BAD: Iterating over groups manually
for name, group in df.groupby('department'):
    # process group
    pass

// ... (13 lines trimmed)

# GOOD: Built-in method
df.groupby('dept')['salary'].mean()
```

---

## Related References

- `dataframe-operations.md` - Filtering before aggregation
- `merging-joining.md` - Join aggregated results back
- `performance-optimization.md` - Optimize large-scale aggregations
