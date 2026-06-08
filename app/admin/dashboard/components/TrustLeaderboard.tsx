'use client'

import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCompany } from '@/app/admin/actions/deleteCompany'
import { updateCompany } from '@/app/admin/actions/updateCompany'

export interface CompanyLeaderboardRow {
  id          : string
  name        : string
  repName     : string | null
  repWhatsapp : string | null
  specialty   : string[]
  cities      : string[]
  received    : number
  claimed     : number
  verified    : number
  closed      : number
  trustScore  : number
  ratings     : { excellent: number; good: number; needsImprovement: number }
}

/* ── Shared styles ──────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  background  : 'var(--color-bg)',
  border      : '1px solid var(--color-line)',
  color       : 'var(--color-ink)',
  borderRadius: 'var(--radius)',
  fontSize    : '0.88rem',
  width       : '100%',
  padding     : '8px 12px',
  outline     : 'none',
  fontFamily  : 'var(--font-body)',
}

/* ── Sub-components ─────────────────────────────────────── */
function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--color-success)' : score >= 40 ? 'oklch(75% 0.14 70)' : 'oklch(65% 0.18 25)'
  const bg    = score >= 70 ? 'var(--color-success-bg)' : score >= 40 ? 'oklch(20% 0.06 70)' : 'oklch(18% 0.06 25)'
  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 font-body font-semibold tabular-nums"
      style={{ fontSize: '0.82rem', color, background: bg, minWidth: '3rem' }}
    >
      {score}%
    </span>
  )
}

function RatingSummary({ ratings }: { ratings: CompanyLeaderboardRow['ratings'] }) {
  const total = ratings.excellent + ratings.good + ratings.needsImprovement
  if (total === 0) {
    return <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}>—</span>
  }
  const parts: { label: string; count: number; color: string }[] = [
    { label: 'ممتاز',       count: ratings.excellent,        color: 'var(--color-success)' },
    { label: 'جيد',          count: ratings.good,             color: 'oklch(75% 0.14 70)'  },
    { label: 'يحتاج تحسين', count: ratings.needsImprovement, color: 'oklch(65% 0.18 25)'  },
  ].filter(p => p.count > 0)
  return (
    <span className="flex flex-col gap-0.5">
      {parts.map(p => (
        <span key={p.label} className="font-body" style={{ fontSize: '0.75rem', color: p.color }}>
          {p.count} {p.label}
        </span>
      ))}
    </span>
  )
}

function CheckGroup({ name, options, selected, cols = 3 }: {
  name    : string
  options : string[]
  selected: string[]
  cols?   : number
}) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map(opt => (
        <label
          key={opt}
          className="flex items-center gap-1.5 cursor-pointer rounded-md px-2 py-1.5 transition-colors duration-150"
          style={{ border: '1px solid var(--color-line)', background: 'var(--color-bg)' }}
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            defaultChecked={selected.includes(opt)}
            className="accent-accent w-3.5 h-3.5 shrink-0"
          />
          <span className="font-body" style={{ fontSize: '0.78rem', color: 'var(--color-ink-dim)' }}>{opt}</span>
        </label>
      ))}
    </div>
  )
}

/* ── Edit form (one per company row) ────────────────────── */
function EditCompanyForm({
  company,
  cities,
  services,
  onClose,
}: {
  company : CompanyLeaderboardRow
  cities  : string[]
  services: string[]
  onClose : () => void
}) {
  const boundAction           = updateCompany.bind(null, company.id)
  const [state, formAction, isPending] = useActionState(boundAction, null)

  useEffect(() => {
    if (state?.success) onClose()
  }, [state?.success, onClose])

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 p-4 rounded-lg mt-2"
      style={{ background: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="font-body font-medium mb-1" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            اسم الشركة *
          </p>
          <input type="text" name="companyName" required defaultValue={company.name} style={inputStyle} />
        </div>
        <div>
          <p className="font-body font-medium mb-1" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            اسم المندوب *
          </p>
          <input type="text" name="contactName" required defaultValue={company.repName ?? ''} style={inputStyle} />
        </div>
      </div>

      <div className="max-w-xs">
        <p className="font-body font-medium mb-1" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          رقم واتساب *
        </p>
        <input type="tel" name="phone" required dir="ltr" defaultValue={company.repWhatsapp ?? ''} style={{ ...inputStyle, letterSpacing: '0.04em' }} />
      </div>

      <div>
        <p className="font-body font-medium mb-2" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          التخصصات *
        </p>
        <CheckGroup name="services" options={services} selected={company.specialty} cols={3} />
      </div>

      <div>
        <p className="font-body font-medium mb-2" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          المناطق *
        </p>
        <CheckGroup name="cities" options={cities} selected={company.cities} cols={3} />
      </div>

      {state?.error && (
        <p className="font-body" style={{ fontSize: '0.82rem', color: 'oklch(65% 0.18 25)' }}>{state.error}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-lg font-body font-semibold text-sm flex items-center gap-1.5 transition-all duration-150 disabled:opacity-50"
          style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', fontSize: '0.85rem' }}
        >
          {isPending && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          {isPending ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-body transition-all duration-150"
          style={{ background: 'transparent', border: '1px solid var(--color-line)', color: 'var(--color-ink-faint)', fontSize: '0.85rem' }}
        >
          إلغاء
        </button>
      </div>
    </form>
  )
}

/* ── Main component ─────────────────────────────────────── */
export default function TrustLeaderboard({
  rows,
  cities,
  services,
}: {
  rows    : CompanyLeaderboardRow[]
  cities  : string[]
  services: string[]
}) {
  const router = useRouter()
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [deleteState, setDeleteState] = useState<Record<string, { confirm: boolean; pending: boolean; error?: string }>>({})

  const handleDelete = useCallback(async (companyId: string) => {
    setDeleteState(s => ({ ...s, [companyId]: { confirm: false, pending: true } }))
    const result = await deleteCompany(companyId)
    if (result.error) {
      setDeleteState(s => ({ ...s, [companyId]: { confirm: false, pending: false, error: result.error } }))
    } else {
      router.refresh()
    }
  }, [router])

  const ds = (id: string) => deleteState[id] ?? { confirm: false, pending: false }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}>
        <p className="font-body" style={{ color: 'var(--color-ink-faint)', fontSize: '0.9rem' }}>لا توجد شركات مسجلة حتى الآن</p>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    fontSize     : '0.68rem',
    color        : 'var(--color-ink-faint)',
    fontWeight   : 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding      : '0 12px 12px',
    textAlign    : 'start',
  }
  const tdStyle: React.CSSProperties = {
    fontSize : '0.9rem',
    color    : 'var(--color-ink-dim)',
    padding  : '14px 12px',
    textAlign: 'start',
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}>
      <div className="px-6 pt-6 pb-4">
        <h2 className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>
          مؤشر ثقة الشركات
        </h2>
        <p className="font-body mt-1" style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
          نسبة العملاء الذين أكدوا التواصل — مع إمكانية التعديل والحذف
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
              <th style={thStyle}>الشركة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>المرسلة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>الملتقطة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>التواصل</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>نقاط الثقة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>الصفقات</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>التقييمات</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const state   = ds(row.id)
              const isEditing = editingId === row.id
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: i < rows.length - 1 ? '1px solid var(--color-line)' : undefined,
                    background  : i % 2 === 1 ? 'var(--color-surface-warm)' : undefined,
                  }}
                >
                  <td style={{ ...tdStyle, color: 'var(--color-ink)', fontWeight: 600, minWidth: '180px' }}>
                    <span className="font-display">{row.name}</span>
                    {row.repName && (
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', fontWeight: 400, marginTop: '2px' }}>{row.repName}</p>
                    )}
                    {isEditing && (
                      <EditCompanyForm
                        company={row}
                        cities={cities}
                        services={services}
                        onClose={() => setEditingId(null)}
                      />
                    )}
                    {state.error && (
                      <p style={{ fontSize: '0.72rem', color: 'oklch(65% 0.18 25)', marginTop: '4px' }}>{state.error}</p>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.received}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.claimed}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.verified}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <TrustBadge score={row.trustScore} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span className="font-body font-semibold" style={{ color: row.closed > 0 ? 'var(--color-success)' : 'var(--color-ink-faint)' }}>
                      {row.closed}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <RatingSummary ratings={row.ratings} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', minWidth: '130px' }}>
                    <div className="flex flex-col gap-1.5 items-center">
                      {/* Edit button */}
                      <button
                        onClick={() => setEditingId(isEditing ? null : row.id)}
                        className="rounded-md px-2.5 py-1 font-body font-medium transition-colors duration-150 w-full"
                        style={{ fontSize: '0.72rem', background: isEditing ? 'oklch(20% 0.04 255)' : 'var(--color-accent-muted)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
                      >
                        {isEditing ? 'إغلاق' : 'تعديل'}
                      </button>

                      {/* Delete button or confirm */}
                      {!state.confirm ? (
                        <button
                          disabled={state.pending}
                          onClick={() => setDeleteState(s => ({ ...s, [row.id]: { confirm: true, pending: false } }))}
                          className="rounded-md px-2.5 py-1 font-body font-medium transition-colors duration-150 w-full disabled:opacity-50"
                          style={{ fontSize: '0.72rem', background: 'oklch(18% 0.06 25)', color: 'oklch(65% 0.18 25)', border: '1px solid oklch(35% 0.14 25)' }}
                        >
                          حذف
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1 w-full">
                          <p className="font-body text-center" style={{ fontSize: '0.65rem', color: 'oklch(65% 0.18 25)' }}>هل أنت متأكد؟</p>
                          <div className="flex gap-1">
                            <button
                              disabled={state.pending}
                              onClick={() => handleDelete(row.id)}
                              className="flex-1 rounded-md px-1.5 py-1 font-body font-semibold disabled:opacity-50"
                              style={{ fontSize: '0.7rem', background: 'oklch(65% 0.18 25)', color: 'white' }}
                            >
                              {state.pending ? '...' : 'نعم'}
                            </button>
                            <button
                              onClick={() => setDeleteState(s => ({ ...s, [row.id]: { confirm: false, pending: false } }))}
                              className="flex-1 rounded-md px-1.5 py-1 font-body"
                              style={{ fontSize: '0.7rem', background: 'var(--color-surface)', border: '1px solid var(--color-line)', color: 'var(--color-ink-faint)' }}
                            >
                              لا
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y" style={{ borderTop: '1px solid var(--color-line)' }}>
        {rows.map((row) => {
          const state     = ds(row.id)
          const isEditing = editingId === row.id
          return (
            <div key={row.id} className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-display font-semibold truncate" style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}>
                    {row.name}
                  </span>
                  <span className="font-body" style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>
                    {row.claimed} ملتقطة · {row.closed} مغلقة
                  </span>
                </div>
                <TrustBadge score={row.trustScore} />
              </div>

              {/* Ratings summary */}
              <div className="flex items-center gap-2">
                <span className="font-body" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)' }}>التقييمات:</span>
                <RatingSummary ratings={row.ratings} />
              </div>

              {/* Edit form */}
              {isEditing && (
                <EditCompanyForm
                  company={row}
                  cities={cities}
                  services={services}
                  onClose={() => setEditingId(null)}
                />
              )}
              {state.error && (
                <p className="font-body" style={{ fontSize: '0.75rem', color: 'oklch(65% 0.18 25)' }}>{state.error}</p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(isEditing ? null : row.id)}
                  className="flex-1 rounded-lg py-1.5 font-body font-medium transition-colors duration-150"
                  style={{ fontSize: '0.8rem', background: isEditing ? 'oklch(20% 0.04 255)' : 'var(--color-accent-muted)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}
                >
                  {isEditing ? 'إغلاق' : 'تعديل'}
                </button>

                {!state.confirm ? (
                  <button
                    disabled={state.pending}
                    onClick={() => setDeleteState(s => ({ ...s, [row.id]: { confirm: true, pending: false } }))}
                    className="flex-1 rounded-lg py-1.5 font-body font-medium transition-colors duration-150 disabled:opacity-50"
                    style={{ fontSize: '0.8rem', background: 'oklch(18% 0.06 25)', color: 'oklch(65% 0.18 25)', border: '1px solid oklch(35% 0.14 25)' }}
                  >
                    حذف
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="font-body text-center" style={{ fontSize: '0.7rem', color: 'oklch(65% 0.18 25)' }}>هل أنت متأكد؟</p>
                    <div className="flex gap-1">
                      <button
                        disabled={state.pending}
                        onClick={() => handleDelete(row.id)}
                        className="flex-1 rounded-md py-1 font-body font-semibold disabled:opacity-50"
                        style={{ fontSize: '0.78rem', background: 'oklch(65% 0.18 25)', color: 'white' }}
                      >
                        {state.pending ? '...' : 'نعم، احذف'}
                      </button>
                      <button
                        onClick={() => setDeleteState(s => ({ ...s, [row.id]: { confirm: false, pending: false } }))}
                        className="flex-1 rounded-md py-1 font-body"
                        style={{ fontSize: '0.78rem', background: 'var(--color-surface)', border: '1px solid var(--color-line)', color: 'var(--color-ink-faint)' }}
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
