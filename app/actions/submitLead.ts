'use server'

import { createServerClient } from '@/lib/supabase'

type LeadInput = {
  city: string
  services: string[]
  budget: string
  name: string
  phone: string
  email: string
}

export async function submitLead(data: LeadInput) {
  const supabase = createServerClient()

  const { error } = await supabase.from('leads').insert({
    customer_name:  data.name,
    customer_phone: data.phone,
    customer_email: data.email || null,
    city:           data.city,
    services:       data.services,
    budget:         data.budget,
    status:         'جديد',
  })

  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error, null, 2))
    throw new Error('فشل في إرسال الطلب')
  }
}
