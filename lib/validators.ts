import { z } from 'zod'
import { TESTING_EXTRA_COUNTRIES } from './phone'

/* ── Phone regex ──────────────────────────────────────────── */
// Built from KSA + any entries in TESTING_EXTRA_COUNTRIES.
// To revert to KSA-only: clear TESTING_EXTRA_COUNTRIES in lib/phone.ts.
function buildPhoneRegex(): RegExp {
  const patterns = [
    '\\+9665\\d{8}',
    ...TESTING_EXTRA_COUNTRIES.map(c => c.e164Regex),
  ]
  return new RegExp(`^(${patterns.join('|')})$`)
}

const phoneRegex = buildPhoneRegex()

export const ALLOWED_LEAD_STATUSES = [
  'تم التواصل',
  'تمت الزيارة',
  'تمت البيعة',
  'لم يتم الاتفاق',
] as const

export type LeadStatus = typeof ALLOWED_LEAD_STATUSES[number]

/* ── Dynamic schema builders ──────────────────────────────── */
// These are built at runtime from the live app_settings so they never
// drift out of sync when the admin updates cities / services / budgets.

function nonEmptyStringList(list: string[]): [string, ...string[]] {
  if (list.length === 0) throw new Error('Config list is empty')
  return list as [string, ...string[]]
}

export function buildLeadSchema(config: {
  cities   : string[]
  services : string[]
  budgets  : string[]
}) {
  return z.object({
    name    : z.string().min(2, 'الاسم قصير جداً').max(100, 'الاسم طويل جداً').trim(),
    phone   : z.string().regex(phoneRegex, 'رقم الجوال غير صحيح'),
    email   : z.string().email().max(200).optional().or(z.literal('')),
    city    : z.enum(nonEmptyStringList(config.cities)),
    services: z.array(z.enum(nonEmptyStringList(config.services))).min(1, 'اختر خدمة واحدة على الأقل').max(10, 'لا يمكن اختيار أكثر من ١٠ خدمات'),
    budget  : z.enum(nonEmptyStringList(config.budgets)),
  })
}

export function buildPartnerSchema(config: {
  cities  : string[]
  services: string[]
}) {
  return z.object({
    companyName : z.string().min(2, 'اسم الشركة قصير جداً').max(150).trim(),
    contactName : z.string().min(2, 'اسم المندوب قصير جداً').max(100).trim(),
    phone       : z.string().regex(phoneRegex, 'رقم الجوال غير صحيح'),
    services    : z.array(z.enum(nonEmptyStringList(config.services))).min(1, 'اختر تخصصاً واحداً على الأقل').max(10, 'لا يمكن اختيار أكثر من ١٠ تخصصات'),
    cities      : z.array(z.enum(nonEmptyStringList(config.cities))).min(1, 'اختر منطقة واحدة على الأقل').max(10, 'لا يمكن اختيار أكثر من ١٠ مناطق'),
  })
}

/* ── Static schemas (not config-dependent) ────────────────── */

export const LeadStatusSchema = z.enum(
  ALLOWED_LEAD_STATUSES as unknown as [string, ...string[]]
)

export const UuidSchema = z.string().uuid('معرف غير صالح')

