'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export type LeadStatus =
  | 'تم التواصل'
  | 'تمت الزيارة'
  | 'تمت البيعة'
  | 'لم يتم الاتفاق'

export async function updateLeadStatus(token: string, status: LeadStatus) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('update_token', token)
  if (error) throw new Error('فشل في تحديث الحالة')
  revalidatePath(`/update-lead/${token}`)
}
