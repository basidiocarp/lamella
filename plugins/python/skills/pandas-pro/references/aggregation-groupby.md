# Aggregation and GroupBy

Compact pandas patterns for summarizing data without losing clarity.

## GroupBy Fundamentals

```python
grouped = df.groupby("department")["salary"].mean().reset_index()

summary = df.groupby("department").agg(
    avg_salary=("salary", "mean"),
    max_salary=("salary", "max"),
    total_years=("years", "sum"),
    employees=("employee_id", "count"),
)
```

Prefer named aggregations because:
- column names stay readable
- multi-aggregation output is easier to use downstream

## Custom Aggregations

```python
result = df.groupby("department").agg(
    salary_range=("salary", lambda x: x.max() - x.min()),
    p75_years=("years", lambda x: x.quantile(0.75)),
    median_salary=("salary", "median"),
)
```

Use custom functions for:
- percentiles
- interquartile range
- domain-specific summary rules

## Transform vs Apply

### `transform`

Returns the same shape as the original frame.

```python
df["dept_avg_salary"] = df.groupby("department")["salary"].transform("mean")
df["salary_delta"] = df["salary"] - df["dept_avg_salary"]
```

Use when you want to attach group-level stats back to each row.

### `apply`

Use for more flexible per-group logic.

```python
def top_n_by_salary(group: pd.DataFrame, n: int = 2) -> pd.DataFrame:
    return group.nlargest(n, "salary")

top_earners = df.groupby("department", group_keys=False).apply(top_n_by_salary, n=2)
```

Use sparingly:
- it is more flexible
- it is often slower than built-in groupby operations

## Filtering Groups

```python
large_groups = df.groupby("department").filter(lambda x: len(x) >= 3)
high_value_groups = df.groupby("department").filter(lambda x: x["salary"].mean() > 70_000)
```

Good for:
- removing tiny groups
- keeping only groups that satisfy a threshold

## Pivot Tables

```python
pivot = df.pivot_table(
    values="sales",
    index="product",
    columns="region",
    aggfunc="sum",
    fill_value=0,
)
```

Use pivot tables when:
- you want cross-tabulated summaries
- a reporting view matters more than row-level detail

For long format again:

```python
long_df = wide_df.melt(id_vars="product", var_name="quarter", value_name="sales")
```

## Crosstab

```python
ct = pd.crosstab(df["gender"], df["department"])
normalized = pd.crosstab(df["gender"], df["department"], normalize="index")
```

Use when:
- counting categories against each other
- comparing proportions, not just raw counts

## Window-Like Group Operations

```python
df["prev_sales"] = df.groupby("product")["sales"].shift(1)
df["sales_diff"] = df.groupby("product")["sales"].diff()
df["sales_rank"] = df.groupby("product")["sales"].rank(method="dense", ascending=False)
```

These patterns cover:
- previous and next values
- within-group comparisons
- per-group rankings

## Default Pattern

```text
Use `agg` for summaries
Use `transform` to add per-group context back to rows
Use `filter` to drop weak groups
Use `pivot_table` for reporting views
Use `apply` only when built-ins are not expressive enough
```
