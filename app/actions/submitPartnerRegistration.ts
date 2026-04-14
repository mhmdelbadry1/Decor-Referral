'use server'

import { createServerClient } from '@/lib/supabase'

type PartnerRegistrationInput = {
  companyName: string
  services: string[]
  cities: string[]
  contactName: string
  phone: string
}

export async function submitPartnerRegistration(data: PartnerRegistrationInput) {
  const supabase = createServerClient()

  const { error } = await supabase.from('companies').insert({
    name:          data.companyName,
    specialty:     data.services,
    city:          data.cities,
    rep_whatsapp:  data.phone,
    rep_name:      data.contactName,
  })

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error, null, 2))
    throw new Error('فشل في إرسال الطلب')
  }
}
