'use server'

import { revalidatePath }    from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import { buildPartnerSchema } from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

export type AddCompanyState = {
  success?: true
  error?  : string
}

export async function addCompany(
  _prev: AddCompanyState | null,
  formData: FormData,
): Promise<AddCompanyState> {
  // Fetch live config from DB so validation always matches
  // whatever cities/services the admin has configured
  const config = await getFormConfig()

  const raw = {
    companyName : formData.get('companyName'),
    contactName : formData.get('contactName'),
    phone       : formData.get('phone'),
    services    : formData.getAll('services'),
    cities      : formData.getAll('cities'),
  }

  const PartnerSchema = buildPartnerSchema({
    cities  : config.cities,
    services: config.services,
  })

  const parsed = PartnerSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة'
    return { error: msg }
  }

  const { companyName, contactName, phone, services, cities } = parsed.data
  const supabase = createServerClient()

  const { error } = await supabase.from('companies').insert({
    name        : companyName,
    specialty   : services,
    city        : cities,
    rep_whatsapp: phone,
    rep_name    : contactName,
  })

  if (error) {
    console.error('[addCompany] DB error:', error.message)
    return { error: 'فشل في إضافة الشركة، يرجى المحاولة مرة أخرى' }
  }

  revalidatePath('/admin/dashboard')
  return { success: true }
}
