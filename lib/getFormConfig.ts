import { createServerClient } from '@/lib/supabase'

export type FormConfig = {
  cities: string[]
  services: string[]
  budgets: string[]
}

export const CONFIG_DEFAULTS: FormConfig = {
  cities:   ['الدمام', 'القطيف', 'الخبر', 'الاحساء', 'الرياض', 'جدة', 'مكة', 'المدينة'],
  services: ['المنيوم', 'ارضيات', 'ابواب', 'اثاث', 'اضاءة', 'دهانات', 'مطابخ'],
  budgets:  [
    'أقل من 10,000 ريال',
    '10,000 – 25,000 ريال',
    '25,000 – 50,000 ريال',
    '50,000 – 100,000 ريال',
    '100,000 – 200,000 ريال',
  ],
}

export async function getFormConfig(): Promise<FormConfig> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('app_settings')
      .select('key, values')
      .in('key', ['cities', 'services', 'budgets'])
    if (!data?.length) return CONFIG_DEFAULTS
    const map = Object.fromEntries(data.map(r => [r.key, r.values as string[]]))
    return {
      cities:   map.cities   ?? CONFIG_DEFAULTS.cities,
      services: map.services ?? CONFIG_DEFAULTS.services,
      budgets:  map.budgets  ?? CONFIG_DEFAULTS.budgets,
    }
  } catch {
    return CONFIG_DEFAULTS
  }
}
