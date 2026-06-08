import { describe, it, expect, vi, beforeEach } from 'vitest'
import { blacklistCompany, unblacklistCompany } from '@/app/admin/actions/blacklistCompany'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
import { createServerClient } from '@/lib/supabase'

let mockFrom: ReturnType<typeof vi.fn>

function makeChain(eqResult: unknown = { error: null }) {
  const chain: Record<string, unknown> = {}
  for (const m of ['update', 'eq']) chain[m] = vi.fn().mockReturnValue(chain)
  ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue(eqResult)
  return chain
}

beforeEach(() => {
  mockFrom = vi.fn()
  vi.mocked(createServerClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServerClient>)
})

describe('blacklistCompany', () => {
  it('sets is_blacklisted to true', async () => {
    const chain = makeChain()
    mockFrom.mockReturnValue(chain)

    const result = await blacklistCompany('co-1')
    expect(result).toEqual({ success: true })
    expect(chain.update).toHaveBeenCalledWith({ is_blacklisted: true })
  })

  it('returns error on DB failure', async () => {
    const chain = makeChain({ error: { message: 'connection lost' } })
    mockFrom.mockReturnValue(chain)

    const result = await blacklistCompany('co-1')
    expect(result).toEqual({ error: 'connection lost' })
  })
})

describe('unblacklistCompany', () => {
  it('sets is_blacklisted to false', async () => {
    const chain = makeChain()
    mockFrom.mockReturnValue(chain)

    const result = await unblacklistCompany('co-1')
    expect(result).toEqual({ success: true })
    expect(chain.update).toHaveBeenCalledWith({ is_blacklisted: false })
  })

  it('returns error on DB failure', async () => {
    const chain = makeChain({ error: { message: 'timeout' } })
    mockFrom.mockReturnValue(chain)

    const result = await unblacklistCompany('co-1')
    expect(result).toEqual({ error: 'timeout' })
  })
})
