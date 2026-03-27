# Window Functions

## Ranking Functions

```sql
SELECT
    customer_id,
    order_date,
    total,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS row_num,
    RANK() OVER (PARTITION BY customer_id ORDER BY total DESC) AS rank_in_customer,
    NTILE(4) OVER (ORDER BY total DESC) AS revenue_quartile
FROM orders;
```

## Aggregate Windows

```sql
SELECT
    order_date,
    daily_revenue,
    SUM(daily_revenue) OVER (ORDER BY order_date) AS cumulative_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_avg_7
FROM revenue_by_day;
```

## LAG and LEAD

```sql
SELECT
    order_date,
    total,
    LAG(total) OVER (ORDER BY order_date) AS previous_total,
    LEAD(total) OVER (ORDER BY order_date) AS next_total
FROM daily_orders;
```

## FIRST_VALUE and LAST_VALUE

```sql
SELECT
    product_id,
    price_date,
    price,
    FIRST_VALUE(price) OVER (
        PARTITION BY product_id
        ORDER BY price_date
    ) AS first_price,
    LAST_VALUE(price) OVER (
        PARTITION BY product_id
        ORDER BY price_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS latest_price
FROM product_prices;
```

## Frame Specifications

```sql
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ) AS trailing_4_row_sum
FROM sales;
```

## Common Patterns

1. Top N per group: `ROW_NUMBER()` then filter on rank.
2. Running totals: `SUM(...) OVER (ORDER BY date)`.
3. Moving averages: `AVG(...) OVER (ROWS BETWEEN N PRECEDING ...)`.
4. Sessionization: `LAG()` to detect time gaps between events.
5. Deduplication: `ROW_NUMBER() OVER (PARTITION BY key ORDER BY priority)`.
