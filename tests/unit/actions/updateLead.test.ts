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
describe('reassignLeadAdmin', () => {
  it('sets status to "تم التواصل" when assigning company', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await reassignLeadAdmin('lead-1', 'company-1')
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'تم التواصل', company_id: 'company-1' }))
  })

  it('sets status to "معلق" when unassigning', async () => {
    const chain = makeChain({ error: null })
    ;(chain.eq as ReturnType<typeof vi.fn>).mockResolvedValue({ error: null })
    mockFrom.mockReturnValue(chain)

    await reassignLeadAdmin('lead-1', null)
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'معلق', company_id: null }))
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
