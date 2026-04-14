import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { updateLeadStatus, type LeadStatus } from '@/app/update-lead/[token]/actions'
import ClaimButton from './ClaimButton'
import DeclineButton from './DeclineButton'
import CountdownTimer from './CountdownTimer'
import StatusButtons from '@/app/update-lead/[token]/StatusButtons'

export const dynamic = 'force-dynamic'

/* ── Helpers ──────────────────────────────────────────── */
function maskName(name: string): string {
  const first = name.trim().split(' ')[0]
  return `${first} ***`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-body font-medium"
        style={{ fontSize: '0.73rem', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
      >
        {label}
      </span>
      <span className="font-body" style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}>
        {value}
      </span>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────── */
export default async function ClaimPage({
  params,
}: {
  params: Promise<{ claimToken: string }>
}) {
  const { claimToken } = await params
  const supabase = createServerClient()

  /* Fetch broadcast → lead (with claiming company name) */
  const { data: broadcast } = await supabase
    .from('lead_broadcasts')
    .select(`
      claim_token,
      company_id,
      lead_id,
      leads (
        id, customer_name, customer_phone, city,
        services,
        budget, status, company_id, claimed_at,
        update_token, created_at,
        companies ( name )
      )
    `)
    .eq('claim_token', claimToken)
    .single()

  if (!broadcast || !broadcast.leads) notFound()

  type LeadRow = {
    id: string
    customer_name: string
    customer_phone: string
    city: string
    services: string[] | null
    budget: string | null
    status: string
    company_id: string | null
    claimed_at: string | null
    update_token: string
    created_at: string
    companies: { name: string } | null
  }

  // Supabase returns nested relation as array; take first element
  const rawLeads = broadcast.leads
  const lead = (Array.isArray(rawLeads) ? rawLeads[0] : rawLeads) as unknown as LeadRow

  if (!lead) notFound()

  // Resolve displayed services (handles old TEXT column + new TEXT[] column)
  const serviceList: string[] = lead.services || []

  // Determine state
  const isAvailable     = lead.company_id === null
  const isClaimedByMe   = lead.company_id === broadcast.company_id
  const isClaimedByOther = lead.company_id !== null && !isClaimedByMe

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-sm mx-auto pb-10">

        {/* ── Warning Banner ────────────────────────────── */}
        <div
          role="alert"
          style={{
            background: 'oklch(28% 0.18 25)',
            borderBottom: '3px solid oklch(50% 0.22 25)',
          }}
          className="px-5 py-5"
        >
          <div className="flex items-start gap-3 mb-1">
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'oklch(97% 0.02 25)', flexShrink: 0, marginTop: 2 }}
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p
              className="font-body font-bold"
              style={{ fontSize: '0.93rem', color: 'oklch(97% 0.02 25)' }}
            >
              هذا الرابط خاص بشركتك فقط. لا تشاركه مع أحد.
            </p>
          </div>
          <p
            className="font-body"
            style={{ fontSize: '0.83rem', color: 'oklch(80% 0.03 25)', paddingRight: '30px' }}
          >
            الأولوية للأسرع — أول شركة تضغط &ldquo;التقاط&rdquo; تحصل على العميل.
          </p>
        </div>

        <div className="px-4 py-6 flex flex-col gap-5">

          {/* ── STATE C: Already taken by someone else ─── */}
          {isClaimedByOther && (
            <div
              className="rounded-lg p-6 flex flex-col items-center text-center gap-4"
              style={{
                background: 'oklch(16% 0.06 25)',
                border: '1px solid oklch(35% 0.16 25)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(22% 0.10 25)' }}
                aria-hidden="true"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'oklch(65% 0.18 25)' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h1
                  className="font-display font-bold mb-2"
                  style={{ fontSize: '1.2rem', color: 'oklch(85% 0.04 25)' }}
                >
                  تم التقاط هذا الطلب
                </h1>
                <p className="font-body" style={{ fontSize: '0.93rem', color: 'oklch(65% 0.04 25)' }}>
                  سبقتك شركة أخرى في التقاط هذا العميل.
                  <br />
                  حظاً أوفر في الطلب القادم!
                </p>
              </div>
            </div>
          )}

          {/* ── STATE A: Available — show masked info + claim button ── */}
          {isAvailable && (
            <>
              <div
                className="rounded-lg p-5 flex flex-col gap-4"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                }}
              >
                {/* Availability badge */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'var(--color-success)' }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-body font-medium"
                    style={{ fontSize: '0.78rem', color: 'var(--color-success)' }}
                  >
                    متاح الآن
                  </span>
                </div>

                <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <InfoRow label="اسم العميل" value={maskName(lead.customer_name)} />
                  <InfoRow label="المدينة" value={lead.city} />
                  <InfoRow
                    label="الخدمة"
                    value={serviceList.join('، ') || '—'}
                  />
                  {lead.budget && <InfoRow label="الميزانية" value={lead.budget} />}
                </div>

                {lead.created_at && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-ink-faint)',
                      borderTop: '1px solid var(--color-line)',
                      paddingTop: '10px',
                    }}
                  >
                    تاريخ الطلب: {formatDate(lead.created_at)}
                  </p>
                )}
              </div>

              <ClaimButton claimToken={claimToken} />

              <p
                className="font-body text-center"
                style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}
              >
                عند الضغط سيُكشف لك رقم العميل ويُسجَّل الطلب باسم شركتك
              </p>
            </>
          )}

          {/* ── STATE B: Claimed by me — show full info + status + timer ── */}
          {isClaimedByMe && (
            <>
              {/* Timeout warning */}
              {lead.claimed_at && (
                <div
                  className="rounded-lg px-4 py-3 flex items-center justify-between gap-3"
                  style={{
                    background: 'oklch(20% 0.06 70)',
                    border: '1px solid oklch(40% 0.12 70)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'oklch(75% 0.14 70)', flexShrink: 0 }}
                      aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      className="font-body"
                      style={{ fontSize: '0.82rem', color: 'oklch(75% 0.14 70)' }}
                    >
                      الوقت المتبقي للتحديث
                    </span>
                  </div>
                  <CountdownTimer claimedAt={lead.claimed_at} />
                </div>
              )}

              {/* Full lead info card */}
              <div
                className="rounded-lg p-5 flex flex-col gap-4"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h1
                    className="font-display font-bold"
                    style={{ fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', color: 'var(--color-ink)' }}
                  >
                    {lead.customer_name}
                  </h1>
                  <span
                    className="font-body font-medium px-3 py-1 rounded-full"
                    style={{
                      fontSize: '0.73rem',
                      background: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                    }}
                  >
                    التقطته أنت
                  </span>
                </div>

                <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <InfoRow label="رقم الجوال" value={lead.customer_phone} />
                  <InfoRow label="المدينة" value={lead.city} />
                  <InfoRow
                    label="الخدمة"
                    value={serviceList.join('، ') || '—'}
                  />
                  {lead.budget && <InfoRow label="الميزانية" value={lead.budget} />}
                </div>

                {lead.created_at && (
                  <p
                    className="font-body"
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-ink-faint)',
                      borderTop: '1px solid var(--color-line)',
                      paddingTop: '10px',
                    }}
                  >
                    تاريخ الطلب: {formatDate(lead.created_at)}
                  </p>
                )}
              </div>

              {/* Status update */}
              <div className="flex flex-col gap-3">
                <h2
                  className="font-body font-bold"
                  style={{ fontSize: '0.85rem', color: 'var(--color-ink-dim)', letterSpacing: '0.05em' }}
                >
                  تحديث الحالة
                </h2>
                <StatusButtons
                  token={lead.update_token}
                  currentStatus={lead.status}
                />
              </div>

              {/* Decline */}
              <div
                style={{
                  borderTop: '1px solid var(--color-line)',
                  paddingTop: '16px',
                  marginTop: '4px',
                }}
              >
                <p
                  className="font-body mb-3"
                  style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}
                >
                  إذا كان العميل غير مناسب لشركتك يمكنك إعادته للمجموعة
                </p>
                <DeclineButton claimToken={claimToken} />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
