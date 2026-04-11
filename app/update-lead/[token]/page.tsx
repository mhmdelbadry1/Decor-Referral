import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import StatusButtons from './StatusButtons'

export const dynamic = 'force-dynamic'

/* ── Helpers ──────────────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-body font-medium"
        style={{ fontSize: '0.73rem', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
      >
        {label}
      </span>
      <span
        className="font-body"
        style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}
      >
        {value}
      </span>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/* ── Page ─────────────────────────────────────────────── */
export default async function UpdateLeadPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const supabase = createServerClient()
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*, companies(name)')
    .eq('update_token', token)
    .single()

  if (error || !lead) notFound()

  const company = (lead.companies as { name: string } | null)?.name ?? '—'

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}
    >
      <div className="max-w-sm mx-auto">

        {/* ── Warning Banner ──────────────────────────── */}
        <div
          role="alert"
          style={{
            background: 'oklch(28% 0.18 25)',
            borderBottom: '3px solid oklch(50% 0.22 25)',
          }}
          className="px-5 py-5"
        >
          <div className="flex items-start gap-3 mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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
              تحذير: هذا الرابط خاص بك أنت فقط. لا تشاركه مع أحد.
              أي تلاعب في البيانات يؤدي إلى إلغاء تسجيلك فوراً.
            </p>
          </div>
          <p
            className="font-body"
            style={{ fontSize: '0.87rem', color: 'oklch(85% 0.03 25)', paddingRight: '30px' }}
          >
            التأخر في تحديث الحالة أو عدم إعلامنا بآخر التطورات
            سيؤدي إلى إيقاف إرسال العملاء إليكم.
          </p>
        </div>

        {/* ── Main content ────────────────────────────── */}
        <div className="px-4 py-6 flex flex-col gap-6">

          {/* Lead info card */}
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
                {lead.customer_name ?? 'عميل'}
              </h1>
              <span
                className="font-body font-medium px-3 py-1 rounded-full"
                style={{
                  fontSize: '0.75rem',
                  background: 'var(--color-accent-muted)',
                  color: 'var(--color-accent)',
                }}
              >
                {company}
              </span>
            </div>

            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              <InfoRow label="رقم الجوال" value={lead.customer_phone ?? '—'} />
              <InfoRow label="المدينة" value={lead.city ?? '—'} />
              <InfoRow label="الخدمة" value={
                Array.isArray(lead.services)
                  ? lead.services.join('، ')
                  : (lead.service ?? '—')
              } />
              <InfoRow label="الميزانية" value={lead.budget ?? '—'} />
            </div>

            {lead.created_at && (
              <p
                className="font-body"
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--color-ink-faint)',
                  borderTop: '1px solid var(--color-line)',
                  paddingTop: '12px',
                }}
              >
                تاريخ الطلب: {formatDate(lead.created_at)}
              </p>
            )}
          </div>

          {/* Status section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2
                className="font-body font-bold"
                style={{ fontSize: '0.85rem', color: 'var(--color-ink-dim)', letterSpacing: '0.05em' }}
              >
                تحديث الحالة
              </h2>
              <span
                className="font-body font-medium px-3 py-1 rounded-full"
                style={{
                  fontSize: '0.75rem',
                  background: 'var(--color-surface)',
                  color: 'var(--color-ink-faint)',
                  border: '1px solid var(--color-line)',
                }}
              >
                الحالي: {lead.status ?? 'جديد'}
              </span>
            </div>

            <StatusButtons token={token} currentStatus={lead.status ?? 'جديد'} />
          </div>

        </div>
      </div>
    </div>
  )
}
