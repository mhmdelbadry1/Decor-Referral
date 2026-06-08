import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteCompany } from '@/app/admin/actions/deleteCompany'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
import { createServerClient } from '@/lib/supabase'

let mockFrom: ReturnType<typeof vi.fn>

function makeChain(limitResult: unknown) {
  const chain: Record<string, unknown> = {}
  for (const m of ['select', 'delete', 'eq', 'not', 'limit']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  ;(chain.limit as ReturnType<typeof vi.fn>).mockResolvedValue(limitResult)
  ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
  return chain
}

beforeEach(() => {
  mockFrom = vi.fn()
  vi.mocked(createServerClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServerClient>)
})

describe('deleteCompany', () => {
  it('returns canBlacklist error when company has leads', async () => {
    const leadsChain = makeChain({ data: [{ id: 'lead-1' }], error: null })
    mockFrom.mockReturnValue(leadsChain)

    const result = await deleteCompany('co-1')
    expect(result.canBlacklist).toBe(true)
    expect(result.error).toContain('قائمة السوداء')
    expect(result.success).toBeUndefined()
  })

  it('deletes company when no leads exist', async () => {
    const leadsChain = makeChain({ data: [], error: null })
    const deleteChain = makeChain({ data: null, error: null })
    ;(deleteChain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })

    let call = 0
    mockFrom.mockImplementation(() => (++call === 1 ? leadsChain : deleteChain))

    const result = await deleteCompany('co-1')
    expect(result).toEqual({ success: true })
    expect(deleteChain.delete).toHaveBeenCalled()
  })

  it('returns DB error when delete fails', async () => {
    const leadsChain = makeChain({ data: [], error: null })
    const deleteChain = makeChain({ data: null, error: null })
    ;(deleteChain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: { message: 'FK violation' } })

    let call = 0
    mockFrom.mockImplementation(() => (++call === 1 ? leadsChain : deleteChain))

    const result = await deleteCompany('co-1')
    expect(result).toEqual({ error: 'FK violation' })
  })
})
