'use server'

import { revalidatePath }     from 'next/cache'
import { createServerClient } from '@/lib/supabase'

export type BlacklistState = {
  success?: boolean
  error?  : string
}

/** Add a company to the blacklist — it stops receiving new lead broadcasts. */
export async function blacklistCompany(companyId: string): Promise<BlacklistState> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('companies')
    .update({ is_blacklisted: true })
    .eq('id', companyId)
  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/leads')
  return { success: true }
}

/** Remove a company from the blacklist — it will receive lead broadcasts again. */
export async function unblacklistCompany(companyId: string): Promise<BlacklistState> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('companies')
    .update({ is_blacklisted: false })
    .eq('id', companyId)
  if (error) return { error: error.message }
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/leads')
  return { success: true }
}
