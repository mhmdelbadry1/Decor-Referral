'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type DeclineResult =
  | { success: true }
  | { success: false; reason: string }

export async function declineLead(claimToken: string): Promise<DeclineResult> {
  const supabase = createServerClient()

  // Resolve claimToken → lead_id + company_id
  const { data: broadcast } = await supabase
    .from('lead_broadcasts')
    .select('lead_id, company_id')
    .eq('claim_token', claimToken)
    .single()

  if (!broadcast) return { success: false, reason: 'invalid_token' }

  // Fetch current declined_by so we can append
  const { data: lead } = await supabase
    .from('leads')
    .select('declined_by')
    .eq('id', broadcast.lead_id)
    .single()

  if (!lead) return { success: false, reason: 'not_found' }

  const newDeclinedBy = [
    ...(lead.declined_by ?? []),
    broadcast.company_id,
  ]

  // Release the lead back to the pool — only if this company currently holds it
  const { error } = await supabase
    .from('leads')
    .update({
      company_id:  null,
      claimed_at:  null,
      status:      'معلق',
      declined_by: newDeclinedBy,
    })
    .eq('id', broadcast.lead_id)
    .eq('company_id', broadcast.company_id)

  if (error) {
    console.error('declineLead error:', JSON.stringify(error, null, 2))
    return { success: false, reason: 'update_failed' }
  }

  revalidatePath(`/claim/${claimToken}`)
  return { success: true }
}
