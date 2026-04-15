# Database Functions (Postgres RPCs)

All functions live in the `public` schema and are called from Next.js server actions
via `supabase.rpc(...)`.

---

## `decline_lead_atomic`

**Migration file:** `supabase/migrations/002_decline_lead_atomic_fn.sql`  
**Called from:** `web/app/actions/declineLead.ts`

### Purpose

Releases a claimed lead back to the pool in a single atomic `UPDATE`.
A company calls this when the lead is not a good fit for them.

Using a DB-level function avoids the TOCTOU race condition that would exist
if the app did a read-then-write: two simultaneous decline calls could each
read the old `declined_by` array and overwrite each other's result.

### Signature

```sql
decline_lead_atomic(p_lead_id UUID, p_company_id UUID) → void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `p_lead_id` | `UUID` | The lead being declined (`leads.id`) |
| `p_company_id` | `UUID` | The company declining it (`companies.id`) |

### What it writes

| Column | Before | After | Why |
|--------|--------|-------|-----|
| `company_id` | `<uuid>` | `NULL` | Release the claim so other companies can take it |
| `status` | `'تم التواصل'` | `'معلق'` | Reset to pending so n8n re-broadcasts |
| `claimed_at` | `<timestamp>` | `NULL` | Clear the 2-hour countdown |
| `warning_sent_at` | `<timestamp>\|NULL` | `NULL` | Clear any active yellow-card warning |
| `declined_by` | `[...]` | `[..., p_company_id]` | Permanently ban this company from claiming this lead again |

### Guard clause

```sql
WHERE id = p_lead_id
  AND company_id = p_company_id
```

Only updates if the declining company is currently the owner.
Prevents a company from releasing a lead they never claimed.

### Full definition

```sql
CREATE OR REPLACE FUNCTION decline_lead_atomic(p_lead_id UUID, p_company_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  UPDATE leads
  SET
    company_id      = NULL,
    claimed_at      = NULL,
    status          = 'معلق',
    warning_sent_at = NULL,
    declined_by     = array_append(COALESCE(declined_by, ARRAY[]::uuid[]), p_company_id)
  WHERE
    id         = p_lead_id
    AND company_id = p_company_id;
END;
$func$;
```

### After this runs

- The lead's `status` is `'معلق'` again → n8n Workflow A (broadcaster) picks it up
- n8n queries `lead_broadcasts` to find remaining companies (those **not** in `declined_by`)
- A new WhatsApp blast goes to those companies
- The declining company's `claimToken` now renders **State D** (banned) in the UI

### Error handling (Next.js side)

`declineLead.ts` checks `error` from the RPC response.
If the function returns an error (e.g. lead was already released), it returns
`{ success: false, reason: 'update_failed' }` and the UI shows an Arabic error message.

---

## `claim_lead_atomic` *(planned)*

Not yet implemented as an RPC. Currently the claim is done via a chained
`.update().is('company_id', null)` in `claimLead.ts` — Postgres executes
this as a single atomic statement so it is safe for now.
If contention becomes an issue, extract it into a function here.
