'use server'

import { createServerClient } from '@/lib/supabase'
import { buildLeadSchema }    from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

type Result = { error: string } | { error?: never }

export async function submitLead(data: unknown): Promise<Result> {
  try {
    // Fetch live config so validation always matches the admin-configured options
    const config = await getFormConfig()
    const LeadSchema = buildLeadSchema(config)

    const parsed = LeadSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
      return { error: firstError }
    }

    const { name, phone, city, services, budget } = parsed.data
    const supabase = createServerClient()

    // Reject only if same phone + same city + overlapping services is already active
    const { data: activeLeads } = await supabase
      .from('leads')
      .select('city, services')
      .eq('customer_phone', phone)
      .in('status', ['معلق', 'تم التواصل', 'تمت الزيارة'])

    const isDuplicate = (activeLeads ?? []).some(
      lead =>
        lead.city === city &&
        (lead.services as string[]).some(s => services.includes(s))
    )

    if (isDuplicate) {
      return { error: 'لقد استلمنا طلبك لهذه الخدمة في نفس المدينة بالفعل — سنتواصل معك قريباً عبر واتساب.' }
    }

    const { error } = await supabase.from('leads').insert({
      customer_name:  name,
      customer_phone: phone,
      city,
      services,
      budget,
      status: 'معلق',
    })

    if (error) {
      console.error('[submitLead] DB error code:', error.code)
      return { error: 'فشل في إرسال الطلب، يرجى المحاولة مرة أخرى' }
    }

    return {}
  } catch {
    return { error: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' }
  }
}
