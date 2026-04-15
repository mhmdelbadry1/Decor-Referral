'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { LeadStatusSchema, UuidSchema } from '@/lib/validators'

export type { LeadStatus } from '@/lib/validators'

export async function updateLeadStatusByClaim(claimToken: string, status: string) {
  const tokenParsed = UuidSchema.safeParse(claimToken)
  if (!tokenParsed.success) throw new Error('طلب غير صالح')

  const statusParsed = LeadStatusSchema.safeParse(status)
  if (!statusParsed.success) throw new Error('قيمة الحالة غير مسموح بها')

  const supabase = createServerClient()

  // Resolve claimToken → lead_id
  const { data: broadcast } = await supabase
    .from('lead_broadcasts')
    .select('lead_id')
    .eq('claim_token', tokenParsed.data)
    .single()

  if (!broadcast) throw new Error('رابط غير صالح')

  const { error } = await supabase
    .from('leads')
    .update({ status: statusParsed.data })
    .eq('id', broadcast.lead_id)

  if (error) {
    console.error('[updateLeadStatusByClaim] DB error code:', error.code)
    throw new Error('فشل في تحديث الحالة')
  }

  revalidatePath(`/claim/${claimToken}`)
}
