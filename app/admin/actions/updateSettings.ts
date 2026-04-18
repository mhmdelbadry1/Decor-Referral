'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateSettings(
  key: 'cities' | 'services' | 'budgets',
  values: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, values, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) return { success: false, error: error.message }
    revalidatePath('/', 'layout')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'خطأ غير معروف' }
  }
}
