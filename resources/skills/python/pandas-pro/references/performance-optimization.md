# Performance Optimization

Compact pandas guidance for memory, vectorization, and large-data workflows.

## Start with Measurement

```python
memory = df.memory_usage(deep=True).sort_values(ascending=False)
total_mb = memory.sum() / 1e6
```

Look for:
- large object columns
- duplicate text values that should be categorical
- frames too large for the current process budget

## Reduce Memory

### Downcast Numeric Types

```python
df["count"] = pd.to_numeric(df["count"], downcast="integer")
df["value"] = pd.to_numeric(df["value"], downcast="float")
```

### Use Better Dtypes

```python
df["category"] = df["category"].astype("category")
df["name"] = df["name"].astype("string")
df["age"] = df["age"].astype("Int32")
```

Good wins:
- `category` for low-cardinality labels
- nullable integer types for missing numeric fields
- `string` instead of generic `object`

## Prefer Vectorization

```python
df["result"] = np.where(df["value"] > 0, df["value"] * 2, 0)
df["total"] = df["a"] + df["b"] + df["c"]
df["normalized_name"] = df["name"].str.strip().str.lower()
```

Avoid:
- `iterrows()`
- row-wise `apply(axis=1)` unless you truly need it
- Python loops over large frames

If you must iterate:

```python
for row in df.itertuples(index=False):
    ...
```

## Filter Early, Compute Late

```python
mask = df["category"] == "A"
subset = df.loc[mask].copy()
subset["expensive_calc"] = subset["a"] * subset["b"] + np.sin(subset["c"])
```

This is cheaper than computing for the full frame and filtering afterward.

## Use `query()` and `eval()` Selectively

```python
result = df.query("value > @threshold and category == @cat")
df.eval("score = a + b * c - d", inplace=True)
```

These can help on large frames, especially for arithmetic-heavy expressions.

## Chunk Large Inputs

```python
chunks = []
for chunk in pd.read_csv("large.csv", chunksize=100_000):
    filtered = chunk[chunk["value"] > 0]
    chunks.append(filtered.groupby("category")["value"].sum())

result = pd.concat(chunks).groupby(level=0).sum()
```

Use chunking when:
- the file does not fit comfortably in memory
- the workflow can aggregate incrementally
- the pipeline is mostly read-transform-reduce

## Sparse and Specialized Structures

```python
sparse = pd.arrays.SparseArray([0, 0, 1, 0, 2, 0])
```

Consider sparse storage when:
- zeros or null-like values dominate
- one-hot or matrix-like data grows large

## Default Performance Checklist

```text
1. profile memory first
2. fix dtypes before rewriting logic
3. replace loops with vectorized operations
4. filter before expensive transforms
5. chunk large reads when memory is the bottleneck
```
