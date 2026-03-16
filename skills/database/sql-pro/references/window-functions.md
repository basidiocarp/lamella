# Window Functions

## Ranking Functions

```sql
-- ROW_NUMBER: Sequential numbering within partition
SELECT
    customer_id,
    order_date,
    total,
// ... (33 lines trimmed)
    total_spent,
    NTILE(4) OVER (ORDER BY total_spent DESC) as quartile
FROM customer_lifetime_value;
```

## Aggregate Window Functions

```sql
-- Running totals and cumulative sums
SELECT
    order_date,
    daily_revenue,
    SUM(daily_revenue) OVER (ORDER BY order_date) as cumulative_revenue,
// ... (22 lines trimmed)
    AVG(quantity) OVER (PARTITION BY product_id) as avg_qty_for_product,
    quantity::FLOAT / SUM(quantity) OVER (PARTITION BY product_id) as pct_of_total
FROM product_sales;
```

## LAG and LEAD Functions

```sql
-- Compare with previous/next row
SELECT
    order_date,
    total,
    LAG(total) OVER (ORDER BY order_date) as previous_day_total,
// ... (24 lines trimmed)
        ELSE 0
    END as new_session
FROM user_actions;
```

## FIRST_VALUE and LAST_VALUE

```sql
-- Compare each row to first/last in partition
SELECT
    product_id,
    price_date,
    price,
// ... (23 lines trimmed)
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as second_day_amount
FROM daily_sales;
```

## Frame Specifications

```sql
-- ROWS vs RANGE difference
SELECT
    order_date,
    amount,
    -- ROWS: Physical row offset
// ... (32 lines trimmed)
        ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING
    ) as centered_ma_7
FROM sales;
```

## Advanced Analytics

```sql
-- Percentile calculations
SELECT
    employee_id,
    salary,
    PERCENT_RANK() OVER (ORDER BY salary) as pct_rank,
// ... (43 lines trimmed)
    '1 day'::INTERVAL
) AS date_series(date)
LEFT JOIN sales s ON date_series.date = s.sale_date;
```

## Conditional Aggregation with Windows

```sql
-- Filter within window function
SELECT
    product_id,
    sale_date,
    quantity,
// ... (18 lines trimmed)
        PARTITION BY customer_id
    ) as avg_small_order_value
FROM orders;
```

## Performance Considerations

```sql
-- Avoid multiple window passes - combine into one
-- Bad: Multiple scans
SELECT
    product_id,
    (SELECT AVG(price) FROM products) as avg_price,
// ... (17 lines trimmed)
FROM product_sales_summary;

CREATE INDEX idx_product_rankings_category ON product_rankings(category, category_rank);
```

## Common Patterns

1. **Top N per Group**: Use ROW_NUMBER() with WHERE rn <= N
2. **Running Totals**: SUM() OVER (ORDER BY date)
3. **Moving Averages**: AVG() with ROWS BETWEEN N PRECEDING
4. **Session Analysis**: LAG() to detect time gaps
5. **Deduplication**: ROW_NUMBER() OVER (PARTITION BY key ORDER BY priority) WHERE rn = 1
6. **Percentiles**: PERCENT_RANK() or PERCENTILE_CONT()
7. **Year-over-Year**: LAG(value, 12) OVER (ORDER BY month)
8. **Cohort Analysis**: PARTITION BY cohort_date, aggregate over activity periods
