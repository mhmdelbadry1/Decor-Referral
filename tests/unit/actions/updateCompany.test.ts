import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateCompany } from '@/app/admin/actions/updateCompany'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
vi.mock('@/lib/getFormConfig', () => ({
  getFormConfig: vi.fn().mockResolvedValue({
    cities  : ['الرياض', 'جدة', 'الدمام'],
    services: ['ارضيات', 'دهانات', 'مطابخ'],
    budgets : ['أقل من 10,000 ريال'],
  }),
}))

import { createServerClient } from '@/lib/supabase'

let mockFrom: ReturnType<typeof vi.fn>

function makeChain(eqResult: unknown = { error: null }) {
  const chain: Record<string, unknown> = {}
  for (const m of ['update', 'eq']) chain[m] = vi.fn().mockReturnValue(chain)
  ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue(eqResult)
  return chain
}

function makeFormData(overrides: Record<string, string | string[]> = {}) {
  const base: Record<string, string | string[]> = {
    companyName: 'شركة النخبة',
    contactName: 'محمد علي',
    phone      : '+966512345678',
    services   : ['ارضيات'],
    cities     : ['الرياض'],
    ...overrides,
  }
  const fd = new FormData()
  for (const [k, v] of Object.entries(base)) {
    if (Array.isArray(v)) v.forEach(item => fd.append(k, item))
    else fd.append(k, v)
  }
  return fd
}

beforeEach(() => {
  mockFrom = vi.fn()
  vi.mocked(createServerClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServerClient>)
})

describe('updateCompany', () => {
  it('returns validation error for invalid phone', async () => {
    const fd = makeFormData({ phone: '12345' })
    const result = await updateCompany('co-1', null, fd)
    expect(result.error).toBeDefined()
    expect(result.success).toBeUndefined()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns validation error for short company name', async () => {
    const fd = makeFormData({ companyName: 'ش' })
    const result = await updateCompany('co-1', null, fd)
    expect(result.error).toBeDefined()
  })

  it('returns validation error for city not in config', async () => {
    const fd = makeFormData({ cities: ['لندن'] })
    const result = await updateCompany('co-1', null, fd)
    expect(result.error).toBeDefined()
  })

  it('updates company and returns success', async () => {
    const chain = makeChain()
    mockFrom.mockReturnValue(chain)
    const fd = makeFormData()

    const result = await updateCompany('co-1', null, fd)
    expect(result).toEqual({ success: true })
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({
      name        : 'شركة النخبة',
      rep_name    : 'محمد علي',
      rep_whatsapp: '+966512345678',
    }))
    expect(chain.eq).toHaveBeenCalledWith('id', 'co-1')
  })

  it('accepts Egyptian phone', async () => {
    const chain = makeChain()
    mockFrom.mockReturnValue(chain)
    const fd = makeFormData({ phone: '+201012345678' })

    const result = await updateCompany('co-1', null, fd)
    expect(result).toEqual({ success: true })
  })

  it('returns DB error on failure', async () => {
    const chain = makeChain({ error: { message: 'unique violation' } })
    mockFrom.mockReturnValue(chain)
    const fd = makeFormData()

    const result = await updateCompany('co-1', null, fd)
    expect(result).toEqual({ error: 'unique violation' })
  })
})
