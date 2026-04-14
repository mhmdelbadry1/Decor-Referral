'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type ClaimResult =
  | { success: true }
  | { success: false; reason: 'invalid_token' | 'already_claimed' | 'banned' }

export async function claimLead(claimToken: string): Promise<ClaimResult> {
  const supabase = createServerClient()

  // Resolve claimToken → lead_id + company_id
  const { data: broadcast } = await supabase
    .from('lead_broadcasts')
    .select('lead_id, company_id')
    .eq('claim_token', claimToken)
    .single()

  if (!broadcast) return { success: false, reason: 'invalid_token' }

  // Reject if this company was previously removed from this lead
  const { data: currentLead } = await supabase
    .from('leads')
    .select('declined_by')
    .eq('id', broadcast.lead_id)
    .single()

  if (currentLead?.declined_by?.includes(broadcast.company_id)) {
    return { success: false, reason: 'banned' }
  }

  // Atomic claim: only succeeds if company_id is still NULL
  const { data } = await supabase
    .from('leads')
    .update({
      company_id: broadcast.company_id,
      status:     'تم التواصل',
      claimed_at: new Date().toISOString(),
    })
    .eq('id', broadcast.lead_id)
    .is('company_id', null)   // ← race-condition guard
    .select('id')
    .single()

  if (!data) return { success: false, reason: 'already_claimed' }

  revalidatePath(`/claim/${claimToken}`)
  return { success: true }
}
