import { describe, it, expect } from 'vitest'
import { buildLeadSchema, buildPartnerSchema } from '@/lib/validators'

const CONFIG = {
  cities  : ['الرياض', 'جدة', 'الدمام'],
  services: ['ارضيات', 'دهانات', 'مطابخ'],
  budgets : ['أقل من 10,000 ريال', '10,000 – 25,000 ريال'],
}

describe('buildLeadSchema', () => {
  const schema = buildLeadSchema(CONFIG)

  it('accepts valid lead data', () => {
    const result = schema.safeParse({
      name    : 'أحمد محمد',
      phone   : '+966512345678',
      city    : 'الرياض',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
      email   : '',
    })
    expect(result.success).toBe(true)
  })

  it('accepts Egyptian phone (+20)', () => {
    const result = schema.safeParse({
      name    : 'أحمد محمد',
      phone   : '+201012345678',
      city    : 'الرياض',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
    })
    expect(result.success).toBe(true)
  })

  it('rejects phone not in E.164 format', () => {
    const result = schema.safeParse({
      name    : 'أحمد',
      phone   : '0512345678',
      city    : 'الرياض',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name shorter than 2 chars', () => {
    const result = schema.safeParse({
      name    : 'أ',
      phone   : '+966512345678',
      city    : 'الرياض',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
    })
    expect(result.success).toBe(false)
  })

  it('rejects city not in config list', () => {
    const result = schema.safeParse({
      name    : 'أحمد',
      phone   : '+966512345678',
      city    : 'لندن',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty services array', () => {
    const result = schema.safeParse({
      name    : 'أحمد',
      phone   : '+966512345678',
      city    : 'الرياض',
      services: [],
      budget  : 'أقل من 10,000 ريال',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid optional email', () => {
    const result = schema.safeParse({
      name    : 'أحمد',
      phone   : '+966512345678',
      city    : 'الرياض',
      services: ['ارضيات'],
      budget  : 'أقل من 10,000 ريال',
      email   : 'test@example.com',
    })
    expect(result.success).toBe(true)
  })
})

describe('buildPartnerSchema', () => {
  const schema = buildPartnerSchema(CONFIG)

  it('accepts valid partner data', () => {
    const result = schema.safeParse({
      companyName: 'شركة النخبة',
      contactName: 'محمد علي',
      phone      : '+966512345678',
      services   : ['ارضيات'],
      cities     : ['الرياض'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts Egyptian phone for partner', () => {
    const result = schema.safeParse({
      companyName: 'شركة النخبة',
      contactName: 'محمد علي',
      phone      : '+201012345678',
      services   : ['ارضيات'],
      cities     : ['الرياض'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects short company name', () => {
    const result = schema.safeParse({
      companyName: 'ش',
      contactName: 'محمد علي',
      phone      : '+966512345678',
      services   : ['ارضيات'],
      cities     : ['الرياض'],
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty cities array', () => {
    const result = schema.safeParse({
      companyName: 'شركة النخبة',
      contactName: 'محمد علي',
      phone      : '+966512345678',
      services   : ['ارضيات'],
      cities     : [],
    })
    expect(result.success).toBe(false)
  })
})
