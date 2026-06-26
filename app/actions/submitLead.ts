'use server'

import { createServerClient } from '@/lib/supabase'
import { buildLeadSchema }    from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

export type SubmitLeadResult =
  | { error: string }
  | { error?: never; skipped?: string[] }

export async function submitLead(data: unknown): Promise<SubmitLeadResult> {
  try {
    const config = await getFormConfig()
    const LeadSchema = buildLeadSchema(config)

    const parsed = LeadSchema.safeParse(data)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
      return { error: firstError }
    }

    const { name, phone, city, services, budget } = parsed.data
    const supabase = createServerClient()

    // Collect every service that already has an active lead for this phone + city
    const { data: activeLeads } = await supabase
      .from('leads')
      .select('services')
      .eq('customer_phone', phone)
      .eq('city', city)
      .in('status', ['قيد المراجعة', 'معلق', 'تم التواصل', 'تمت الزيارة'])

    const activeServices = new Set<string>(
      (activeLeads ?? []).flatMap(l => l.services as string[])
    )

    const newServices = services.filter(s => !activeServices.has(s))
    const skipped     = services.filter(s =>  activeServices.has(s))

    // Every submitted service is already being handled — nothing new to insert
    if (newServices.length === 0) {
      const list = skipped.join('، ')
      return {
        error: `لديك طلب نشط بالفعل لـ (${list}) في ${city} — سنتواصل معك قريباً عبر واتساب.`,
      }
    }

    const { error } = await supabase.from('leads').insert({
      customer_name:  name,
      customer_phone: phone,
      city,
      services: newServices,
      budget,
      status: 'قيد المراجعة',
    })

    if (error) {
      console.error('[submitLead] DB error code:', error.code)
      return { error: 'فشل في إرسال الطلب، يرجى المحاولة مرة أخرى' }
    }

    return { skipped: skipped.length > 0 ? skipped : undefined }
  } catch {
    return { error: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى' }
  }
}
