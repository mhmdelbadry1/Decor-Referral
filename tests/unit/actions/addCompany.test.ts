import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addCompany } from '@/app/admin/actions/addCompany'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
vi.mock('@/lib/getFormConfig', () => ({
  getFormConfig: vi.fn().mockResolvedValue({
    cities  : ['الرياض', 'جدة', 'الدمام'],
    services: ['ارضيات', 'دهانات', 'مطابخ'],
    budgets : [],
  }),
}))

import { createServerClient } from '@/lib/supabase'

let mockFrom: ReturnType<typeof vi.fn>

function makeChain(insertResult: unknown = { error: null }) {
  const chain: Record<string, unknown> = {}
  for (const m of ['insert']) chain[m] = vi.fn().mockResolvedValue(insertResult)
  return chain
}

function makeFormData(overrides: Record<string, string | string[]> = {}) {
  const base: Record<string, string | string[]> = {
    companyName: 'شركة الاتحاد',
    contactName: 'فهد السالم',
    phone      : '+966551234567',
    services   : ['دهانات'],
    cities     : ['جدة'],
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

describe('addCompany', () => {
  it('inserts company and returns success', async () => {
    const chain = makeChain({ error: null })
    mockFrom.mockReturnValue(chain)

    const result = await addCompany(null, makeFormData())
    expect(result).toEqual({ success: true })
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({
      name    : 'شركة الاتحاد',
      rep_name: 'فهد السالم',
    }))
  })

  it('rejects invalid phone format', async () => {
    const result = await addCompany(null, makeFormData({ phone: '12345' }))
    expect(result.error).toBeDefined()
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('rejects service not in config', async () => {
    const result = await addCompany(null, makeFormData({ services: ['خدمة غير موجودة'] }))
    expect(result.error).toBeDefined()
  })

  it('rejects city not in config', async () => {
    const result = await addCompany(null, makeFormData({ cities: ['باريس'] }))
    expect(result.error).toBeDefined()
  })

  it('returns DB error on insert failure', async () => {
    const chain = makeChain({ error: { message: 'duplicate key' } })
    mockFrom.mockReturnValue(chain)

    const result = await addCompany(null, makeFormData())
    expect(result.error).toContain('فشل')
  })

  it('accepts Egyptian phone', async () => {
    const chain = makeChain({ error: null })
    mockFrom.mockReturnValue(chain)

    const result = await addCompany(null, makeFormData({ phone: '+201012345678' }))
    expect(result).toEqual({ success: true })
  })
})
