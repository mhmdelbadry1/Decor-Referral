import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  updateLeadStatusAdmin,
  reassignLeadAdmin,
  releaseLeadAdmin,
  clearDeclinedListAdmin,
  updateLeadRatingAdmin,
} from '@/app/admin/actions/updateLead'

vi.mock('@/lib/supabase', () => ({ createServerClient: vi.fn() }))
import { createServerClient } from '@/lib/supabase'

/* ── helpers ─────────────────────────────────────────────── */
function makeChain(terminal: Record<string, unknown> = { error: null }) {
  const chain: Record<string, unknown> = {}
  const methods = ['select', 'update', 'eq', 'not', 'limit', 'single']
  for (const m of methods) chain[m] = vi.fn().mockReturnValue(chain)
  // last call in each chain resolves
  ;(chain.limit as ReturnType<typeof vi.fn>).mockResolvedValue(terminal)
  ;(chain.single as ReturnType<typeof vi.fn>).mockResolvedValue(terminal)
  return chain
}

let mockFrom: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFrom = vi.fn()
  vi.mocked(createServerClient).mockReturnValue({ from: mockFrom } as ReturnType<typeof createServerClient>)
})

/* ── updateLeadRatingAdmin ───────────────────────────────── */
describe('updateLeadRatingAdmin', () => {
  it('rejects invalid rating value', async () => {
    const result = await updateLeadRatingAdmin('lead-1', 'سيء')
    expect(result).toEqual({ error: 'تقييم غير صالح' })
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it.each(['ممتاز', 'جيد', 'يحتاج تحسين'])('accepts valid rating "%s"', async (rating) => {
    const updateChain = makeChain({ error: null })
    ;(updateChain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(updateChain)

    const result = await updateLeadRatingAdmin('lead-1', rating)
    expect(result).toEqual({ success: true })
  })

  it('clears rating when null passed', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    const result = await updateLeadRatingAdmin('lead-1', null)
    expect(result).toEqual({ success: true })
    expect(chain.update).toHaveBeenCalledWith({ sale_rating: null })
  })

  it('returns DB error on failure', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: { message: 'db error' } })
    mockFrom.mockReturnValue(chain)

    const result = await updateLeadRatingAdmin('lead-1', 'ممتاز')
    expect(result).toEqual({ error: 'db error' })
  })
})

/* ── updateLeadStatusAdmin ───────────────────────────────── */
describe('updateLeadStatusAdmin', () => {
  it('rejects invalid status', async () => {
    const result = await updateLeadStatusAdmin('lead-1', 'حالة وهمية')
    expect(result).toEqual({ error: 'حالة غير صالحة' })
  })

  it('blocks "معلق" when company is assigned', async () => {
    const chain = makeChain({ data: { company_id: 'co-1' }, error: null })
    mockFrom.mockReturnValue(chain)

    const result = await updateLeadStatusAdmin('lead-1', 'معلق')
    expect(result.error).toBeDefined()
    expect(result.error).toContain('معلق')
  })

  it('allows "معلق" when no company', async () => {
    const selectChain = makeChain({ data: { company_id: null }, error: null })
    const updateChain = makeChain({ error: null })
    ;(updateChain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })

    let callCount = 0
    mockFrom.mockImplementation(() => {
      callCount++
      return callCount === 1 ? selectChain : updateChain
    })

    const result = await updateLeadStatusAdmin('lead-1', 'معلق')
    expect(result).toEqual({ success: true })
  })

  it.each(['تم التواصل', 'تمت الزيارة', 'تمت البيعة', 'لم يتم الاتفاق', 'مؤرشف'])(
    'accepts valid status "%s"',
    async (status) => {
      const chain = makeChain({ error: null })
      ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
      mockFrom.mockReturnValue(chain)
      const result = await updateLeadStatusAdmin('lead-1', status)
      expect(result).toEqual({ success: true })
    }
  )
})

/* ── reassignLeadAdmin ───────────────────────────────────── */

/** select chain: .select().eq().single() */
function makeSelectChain(status: string) {
  const c = { select: vi.fn(), eq: vi.fn(), single: vi.fn() }
  c.select.mockReturnValue(c)
  c.eq.mockReturnValue(c)
  c.single.mockResolvedValue({ data: { status }, error: null })
  return c
}

/** update chain: .update().eq() — eq is terminal */
function makeUpdateChain(eqResult: unknown = { error: null }) {
  const c = { update: vi.fn(), eq: vi.fn() }
  c.update.mockReturnValue(c)
  c.eq.mockResolvedValue(eqResult)
  return c
}

describe('reassignLeadAdmin', () => {
  it('resets to "معلق" + clears timestamps when status was non-معلق', async () => {
    const selectChain = makeSelectChain('تم التواصل')
    const updateChain = makeUpdateChain()
    let call = 0
    mockFrom.mockImplementation(() => ++call === 1 ? selectChain : updateChain)

    await reassignLeadAdmin('lead-1', 'company-1')

    expect(updateChain.update).toHaveBeenCalledWith({
      company_id          : 'company-1',
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
      customer_feedback   : null,
    })
  })

  it('bumps through مؤرشف first when status is already معلق', async () => {
    const selectChain = makeSelectChain('معلق')
    const bumpChain   = makeUpdateChain()
    const finalChain  = makeUpdateChain()
    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return selectChain
      if (call === 2) return bumpChain
      return finalChain
    })

    await reassignLeadAdmin('lead-1', 'company-2')

    expect(bumpChain.update).toHaveBeenCalledWith({ status: 'مؤرشف' })
    expect(finalChain.update).toHaveBeenCalledWith({
      company_id          : 'company-2',
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
      customer_feedback   : null,
    })
  })

  it('resets to "معلق" + clears all when unassigning', async () => {
    const selectChain = makeSelectChain('تمت الزيارة')
    const updateChain = makeUpdateChain()
    let call = 0
    mockFrom.mockImplementation(() => ++call === 1 ? selectChain : updateChain)

    await reassignLeadAdmin('lead-1', null)

    expect(updateChain.update).toHaveBeenCalledWith({
      company_id          : null,
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
      customer_feedback   : null,
    })
  })
})

/* ── releaseLeadAdmin ────────────────────────────────────── */
describe('releaseLeadAdmin', () => {
  it('clears company, claimed_at, warning, verification and sets معلق', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await releaseLeadAdmin('lead-1')
    expect(chain.update).toHaveBeenCalledWith({
      company_id          : null,
      status              : 'معلق',
      claimed_at          : null,
      warning_sent_at     : null,
      contact_verified_at : null,
    })
  })
})

/* ── clearDeclinedListAdmin ──────────────────────────────── */
describe('clearDeclinedListAdmin', () => {
  it('resets declined_by to empty array', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await clearDeclinedListAdmin('lead-1')
    expect(chain.update).toHaveBeenCalledWith({ declined_by: [] })
  })
})
