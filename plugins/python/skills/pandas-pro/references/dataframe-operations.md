# DataFrame Operations

Compact pandas patterns for indexing, filtering, sorting, and column work.

## Indexing and Selection

### `.loc[]`

Use `.loc[]` for label-based selection and conditional filters.

```python
selected = df.loc[df["department"] == "Engineering", ["name", "salary"]]
first_two_columns = df.loc[:, ["name", "department"]]
single_value = df.loc[0, "name"]
```

Prefer `.loc[]` when:
- you know column names
- the filter is boolean
- readability matters more than raw position

### `.iloc[]`

Use `.iloc[]` for position-based access.

```python
first_row = df.iloc[0]
first_block = df.iloc[0:3, 0:2]
specific_rows = df.iloc[[0, 5, 10]]
```

Use `.iloc[]` when:
- the order matters
- positions are easier than names
- you are slicing a rectangular block

## Filtering

### Boolean Masks

```python
filtered = df[df["age"] > 25]
filtered = df[(df["department"] == "Engineering") & (df["salary"] >= 90_000)]
filtered = df[~df["department"].eq("Marketing")]
```

### `.query()`

```python
min_age = 25
result = df.query("age > @min_age and department != 'Marketing'")
```

Use `.query()` when:
- the expression is easier to read as one condition string
- the DataFrame is wide and mask syntax gets noisy

### `.isin()` and String Filters

```python
filtered = df[df["department"].isin(["Engineering", "Sales"])]
emails = df[df["email"].str.contains("example.com", na=False)]
```

## Sorting

```python
by_age = df.sort_values("age")
by_salary_desc = df.sort_values("salary", ascending=False)
multi_sort = df.sort_values(["department", "salary"], ascending=[True, False])
reset = df.sort_values("age").reset_index(drop=True)
```

Useful options:
- `ascending=`
- `na_position="last"`
- multi-column sorts for stable report output

## Column Operations

### Add or Modify Columns

```python
df["bonus"] = df["salary"] * 0.1
df["seniority"] = np.where(df["age"] >= 30, "Senior", "Junior")

df = df.assign(
    total_comp=lambda x: x["salary"] + x["bonus"],
    dept_code=lambda x: x["department"].str.upper().str[:3],
)
```

### Rename, Drop, Reorder

```python
df = df.rename(columns={"name": "full_name"})
df = df.drop(columns=["temp_flag"])
df = df[["full_name", "department", "salary", "bonus"]]
```

## Index Operations

```python
by_name = df.set_index("name")
restored = by_name.reset_index()
multi = df.set_index(["department", "name"])
```

Use a custom index when:
- row identity is meaningful
- you repeatedly align on the same keys

Otherwise keep the default index and avoid accidental complexity.

## Default Workflow

```text
Use .loc for most readable selection
Use .iloc for positional slicing
Build masks explicitly for filters
Sort before presenting or exporting
Use assign/rename/drop to keep column changes chained and readable
```
