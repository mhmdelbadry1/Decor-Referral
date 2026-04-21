'use server'

import { createServerClient } from '@/lib/supabase'
import { buildLeadSchema }    from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

export async function submitLead(data: unknown) {
  // Fetch live config so validation always matches the admin-configured options
  const config = await getFormConfig()
  const LeadSchema = buildLeadSchema(config)

  const parsed = LeadSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
    throw new Error(firstError)
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
    throw new Error('لقد استلمنا طلبك لهذه الخدمة في نفس المدينة بالفعل — سنتواصل معك قريباً عبر واتساب.')
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
    // Log error code only — never expose full DB error to server logs
    console.error('[submitLead] DB error code:', error.code)
    throw new Error('فشل في إرسال الطلب، يرجى المحاولة مرة أخرى')
  }
}
