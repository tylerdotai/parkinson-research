# Task 3: Subscriber Schema — Language Field Analysis

**Date:** 2026-05-20  
**Task:** Explore Supabase subscriber schema for language field  
**Files Analyzed:** `supabase_schema.sql`, `src/lib/supabase.ts`

---

## Finding: Language Field EXISTS

The `language` field is **already present** in the `subscribers` table — no schema changes needed.

### Schema Definition

**File:** `supabase_schema.sql` (line 7)
```sql
language text default 'en' check (language in ('en', 'es')),
```

### TypeScript Interface

**File:** `src/lib/supabase.ts` (lines 11–19)
```typescript
export interface Subscriber {
  id: string
  email: string
  language: 'en' | 'es'
  subscribed_at: string
  confirmed_at: string | null
  unsubscribed_at: string | null
  source: string
}
```

---

## EN/ES Segmentation: POSSIBLE

### Query Pattern for Language-Filtered Subscriber Lists

Supabase REST API supports filtering via query parameters:

```bash
# Get EN subscribers only (active + confirmed)
GET /rest/v1/subscribers?language=eq.en&confirmed_at=isnot.null&unsubscribed_at=is.null

# Get ES subscribers only (active + confirmed)
GET /rest/v1/subscribers?language=eq.es&confirmed_at=isnot.null&unsubscribed_at=is.null
```

### Existing Code Supports This

The `subscribe()` function already accepts and stores `language` (line 21):
```typescript
export async function subscribe(email: string, language = 'en', source = 'website')
```

---

## Summary

| Item | Status |
|------|--------|
| `language` column exists | ✅ YES |
| Constraint enforced | ✅ `check (language in ('en', 'es'))` |
| Default value | ✅ `'en'` |
| Segmentation query possible | ✅ YES |
| Schema changes required | ❌ NO |

**Conclusion:** EN/ES subscriber segmentation is fully supported by the existing schema. The `/api/send-report` endpoint can filter by `?language=eq.en` or `?language=eq.es` to send EN reports to EN subscribers and ES reports to ES subscribers.