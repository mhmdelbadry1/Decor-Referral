'use server'

import { revalidatePath }     from 'next/cache'
import { createServerClient } from '@/lib/supabase'

export type DeleteCompanyState = {
  success?     : boolean
  error?       : string
  canBlacklist?: boolean  // true when company has leads — blacklist instead of deleting
}

/**
 * Delete a company. Blocked entirely if the company has ANY leads (active or
 * completed) to preserve referential history. The caller should offer blacklist
 * as the alternative (canBlacklist: true in the response).
 */
export async function deleteCompany(companyId: string): Promise<DeleteCompanyState> {
  const supabase = createServerClient()

  // Block if company has any leads at all
  const { data: anyLeads } = await supabase
    .from('leads')
    .select('id')
    .eq('company_id', companyId)
    .limit(1)

  if (anyLeads && anyLeads.length > 0) {
    return {
      error       : 'لا يمكن حذف الشركة لأن لديها سجل عملاء. يمكنك إضافتها للقائمة السوداء لمنعها من استقبال طلبات جديدة.',
      canBlacklist: true,
    }
  }

  const { error } = await supabase.from('companies').delete().eq('id', companyId)
  if (error) return { error: error.message }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/leads')
  return { success: true }
}
