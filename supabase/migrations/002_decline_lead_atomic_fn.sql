-- Migration: Add atomic decline RPC function
-- Paste this in Supabase SQL Editor and press Run (Ctrl+Enter)
-- This replaces the TOCTOU-vulnerable read-modify-write pattern in declineLead.ts

CREATE OR REPLACE FUNCTION decline_lead_atomic(p_lead_id UUID, p_company_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  UPDATE leads
  SET
    company_id  = NULL,
    claimed_at  = NULL,
    status      = 'معلق',
    declined_by = array_append(COALESCE(declined_by, ARRAY[]::uuid[]), p_company_id)
  WHERE
    id         = p_lead_id
    AND company_id = p_company_id;
END;
$func$;
