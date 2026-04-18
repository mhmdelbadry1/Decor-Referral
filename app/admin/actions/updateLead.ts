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

  const updates: Record<string, unknown> = {
    company_id           : companyId,
    warning_sent_at      : null,
    contact_verified_at  : null,
  }

  if (companyId) {
    updates.status     = 'تم التواصل'
    updates.claimed_at = new Date().toISOString()
  } else {
    updates.status     = 'معلق'
    updates.claimed_at = null
  }

  const { error } = await supabase.from('leads').update(updates).eq('id', leadId)
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
