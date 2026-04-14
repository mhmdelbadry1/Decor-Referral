'use server'

import { createServerClient } from '@/lib/supabase'
import { LeadSchema } from '@/lib/validators'

export async function submitLead(data: unknown) {
  // Runtime validation — TypeScript types are erased at runtime
  const parsed = LeadSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
    throw new Error(firstError)
  }

  const { name, phone, city, services, budget } = parsed.data
  const supabase = createServerClient()

  const { error } = await supabase.from('leads').insert({
    customer_name:  name,
    customer_phone: phone,
    city,
    services,
    budget,
    status: 'معلق',
  })

  if (error) {
    // Log error code only — never expose full DB error to server logs
    console.error('[submitLead] DB error code:', error.code)
    throw new Error('فشل في إرسال الطلب، يرجى المحاولة مرة أخرى')
  }
}
