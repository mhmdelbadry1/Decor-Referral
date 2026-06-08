import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteCompany } from '@/app/admin/actions/deleteCompany'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
import { createServerClient } from '@/lib/supabase'

let mockFrom: ReturnType<typeof vi.fn>

/** Leads query: from().select().eq().limit() — limit is terminal */
function makeLeadsChain(limitResult: unknown) {
  const chain: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'not', 'limit']) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  ;(chain.limit as ReturnType<typeof vi.fn>).mockResolvedValue(limitResult)
  return chain
}

/** Delete query: from().delete().eq() — eq is terminal */
function makeDeleteChain(eqResult: unknown = { error: null }) {
  const chain: Record<string, unknown> = {}
  chain.delete = vi.fn().mockReturnValue(chain)
  chain.eq     = vi.fn().mockResolvedValue(eqResult)
  return chain
}

beforeEach(() => {
  mockFrom = vi.fn()
  vi.mocked(createServerClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServerClient>)
})

describe('deleteCompany', () => {
  it('returns canBlacklist error when company has leads', async () => {
    const leadsChain = makeLeadsChain({ data: [{ id: 'lead-1' }], error: null })
    mockFrom.mockReturnValue(leadsChain)

    const result = await deleteCompany('co-1')
    expect(result.canBlacklist).toBe(true)
    expect(result.error).toBeDefined()
    expect(result.success).toBeUndefined()
  })

  it('deletes company when no leads exist', async () => {
    const leadsChain  = makeLeadsChain({ data: [], error: null })
    const deleteChain = makeDeleteChain({ error: null })

    let call = 0
    mockFrom.mockImplementation(() => (++call === 1 ? leadsChain : deleteChain))

    const result = await deleteCompany('co-1')
    expect(result).toEqual({ success: true })
    expect(deleteChain.delete).toHaveBeenCalled()
  })

  it('returns DB error when delete fails', async () => {
    const leadsChain  = makeLeadsChain({ data: [], error: null })
    const deleteChain = makeDeleteChain({ error: { message: 'FK violation' } })

    let call = 0
    mockFrom.mockImplementation(() => (++call === 1 ? leadsChain : deleteChain))

    const result = await deleteCompany('co-1')
    expect(result).toEqual({ error: 'FK violation' })
  })
})
