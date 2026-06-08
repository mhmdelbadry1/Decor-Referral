'use server'

import { revalidatePath }     from 'next/cache'
import { createServerClient } from '@/lib/supabase'

export type DeleteCompanyState = {
  success?: boolean
  error?  : string
}

/**
 * Delete a company. Blocked if the company has any leads that are still
 * active (not archived / not-agreed / not-sold) to prevent orphaned records.
 */
export async function deleteCompany(companyId: string): Promise<DeleteCompanyState> {
  const supabase = createServerClient()

  const { data: active } = await supabase
    .from('leads')
    .select('id')
    .eq('company_id', companyId)
    .not('status', 'in', '("مؤرشف","لم يتم الاتفاق","تمت البيعة")')
    .limit(1)

  if (active && active.length > 0) {
    return { error: 'لا يمكن حذف الشركة — لديها عملاء نشطون. أعد تعيينهم أولاً.' }
  }

  const { error } = await supabase.from('companies').delete().eq('id', companyId)
  if (error) return { error: error.message }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/leads')
  return { success: true }
}
