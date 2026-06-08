'use server'

import { revalidatePath }     from 'next/cache'
import { createServerClient } from '@/lib/supabase'
import { buildPartnerSchema } from '@/lib/validators'
import { getFormConfig }      from '@/lib/getFormConfig'

export type UpdateCompanyState = {
  success?: boolean
  error?  : string
}

/**
 * Update a company's details. The companyId is bound via .bind() before
 * being passed to useActionState, so the signature matches Next.js conventions:
 *   updateCompany.bind(null, companyId)
 */
export async function updateCompany(
  companyId: string,
  _prev    : UpdateCompanyState | null,
  formData : FormData,
): Promise<UpdateCompanyState> {
  const config = await getFormConfig()

  const raw = {
    companyName: formData.get('companyName'),
    contactName: formData.get('contactName'),
    phone      : formData.get('phone'),
    services   : formData.getAll('services'),
    cities     : formData.getAll('cities'),
  }

  const PartnerSchema = buildPartnerSchema({ cities: config.cities, services: config.services })
  const parsed = PartnerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة' }
  }

  const { companyName, contactName, phone, services, cities } = parsed.data
  const supabase = createServerClient()

  const { error } = await supabase
    .from('companies')
    .update({
      name        : companyName,
      rep_name    : contactName,
      rep_whatsapp: phone,
      specialty   : services,
      city        : cities,
    })
    .eq('id', companyId)

  if (error) return { error: error.message }

  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/leads')
  return { success: true }
}
