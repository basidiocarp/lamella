# DataFrame Operations

---

## Overview

DataFrame operations form the foundation of pandas work. This reference covers indexing, selection, filtering, and sorting with pandas 2.0+ best practices.

---

## Indexing and Selection

### Label-Based Selection with `.loc[]`

Use `.loc[]` for label-based indexing. Always preferred over chained indexing.

```python
import pandas as pd
import numpy as np

# Sample DataFrame
df = pd.DataFrame({
// ... (26 lines trimmed)
    (df['department'] == 'Engineering') & (df['age'] >= 30),
    ['name', 'salary']
]
```

### Position-Based Selection with `.iloc[]`

Use `.iloc[]` for integer position-based indexing.

```python
# Single value by position
value = df.iloc[0, 0]  # First row, first column

# Single row by position
// ... (8 lines trimmed)
# Range selection
block = df.iloc[1:3, 0:2]  # Rows 1-2, columns 0-1
```

### When to Use `.loc[]` vs `.iloc[]`

| Scenario | Use | Example |
|----------|-----|---------|
| Known column names | `.loc[]` | `df.loc[:, 'name']` |
| Filter by condition | `.loc[]` | `df.loc[df['age'] > 25]` |
| First/last N rows | `.iloc[]` | `df.iloc[:5]` or `df.iloc[-5:]` |
| Specific row positions | `.iloc[]` | `df.iloc[[0, 5, 10]]` |
| Unknown column order | `.iloc[]` | `df.iloc[:, 0]` |

---

## Filtering DataFrames

### Boolean Masks

```python
# Single condition
mask = df['age'] > 25
filtered = df[mask]

// ... (9 lines trimmed)
mask = ~(df['department'] == 'Marketing')
filtered = df[mask]
```

### Using `.query()` for Readable Filters

```python
# Simple query - more readable for complex conditions
result = df.query('age > 25 and salary < 65000')

# Using variables with @
min_age = 25
// ... (8 lines trimmed)

# Complex expressions
result = df.query('(age > 25) and (department != "Marketing")')
```

### Using `.isin()` for Multiple Values

```python
# Filter by multiple values
departments = ['Engineering', 'Sales']
filtered = df[df['department'].isin(departments)]

// ... (8 lines trimmed)
# Filter where department is in list AND age is in list
mask = df['department'].isin(conditions['department']) & df['age'].isin(conditions['age'])
```

### String Filtering with `.str` Accessor

```python
df = pd.DataFrame({
    'email': ['alice@example.com', 'bob@test.org', 'charlie@example.com'],
    'name': ['Alice Smith', 'Bob Jones', 'Charlie Brown']
})

// ... (14 lines trimmed)

# Handle NaN in string columns
mask = df['email'].str.contains('example', na=False)
```

---

## Sorting

### Basic Sorting

```python
# Sort by single column (ascending)
sorted_df = df.sort_values('age')

# Sort descending
// ... (6 lines trimmed)
sorted_df = df.sort_index()
sorted_df = df.sort_index(ascending=False)
```

### Advanced Sorting

```python
# Sort with NaN handling
df_with_nan = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'score': [85.0, np.nan, 90.0]
})
// ... (11 lines trimmed)

# Sort by computed values without adding column
sorted_df = df.iloc[df['name'].str.len().argsort()]
```

### In-Place Sorting

```python
# Modify DataFrame in place
df.sort_values('age', inplace=True)

# Reset index after sorting
df.sort_values('age', inplace=True)
df.reset_index(drop=True, inplace=True)

# Or chain
df = df.sort_values('age').reset_index(drop=True)
```

---

## Column Operations

### Adding and Modifying Columns

```python
# Add new column
df['bonus'] = df['salary'] * 0.1

# Conditional column with np.where
df['seniority'] = np.where(df['age'] >= 30, 'Senior', 'Junior')
// ... (12 lines trimmed)
    bonus=lambda x: x['salary'] * 0.1,
    total_comp=lambda x: x['salary'] + x['salary'] * 0.1
)
```

### Renaming Columns

```python
# Rename specific columns
df = df.rename(columns={'name': 'full_name', 'age': 'years'})

# Rename all columns with function
df.columns = df.columns.str.lower().str.replace(' ', '_')

# Using rename with function
df = df.rename(columns=str.upper)
```

### Dropping Columns

```python
# Drop single column
df = df.drop('bonus', axis=1)
# Or
df = df.drop(columns=['bonus'])
// ... (5 lines trimmed)
cols_to_drop = [col for col in df.columns if col.startswith('temp_')]
df = df.drop(columns=cols_to_drop)
```

### Reordering Columns

```python
# Explicit order
new_order = ['name', 'department', 'age', 'salary']
df = df[new_order]

# Move specific column to front
cols = ['salary'] + [c for c in df.columns if c != 'salary']
df = df[cols]

# Using .reindex()
df = df.reindex(columns=['name', 'age', 'salary', 'department'])
```

---

## Index Operations

### Setting and Resetting Index

```python
# Set column as index
df = df.set_index('name')

# Reset index back to column
// ... (5 lines trimmed)
# Set multiple columns as index (MultiIndex)
df = df.set_index(['department', 'name'])
```

### Working with MultiIndex

```python
# Create MultiIndex DataFrame
df = pd.DataFrame({
    'department': ['Eng', 'Eng', 'Sales', 'Sales'],
    'team': ['Backend', 'Frontend', 'East', 'West'],
    'headcount': [10, 8, 15, 12]
// ... (8 lines trimmed)

# Reset specific level
df.reset_index(level='team')
```

---

## Copying DataFrames

### When to Use `.copy()`

```python
# ALWAYS copy when modifying a subset
subset = df[df['age'] > 25].copy()
subset['new_col'] = 100  # Safe, no SettingWithCopyWarning

// ... (8 lines trimmed)
# Shallow copy - shares data, only copies structure
df_shallow = df.copy(deep=False)
```

---

## Best Practices Summary

1. **Use `.loc[]` and `.iloc[]`** - Never use chained indexing
2. **Parenthesize conditions** - `(cond1) & (cond2)` not `cond1 & cond2`
3. **Use `.query()` for readability** - Especially with complex filters
4. **Copy before modifying subsets** - Always use `.copy()`
5. **Use vectorized operations** - Avoid row iteration for filtering
6. **Handle NaN explicitly** - Use `na=False` in string operations
7. **Prefer method chaining** - Use `.assign()` for column creation

---

## Anti-Patterns to Avoid

```python
# BAD: Chained indexing
df['A']['B'] = value  # May not work, raises warning

# GOOD: Use .loc
df.loc[:, ('A', 'B')] = value
// ... (15 lines trimmed)

# GOOD: Combined filter
df = df[(df['age'] > 25) & (df['salary'] > 50000)]
```

---

## Related References

- `data-cleaning.md` - After selection, clean the data
- `aggregation-groupby.md` - Group and aggregate filtered data
- `performance-optimization.md` - Optimize filtering on large datasets
