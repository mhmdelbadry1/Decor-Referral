import { z } from 'zod'

/* ── Shared field definitions ─────────────────────────────── */

const phoneRegex = /^\+9665\d{8}$/  // Saudi mobile format

const ALLOWED_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الظهران', 'القطيف', 'الأحساء',
  'تبوك', 'بريدة', 'حائل', 'أبها', 'خميس مشيط',
  'الطائف', 'نجران', 'جازان', 'ينبع', 'الجبيل',
] as const

const ALLOWED_SERVICES = [
  'ارضيات', 'اضاءة', 'دهانات', 'ديكور', 'جبس',
  'مطابخ', 'أثاث', 'ستائر', 'حمامات', 'واجهات',
] as const

export const ALLOWED_LEAD_STATUSES = [
  'تم التواصل',
  'تمت الزيارة',
  'تمت البيعة',
  'لم يتم الاتفاق',
] as const

export type LeadStatus = typeof ALLOWED_LEAD_STATUSES[number]

const ALLOWED_BUDGETS = [
  'أقل من 10,000 ريال',
  '10,000 – 25,000 ريال',
  '25,000 – 50,000 ريال',
  '50,000 – 100,000 ريال',
  'أكثر من 100,000 ريال',
] as const

/* ── Schemas ──────────────────────────────────────────────── */

export const LeadSchema = z.object({
  name:     z.string().min(2, 'الاسم قصير جداً').max(100, 'الاسم طويل جداً').trim(),
  phone:    z.string().regex(phoneRegex, 'رقم الجوال غير صحيح (يجب أن يبدأ بـ +9665 ويتبعه 8 أرقام)'),
  email:    z.string().email().max(200).optional().or(z.literal('')),
  city:     z.enum(ALLOWED_CITIES as unknown as [string, ...string[]]).refine(Boolean, { message: 'المدينة غير مدعومة' }),
  services: z.array(z.enum(ALLOWED_SERVICES as unknown as [string, ...string[]])).min(1, 'اختر خدمة واحدة على الأقل').max(5),
  budget:   z.enum(ALLOWED_BUDGETS as unknown as [string, ...string[]]).refine(Boolean, { message: 'الميزانية غير صحيحة' }),
})

export const PartnerSchema = z.object({
  companyName:  z.string().min(2, 'اسم الشركة قصير جداً').max(150).trim(),
  contactName:  z.string().min(2, 'اسم التواصل قصير جداً').max(100).trim(),
  phone:        z.string().regex(phoneRegex, 'رقم الجوال غير صحيح'),
  services:     z.array(z.enum(ALLOWED_SERVICES as unknown as [string, ...string[]])).min(1).max(10),
  cities:       z.array(z.enum(ALLOWED_CITIES as unknown as [string, ...string[]])).min(1).max(10),
})

export const LeadStatusSchema = z.enum(
  ALLOWED_LEAD_STATUSES as unknown as [string, ...string[]]
)

export const UuidSchema = z.string().uuid('معرف غير صالح')
