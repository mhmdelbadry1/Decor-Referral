import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { updateLeadStatus, type LeadStatus } from '@/app/update-lead/[token]/actions'
import ClaimButton from './ClaimButton'
import DeclineButton from './DeclineButton'
import CountdownTimer from './CountdownTimer'
import WarningTimer from './WarningTimer'
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
        warning_sent_at, declined_by,
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
    warning_sent_at: string | null
    declined_by: string[] | null
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
  const isBanned         = !!(lead.declined_by?.includes(broadcast.company_id))
  const isAvailable      = lead.company_id === null && !isBanned
  const isClaimedByMe    = lead.company_id === broadcast.company_id
  const isClaimedByOther = lead.company_id !== null && !isClaimedByMe
  const isUnderWarning   = isClaimedByMe && !!lead.warning_sent_at

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

          {/* ── STATE D: Banned — company was removed from this lead ── */}
          {isBanned && (
            <div
              className="rounded-lg p-6 flex flex-col items-center text-center gap-4"
              style={{
                background: 'oklch(15% 0.05 20)',
                border: '1px solid oklch(30% 0.12 20)',
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'oklch(20% 0.08 20)' }}
                aria-hidden="true"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'oklch(55% 0.16 20)' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <div>
                <h1
                  className="font-display font-bold mb-2"
                  style={{ fontSize: '1.2rem', color: 'oklch(80% 0.04 20)' }}
                >
                  انتهت صلاحيتك على هذا الطلب
                </h1>
                <p className="font-body" style={{ fontSize: '0.88rem', color: 'oklch(55% 0.04 20)', lineHeight: 1.6 }}>
                  تم سحب هذا العميل من شركتك بسبب انتهاء وقت التواصل أو إفادة العميل بعدم التواصل.
                  <br />
                  لا يمكن التقاط هذا الطلب مرة أخرى.
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
              {/* ── Yellow Card Warning (False Claim path) ── */}
              {isUnderWarning && lead.warning_sent_at && (
                <div
                  className="rounded-lg px-4 py-4 flex flex-col gap-3"
                  style={{
                    background: 'oklch(18% 0.07 50)',
                    border: '2px solid oklch(55% 0.16 50)',
                  }}
                  role="alert"
                >
                  <div className="flex items-start gap-2">
                    <svg
                      width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'oklch(75% 0.16 50)', flexShrink: 0, marginTop: 1 }}
                      aria-hidden="true"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p
                      className="font-body font-bold"
                      style={{ fontSize: '0.9rem', color: 'oklch(85% 0.14 50)' }}
                    >
                      تحذير: العميل أفاد بعدم التواصل
                    </p>
                  </div>
                  <p
                    className="font-body"
                    style={{ fontSize: '0.82rem', color: 'oklch(68% 0.10 50)', paddingRight: '26px' }}
                  >
                    اتصل بالعميل فوراً وحدّث الحالة. إذا لم يُحسم الأمر خلال الوقت المحدد سيُسحب الطلب تلقائياً.
                  </p>
                  <div
                    className="flex items-center justify-between rounded-md px-3 py-2"
                    style={{ background: 'oklch(14% 0.05 50)' }}
                  >
                    <span
                      className="font-body"
                      style={{ fontSize: '0.78rem', color: 'oklch(60% 0.08 50)' }}
                    >
                      الوقت المتبقي للتصحيح
                    </span>
                    <WarningTimer warningSentAt={lead.warning_sent_at} />
                  </div>
                </div>
              )}

              {/* ── Normal 2-hour countdown (initial contact state only, no warning active) ── */}
              {!isUnderWarning && lead.status === 'تم التواصل' && lead.claimed_at && (
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

                {/* One-way warning */}
                <div
                  className="rounded-lg px-4 py-3 flex flex-col gap-2"
                  style={{
                    background: 'oklch(20% 0.10 25)',
                    border: '1px solid oklch(40% 0.16 25)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'oklch(65% 0.18 25)', flexShrink: 0, marginTop: '2px' }}
                      aria-hidden="true"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p
                      className="font-body"
                      style={{ fontSize: '0.8rem', color: 'oklch(72% 0.14 25)', lineHeight: 1.55 }}
                    >
                      الحالة التي تختارها <strong>لا يمكن التراجع عنها</strong> — كن صادقاً مع النظام.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/966542197220"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-body"
                    style={{ fontSize: '0.78rem', color: 'oklch(60% 0.10 25)', textDecoration: 'none', paddingRight: '22px' }}
                  >
                    <svg
                      width="13" height="13" viewBox="0 0 24 24"
                      fill="currentColor" aria-hidden="true"
                      style={{ color: 'oklch(65% 0.14 145)', flexShrink: 0 }}
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    إذا واجهت أي مشكلة لا تتردد في التواصل معنا
                  </a>
                </div>
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
