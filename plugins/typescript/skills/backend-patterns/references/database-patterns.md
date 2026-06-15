# Database Patterns

## Query Optimization

```typescript
// ✅ GOOD: Select only needed columns
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: Select everything
const { data } = await supabase
  .from('markets')
  .select('*')
```

---

## N+1 Query Prevention

```typescript
// ❌ BAD: N+1 query problem
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N queries
}

// ✅ GOOD: Batch fetch
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 query
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

---

## Transaction Pattern

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Use Supabase transaction
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}
```

### SQL Function for Transactions

```sql
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  new_market_id uuid;
  new_position_id uuid;
BEGIN
  INSERT INTO markets (name, creator_id, status)
  VALUES (
    market_data->>'name',
    (market_data->>'creator_id')::uuid,
    COALESCE(market_data->>'status', 'draft')
  )
  RETURNING id INTO new_market_id;

  INSERT INTO positions (market_id, side, amount)
  VALUES (
    new_market_id,
    position_data->>'side',
    (position_data->>'amount')::numeric
  )
  RETURNING id INTO new_position_id;

  RETURN jsonb_build_object(
    'success', true,
    'market_id', new_market_id,
    'position_id', new_position_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```
