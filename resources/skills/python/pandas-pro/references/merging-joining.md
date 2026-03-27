# Merging and Joining

Compact pandas guidance for combining DataFrames safely.

## Merge Basics

```python
result = pd.merge(employees, departments, on="dept_id", how="inner")
left_join = pd.merge(employees, departments, on="dept_id", how="left")
```

Default join meanings:
- `inner`: only matching keys
- `left`: keep all left rows
- `right`: keep all right rows
- `outer`: keep everything
- `cross`: cartesian product

## Different Column Names

```python
result = pd.merge(
    employees,
    departments,
    left_on="department",
    right_on="id",
    how="left",
).drop(columns="id")
```

Use `left_on` and `right_on` when schemas disagree, then clean up the duplicate key.

## Multiple Keys

```python
result = pd.merge(sales, targets, on=["region", "product"], how="left")
```

Use multiple keys when one field alone is not unique enough to join safely.

## Merging on Index

```python
result = pd.merge(
    employees,
    salaries.set_index("emp_id"),
    left_on="emp_id",
    right_index=True,
    how="left",
)
```

This is useful when one side already has a meaningful index.

## Duplicate Columns and Merge Validation

```python
result = pd.merge(df1, df2, on="id", suffixes=("_left", "_right"))

checked = pd.merge(df1, df2, on="id", validate="one_to_one")
```

Use:
- `suffixes` to keep overlapping columns readable
- `validate` to fail fast when cardinality assumptions are wrong

Validations worth using:
- `one_to_one`
- `one_to_many`
- `many_to_one`

## Indicator Column

```python
result = pd.merge(df1, df2, on="id", how="outer", indicator=True)
left_only = result[result["_merge"] == "left_only"]
```

This is the fastest way to audit what matched and what did not.

## `join()` for Index-Oriented Work

```python
result = employees.join(salaries, how="left")
result = employees.join(departments, on="dept_id")
```

Use `.join()` when:
- the right side already uses its index as the key
- you want lighter syntax than `merge`

## `concat()` for Stacking

### Row-wise

```python
all_rows = pd.concat([df1, df2], ignore_index=True)
```

### Column-wise

```python
wide = pd.concat([names, ages, salaries], axis=1)
```

Use `concat` when:
- you are stacking the same schema vertically
- or aligning multiple frames side by side

## Filling Gaps

```python
filled = primary.combine_first(fallback)
```

Use `combine_first` when:
- one DataFrame is authoritative
- the second only fills missing cells

## Default Safe Workflow

```text
1. inspect key uniqueness before merging
2. use `validate=` whenever cardinality matters
3. keep an `_merge` indicator when reconciling data
4. use `concat` for stacking, not relational joins
5. clean duplicate columns immediately after the join
```
