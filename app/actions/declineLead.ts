'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { UuidSchema } from '@/lib/validators'

export type DeclineResult =
  | { success: true }
  | { success: false; reason: string }

export async function declineLead(claimToken: string): Promise<DeclineResult> {
  // Validate token shape before hitting DB
  if (!UuidSchema.safeParse(claimToken).success) {
    return { success: false, reason: 'invalid_token' }
  }

  const supabase = createServerClient()

  // Resolve claimToken → lead_id + company_id
  const { data: broadcast } = await supabase
    .from('lead_broadcasts')
    .select('lead_id, company_id')
    .eq('claim_token', claimToken)
    .single()

  if (!broadcast) return { success: false, reason: 'invalid_token' }

  // Atomic update: release lead + append company to declined_by in ONE query.
  // Using Postgres array_append() via rpc prevents the TOCTOU race condition
  // where two simultaneous decline calls could overwrite each other's writes.
  const { error } = await supabase.rpc('decline_lead_atomic', {
    p_lead_id:    broadcast.lead_id,
    p_company_id: broadcast.company_id,
  })

  if (error) {
    console.error('[declineLead] RPC error code:', error.code)
    return { success: false, reason: 'update_failed' }
  }

  revalidatePath(`/claim/${claimToken}`)
  return { success: true }
}
