'use server'

import { createServerClient } from '@/lib/supabase'
import { PartnerSchema } from '@/lib/validators'

export async function submitPartnerRegistration(data: unknown) {
  // Runtime validation — prevents bots and malformed submissions
  const parsed = PartnerSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
    throw new Error(firstError)
  }

  const { companyName, contactName, phone, services, cities } = parsed.data
  const supabase = createServerClient()

  const { error } = await supabase.from('companies').insert({
    name:         companyName,
    specialty:    services,
    city:         cities,
    rep_whatsapp: phone,
    rep_name:     contactName,
  })

  if (error) {
    console.error('[submitPartnerRegistration] DB error code:', error.code)
    throw new Error('فشل في إرسال الطلب، يرجى المحاولة مرة أخرى')
  }
}
