'use server'

import { createServerClient } from '@/lib/supabase'
import { buildPartnerSchema } from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

type Result = { error: string } | { error?: never }

export async function submitPartnerRegistration(data: unknown): Promise<Result> {
  try {
    // Fetch live config so validation always matches admin-configured options
    const config = await getFormConfig()
    const PartnerSchema = buildPartnerSchema({
      cities  : config.cities,
      services: config.services,
    })

    const parsed = PartnerSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
      return { error: firstError }
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
      return { error: 'فشل في إرسال الطلب، يرجى المحاولة مرة أخرى' }
    }

    return {}
  } catch {
    return { error: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' }
  }
}

