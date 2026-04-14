'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { LeadStatusSchema, UuidSchema } from '@/lib/validators'

export type { LeadStatus } from '@/lib/validators'

export async function updateLeadStatus(token: string, status: string) {
  // Validate token is a real UUID — rejects forged/garbage tokens early
  const tokenParsed = UuidSchema.safeParse(token)
  if (!tokenParsed.success) throw new Error('طلب غير صالح')

  // Validate status is in the allowed list — rejects injected strings at runtime
  const statusParsed = LeadStatusSchema.safeParse(status)
  if (!statusParsed.success) throw new Error('قيمة الحالة غير مسموح بها')

  const supabase = createServerClient()
  const { error } = await supabase
    .from('leads')
    .update({ status: statusParsed.data })
    .eq('update_token', tokenParsed.data)

  if (error) {
    console.error('[updateLeadStatus] DB error code:', error.code)
    throw new Error('فشل في تحديث الحالة')
  }

  revalidatePath(`/update-lead/${token}`)
}
