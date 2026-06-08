'use server'

import { revalidatePath }    from 'next/cache'
import { createServerClient } from '@/lib/supabase'

const VALID_STATUSES = ['معلق', 'تم التواصل', 'تمت الزيارة', 'تمت البيعة', 'لم يتم الاتفاق', 'مؤرشف'] as const

function refreshPaths() {
  revalidatePath('/admin/leads')
  revalidatePath('/admin/dashboard')
}

/** Change only the status of a lead. */
export async function updateLeadStatusAdmin(leadId: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return { error: 'حالة غير صالحة' }
  }

  const supabase = createServerClient()

  if (status === 'معلق') {
    const { data: lead } = await supabase
      .from('leads')
      .select('company_id')
      .eq('id', leadId)
      .single()
    if (lead?.company_id) {
      return { error: 'لا يمكن تعيين الحالة "معلق" وهناك شركة مُعيَّنة — احذف الشركة أولاً' }
    }
  }

  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)

  if (error) return { error: error.message }
  refreshPaths()
  return { success: true }
}

/**
 * Reassign a lead to a different company (or unassign with null).
 * When assigning: sets status → 'تم التواصل' and stamps claimed_at.
 * When unassigning: behaves like a full release.
 */
export async function reassignLeadAdmin(leadId: string, companyId: string | null) {
  const supabase = createServerClient()

  // n8n's re-broadcast condition requires old.status ≠ 'معلق'.
  // If the lead is already معلق (e.g. admin switching company mid-flow),
  // bump it through مؤرشف first — n8n has no handler for that status so
  // it's a silent pass-through. The next update to معلق then satisfies
  // old ≠ معلق and the broadcast fires correctly.
  const { data: current } = await supabase
    .from('leads')
    .select('status')
    .eq('id', leadId)
    .single()

  if (current?.status === 'معلق') {
    await supabase.from('leads').update({ status: 'مؤرشف' }).eq('id', leadId)
  }

  const { error } = await supabase
    .from('leads')
    .update({
      company_id          : companyId,
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
      customer_feedback   : null,
    })
    .eq('id', leadId)

  if (error) return { error: error.message }
  refreshPaths()
  return { success: true }
}

/**
 * Fully release a lead back to the pending pool.
 * Clears company_id, claimed_at, warning_sent_at and resets status to 'معلق'.
 * Does NOT touch declined_by — the existing ban list is preserved.
 */
export async function releaseLeadAdmin(leadId: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('leads')
    .update({
      company_id          : null,
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
    })
    .eq('id', leadId)

  if (error) return { error: error.message }
  refreshPaths()
  return { success: true }
}

/**
 * Clear the declined_by list for a lead so all companies can claim it again.
 */
export async function clearDeclinedListAdmin(leadId: string) {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('leads')
    .update({ declined_by: [] })
    .eq('id', leadId)

  if (error) return { error: error.message }
  refreshPaths()
  return { success: true }
}

const VALID_RATINGS = ['ممتاز', 'جيد', 'يحتاج تحسين'] as const
type SaleRating = typeof VALID_RATINGS[number]

/** Set or clear the sale_rating on a lead. Pass null to remove the rating. */
export async function updateLeadRatingAdmin(leadId: string, rating: string | null) {
  if (rating !== null && !VALID_RATINGS.includes(rating as SaleRating)) {
    return { error: 'تقييم غير صالح' }
  }
  const supabase = createServerClient()
  const { error } = await supabase
    .from('leads')
    .update({ sale_rating: rating })
    .eq('id', leadId)
  if (error) return { error: error.message }
  refreshPaths()
  return { success: true }
}
