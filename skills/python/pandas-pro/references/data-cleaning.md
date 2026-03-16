# Data Cleaning

---

## Overview

Data cleaning is critical for reliable analysis. This reference covers handling missing values, duplicates, type conversion, and data validation with pandas 2.0+ patterns.

---

## Missing Values

### Detecting Missing Values

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Diana'],
// ... (25 lines trimmed)
    'percent': (df.isna().sum() / len(df) * 100).round(2),
    'dtype': df.dtypes
})
```

### Handling Missing Values - Dropping

```python
# Drop rows with any missing value
df_clean = df.dropna()

# Drop rows where specific columns have missing values
df_clean = df.dropna(subset=['name', 'age'])
// ... (10 lines trimmed)
# Drop columns with more than 50% missing
threshold = len(df) * 0.5
df_clean = df.dropna(axis=1, thresh=threshold)
```

### Handling Missing Values - Filling

```python
# Fill with constant value
df['age'] = df['age'].fillna(0)

# Fill with column mean/median/mode
df['age'] = df['age'].fillna(df['age'].mean())
// ... (17 lines trimmed)
df['salary'] = df.groupby('department')['salary'].transform(
    lambda x: x.fillna(x.mean())
)
```

### Handling Empty Strings vs NaN

```python
# Empty strings are NOT detected as NaN
df['department'].isna().sum()  # Won't count ''

# Replace empty strings with NaN
// ... (7 lines trimmed)
# Using na_values when reading files
df = pd.read_csv('file.csv', na_values=['', 'N/A', 'null', 'None', '-'])
```

---

## Handling Duplicates

### Detecting Duplicates

```python
df = pd.DataFrame({
    'id': [1, 2, 2, 3, 4, 4],
    'name': ['Alice', 'Bob', 'Bob', 'Charlie', 'Diana', 'Diana'],
    'email': ['a@x.com', 'b@x.com', 'b@x.com', 'c@x.com', 'd@x.com', 'd2@x.com']
})
// ... (12 lines trimmed)

# Count duplicates per key
df.groupby('id').size().loc[lambda x: x > 1]
```

### Removing Duplicates

```python
# Remove duplicate rows (keep first)
df_clean = df.drop_duplicates()

# Keep last occurrence
// ... (9 lines trimmed)
# In-place modification
df.drop_duplicates(inplace=True)
```

### Handling Duplicates with Aggregation

```python
# Instead of dropping, aggregate duplicates
df_agg = df.groupby('id').agg({
    'name': 'first',
    'email': lambda x: ', '.join(x.unique())
// ... (5 lines trimmed)
# Rank duplicates
df['rank'] = df.groupby('id').cumcount() + 1
```

---

## Type Conversion

### Checking and Converting Types

```python
# Check current types
df.dtypes
df.info()

# Convert to specific type
// ... (10 lines trimmed)

# Convert object to string (pandas 2.0+ StringDtype)
df['name'] = df['name'].astype('string')  # Nullable string type
```

### Datetime Conversion

```python
df = pd.DataFrame({
    'date_str': ['2024-01-15', '2024-02-20', 'invalid', '2024-03-10'],
    'timestamp': [1705276800, 1708387200, 1710028800, 1710028800]
})

// ... (13 lines trimmed)

# Handle mixed formats
df['date'] = pd.to_datetime(df['date_str'], format='mixed', dayfirst=False)
```

### Categorical Conversion

```python
# Convert to categorical (memory efficient for low cardinality)
df['department'] = df['department'].astype('category')

# Ordered categorical
// ... (8 lines trimmed)
df['department'] = df['department'].astype('category')
print(f"Category: {df['department'].nbytes}")
```

### Nullable Integer Types (pandas 2.0+)

```python
# Standard int doesn't support NaN
# Use nullable integer types
df['age'] = df['age'].astype('Int64')  # Note capital I

// ... (8 lines trimmed)
# Convert with NA handling
df['age'] = pd.array([1, 2, None, 4], dtype='Int64')
```

---

## String Cleaning

### Common String Operations

```python
df = pd.DataFrame({
    'name': ['  Alice  ', 'BOB', 'charlie', None, 'Diana Smith'],
    'email': ['ALICE@EXAMPLE.COM', 'bob@test', 'invalid', None, 'diana@example.com']
})

// ... (15 lines trimmed)

# Split strings
df[['first', 'last']] = df['name'].str.split(' ', n=1, expand=True)
```

### String Validation

```python
# Check patterns
df['valid_email'] = df['email'].str.match(r'^[\w.]+@[\w.]+\.\w+$', na=False)

# String length
df['name_length'] = df['name'].str.len()
df['valid_length'] = df['name'].str.len().between(2, 50)

# Contains check
df['has_domain'] = df['email'].str.contains('@', na=False)
```

---

## Data Validation

### Validation Functions

```python
def validate_dataframe(df: pd.DataFrame) -> dict:
    """Comprehensive DataFrame validation."""
    report = {
        'rows': len(df),
        'columns': len(df.columns),
// ... (17 lines trimmed)
    return series.str.match(pattern, na=False)

df['valid_email'] = validate_email(df['email'])
```

### Schema Validation with pandera

```python
# Using pandera for schema validation (recommended for production)
import pandera as pa
from pandera import Column, Check

schema = pa.DataFrameSchema({
// ... (8 lines trimmed)
    schema.validate(df)
except pa.errors.SchemaError as e:
    print(f"Validation failed: {e}")
```

---

## Data Cleaning Pipeline

### Method Chaining Pattern

```python
def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Complete data cleaning pipeline using method chaining."""
    return (
        df
        # Make a copy
// ... (18 lines trimmed)
    )

df_clean = clean_dataframe(df)
```

### Pipeline with Validation

```python
def clean_and_validate(
    df: pd.DataFrame,
    required_columns: list[str],
    unique_columns: list[str] | None = None,
) -> tuple[pd.DataFrame, dict]:
// ... (29 lines trimmed)
    stats['final_rows'] = len(df)

    return df, stats
```

---

## Best Practices Summary

1. **Always check data quality first** - Use `.info()`, `.describe()`, and missing value analysis
2. **Document cleaning decisions** - Track what was dropped/filled and why
3. **Use nullable types** - `Int64`, `string`, `boolean` for proper NA handling
4. **Validate after cleaning** - Ensure data meets expectations
5. **Use method chaining** - Readable, maintainable cleaning pipelines
6. **Copy before modifying** - Avoid SettingWithCopyWarning
7. **Handle edge cases** - Empty strings, whitespace, invalid formats

---

## Anti-Patterns to Avoid

```python
# BAD: Dropping NaN without understanding impact
df = df.dropna()  # May lose significant data

# GOOD: Investigate first, then decide
print(f"Missing values: {df.isna().sum()}")
// ... (11 lines trimmed)

# GOOD: Safe conversion
df['id'] = pd.to_numeric(df['id'], errors='coerce').astype('Int64')
```

---

## Related References

- `dataframe-operations.md` - Selection and filtering for targeted cleaning
- `aggregation-groupby.md` - Aggregate duplicates instead of dropping
- `performance-optimization.md` - Efficient cleaning of large datasets
