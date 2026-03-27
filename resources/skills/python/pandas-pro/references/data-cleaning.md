# Data Cleaning

Compact pandas patterns for building repeatable cleaning pipelines.

## Missing Values

```python
missing = pd.DataFrame(
    {
        "count": df.isna().sum(),
        "percent": (df.isna().mean() * 100).round(2),
        "dtype": df.dtypes,
    }
)
```

Start by measuring:
- where missing values exist
- how severe the gap is
- whether the dtype already supports nulls well

### Drop vs Fill

```python
df = df.dropna(subset=["name", "email"])
df["age"] = df["age"].fillna(df["age"].median())
df["salary"] = df.groupby("department")["salary"].transform(lambda x: x.fillna(x.mean()))
```

Rule of thumb:
- drop rows only when the field is truly required
- fill numerics with a meaningful summary, not reflexively with `0`
- fill within groups when the distribution differs by category

### Empty Strings

```python
df = df.replace(r"^\s*$", pd.NA, regex=True)
```

Treat empty strings and whitespace-only strings as missing early.

## Duplicates

```python
duplicates = df[df.duplicated(subset=["id"], keep=False)]
df = df.drop_duplicates(subset=["id"], keep="last")
```

If duplicate rows carry useful data, aggregate instead:

```python
collapsed = df.groupby("id").agg(
    name=("name", "first"),
    emails=("email", lambda x: ", ".join(sorted(set(x.dropna())))),
)
```

## Type Conversion

```python
df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
df["age"] = df["age"].astype("Int64")
df["name"] = df["name"].astype("string")
df["department"] = df["department"].astype("category")
```

Prefer nullable dtypes:
- `Int64` for integers with nulls
- `string` for text
- `category` for low-cardinality labels

## String Cleaning

```python
df["name"] = df["name"].str.strip().str.title()
df["email"] = df["email"].str.strip().str.lower()
df["valid_email"] = df["email"].str.match(r"^[\\w.]+@[\\w.]+\\.\\w+$", na=False)
```

Common wins:
- trim whitespace
- normalize case
- validate simple patterns before downstream joins

## Validation

```python
def validate_frame(df: pd.DataFrame) -> dict[str, int]:
    return {
        "rows": len(df),
        "missing_email": int(df["email"].isna().sum()),
        "invalid_email": int((~df["valid_email"]).sum()),
        "duplicate_ids": int(df.duplicated(subset=["id"]).sum()),
    }
```

Use validation after cleaning, not just before it.

## Method-Chaining Pattern

```python
def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.copy()
        .replace(r"^\\s*$", pd.NA, regex=True)
        .assign(
            name=lambda x: x["name"].astype("string").str.strip().str.title(),
            email=lambda x: x["email"].astype("string").str.strip().str.lower(),
        )
        .drop_duplicates(subset=["id"], keep="last")
    )
```

Keep the pipeline:
- explicit
- small enough to read top to bottom
- paired with a post-clean validation report
