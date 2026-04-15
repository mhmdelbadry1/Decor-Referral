'use client'

import { useState, useCallback } from 'react'
import { useRouter }             from 'next/navigation'
import {
  updateLeadStatusAdmin,
  reassignLeadAdmin,
  releaseLeadAdmin,
  clearDeclinedListAdmin,
} from '@/app/admin/actions/updateLead'

/* ── Types ──────────────────────────────────────────────── */
export type LeadRecord = {
  id                 : string
  customer_name      : string
  customer_phone     : string
  city               : string
  services           : string[]
  budget             : string
  status             : string
  company_id         : string | null
  company_name       : string | null
  claimed_at         : string | null
  warning_sent_at    : string | null
  contact_verified_at: string | null
  declined_by        : string[]
  created_at         : string
}

export type CompanyOption = {
  id          : string
  name        : string
  rep_name    : string | null
  rep_whatsapp: string | null
  specialty   : string[]
  city        : string[]
}

/* ── Constants ──────────────────────────────────────────── */
// Statuses only valid when a company is assigned
const ASSIGNED_STATUSES = ['تم التواصل', 'تمت الزيارة', 'تمت البيعة', 'لم يتم الاتفاق']

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  'معلق'          : { color: 'var(--color-ink-faint)',  bg: 'var(--color-surface-warm)' },
  'تم التواصل'    : { color: 'var(--color-secondary)',  bg: 'oklch(18% 0.06 235)' },
  'تمت الزيارة'   : { color: 'oklch(75% 0.14 70)',      bg: 'oklch(20% 0.06 70)' },
  'تمت البيعة'    : { color: 'var(--color-success)',    bg: 'var(--color-success-bg)' },
  'لم يتم الاتفاق': { color: 'oklch(65% 0.18 25)',      bg: 'oklch(18% 0.06 25)' },
}

/* ── Icons ──────────────────────────────────────────────── */
const IC = 'none'  // fill shorthand

function IconBuilding({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconRotate({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-3.84"/>
    </svg>
  )
}

function IconRules({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )
}

function IconBan({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
}

function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function IconAlert({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function IconUndo({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 14l-4-4 4-4"/>
      <path d="M5 10h11a4 4 0 0 1 0 8h-1"/>
    </svg>
  )
}

function IconUserX({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="17" y1="8" x2="23" y2="14"/>
      <line x1="23" y1="8" x2="17" y2="14"/>
    </svg>
  )
}

function IconPhone({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function IconPerson({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconTag({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={IC} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}

/* ── Company detail card ────────────────────────────────── */
function CompanyCard({ company }: { company: CompanyOption }) {
  const waNumber = company.rep_whatsapp?.replace(/\D/g, '') ?? ''
  return (
    <div
      className="flex flex-col gap-1.5 mt-2 pt-2"
      style={{ borderTop: '1px solid var(--color-line)' }}
    >
      {company.rep_name && (
        <p className="flex items-center gap-1.5 font-body" style={{ fontSize: '0.71rem', color: 'var(--color-ink-dim)' }}>
          <span style={{ color: 'var(--color-ink-faint)', flexShrink: 0 }}><IconPerson size={11} /></span>
          {company.rep_name}
        </p>
      )}
      {company.rep_whatsapp && (
        <a
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-body"
          dir="ltr"
          style={{ fontSize: '0.71rem', color: 'var(--color-success)', textDecoration: 'none' }}
        >
          <span style={{ flexShrink: 0 }}><IconPhone size={11} /></span>
          {company.rep_whatsapp}
        </a>
      )}
      {company.specialty.length > 0 && (
        <p className="flex items-start gap-1.5 font-body" style={{ fontSize: '0.71rem', color: 'var(--color-ink-faint)' }}>
          <span style={{ flexShrink: 0, marginTop: '1px' }}><IconTag size={11} /></span>
          <span>{company.specialty.join('، ')}</span>
        </p>
      )}
      {company.city.length > 0 && (
        <p className="flex items-start gap-1.5 font-body" style={{ fontSize: '0.71rem', color: 'var(--color-ink-faint)' }}>
          <span style={{ flexShrink: 0, marginTop: '1px' }}><IconBuilding size={11} /></span>
          <span>{company.city.join('، ')}</span>
        </p>
      )}
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })
}

function shortId(id: string) {
  return id.slice(0, 6).toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? STATUS_COLORS['معلق']
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-body font-medium whitespace-nowrap"
      style={{ fontSize: '0.72rem', color: s.color, background: s.bg }}
    >
      {status}
    </span>
  )
}

function Spinner() {
  return (
    <span
      className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
      aria-hidden="true"
      style={{ color: 'var(--color-ink-faint)' }}
    />
  )
}

/* ── Main component ─────────────────────────────────────── */
export default function LeadsTable({
  leads: initialLeads,
  companies,
}: {
  leads    : LeadRecord[]
  companies: CompanyOption[]
}) {
  const router = useRouter()

  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [pendingId,     setPendingId]     = useState<string | null>(null)
  const [errorRow,      setErrorRow]      = useState<{ id: string; msg: string } | null>(null)

  const companyMap = new Map(companies.map(c => [c.id, c]))

  /* Run any admin action on a lead row */
  const runAction = useCallback(
    async (leadId: string, action: () => Promise<{ error?: string; success?: boolean }>) => {
      if (pendingId) return
      setErrorRow(null)
      setPendingId(leadId)
      try {
        const result = await action()
        if (result?.error) {
          setErrorRow({ id: leadId, msg: result.error })
        } else {
          router.refresh()
        }
      } catch {
        setErrorRow({ id: leadId, msg: 'حدث خطأ غير متوقع' })
      } finally {
        setPendingId(null)
      }
    },
    [pendingId, router],
  )

  /* Company change handler — couples status automatically */
  const handleCompanyChange = useCallback(
    (lead: LeadRecord, newCompanyId: string) => {
      if (!newCompanyId) {
        // Clearing company → full release back to معلق
        runAction(lead.id, () => releaseLeadAdmin(lead.id))
      } else {
        // Assigning company → sets status = تم التواصل + claimed_at stamp
        runAction(lead.id, () => reassignLeadAdmin(lead.id, newCompanyId))
      }
    },
    [runAction],
  )

  /* Status change handler — only allowed when company is assigned */
  const handleStatusChange = useCallback(
    (lead: LeadRecord, newStatus: string) => {
      runAction(lead.id, () => updateLeadStatusAdmin(lead.id, newStatus))
    },
    [runAction],
  )

  /* Filtering */
  const filtered = initialLeads.filter(lead => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false
    if (companyFilter === '__unassigned' && lead.company_id !== null) return false
    if (companyFilter !== 'all' && companyFilter !== '__unassigned' && lead.company_id !== companyFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !lead.customer_name.toLowerCase().includes(q) &&
        !lead.city.toLowerCase().includes(q) &&
        !lead.customer_phone.includes(q)
      ) return false
    }
    return true
  })

  const selectBase: React.CSSProperties = {
    background  : 'var(--color-bg)',
    border      : '1px solid var(--color-line)',
    color       : 'var(--color-ink-dim)',
    borderRadius: 'var(--radius)',
    fontSize    : '0.82rem',
    padding     : '5px 8px',
    fontFamily  : 'var(--font-body)',
    cursor      : 'pointer',
    outline     : 'none',
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Filter Bar ───────────────────────────────────── */}
      <div
        className="rounded-xl p-4 flex flex-wrap gap-3 items-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
      >
        <input
          type="search"
          placeholder="بحث بالاسم أو المدينة أو الهاتف..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1 rounded-lg px-3 py-2 font-body"
          style={{
            background: 'var(--color-bg)',
            border    : '1px solid var(--color-line)',
            color     : 'var(--color-ink)',
            fontSize  : '0.88rem',
            outline   : 'none',
            minWidth  : '180px',
          }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectBase}>
          <option value="all">كل الحالات</option>
          <option value="معلق">معلق</option>
          <option value="تم التواصل">تم التواصل</option>
          <option value="تمت الزيارة">تمت الزيارة</option>
          <option value="تمت البيعة">تمت البيعة</option>
          <option value="لم يتم الاتفاق">لم يتم الاتفاق</option>
        </select>
        <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} style={selectBase}>
          <option value="all">كل الشركات</option>
          <option value="__unassigned">بدون شركة</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="font-body ms-auto whitespace-nowrap" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}>
          {filtered.length} طلب
        </span>
      </div>

      {/* ── Legend ───────────────────────────────────────── */}
      <div
        className="rounded-lg px-4 py-3 flex flex-wrap gap-x-5 gap-y-2"
        style={{ background: 'oklch(16% 0.04 255)', border: '1px solid var(--color-line)' }}
      >
        <p className="font-body w-full mb-0.5" style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          كيفية التعديل
        </p>
        {([
          { icon: <IconBuilding size={13} />, text: 'اختر شركة → يصبح "تم التواصل" تلقائياً' },
          { icon: <IconRotate   size={13} />, text: 'احذف الشركة → يعود "معلق" تلقائياً' },
          { icon: <IconRules    size={13} />, text: 'الحالة تتغير فقط إذا كانت هناك شركة مُعيَّنة' },
          { icon: <IconBan      size={13} />, text: '"مسح الرفض" يسمح للشركات المرفوضة بالالتقاط مجدداً' },
        ] as { icon: React.ReactNode; text: string }[]).map(({ icon, text }) => (
          <p key={text} className="font-body flex items-center gap-1.5" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}>
            <span className="shrink-0 opacity-60">{icon}</span><span>{text}</span>
          </p>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
        >
          <p className="font-body" style={{ color: 'var(--color-ink-faint)', fontSize: '0.9rem' }}>
            لا توجد نتائج مطابقة
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop Table ─────────────────────────────── */}
          <div
            className="hidden lg:block rounded-xl overflow-hidden"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: '860px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                    {[
                      { label: '#',          title: 'رقم الطلب' },
                      { label: 'العميل',     title: 'الاسم والهاتف' },
                      { label: 'التفاصيل',   title: 'المدينة والخدمات' },
                      { label: 'الشركة',     title: 'اختر شركة أو اتركها فارغة' },
                      { label: 'الحالة',     title: 'تتغير فقط إذا كانت هناك شركة' },
                      { label: 'إجراءات',    title: 'تحرير أو مسح الرفض' },
                    ].map(h => (
                      <th
                        key={h.label}
                        title={h.title}
                        style={{
                          fontSize     : '0.68rem',
                          color        : 'var(--color-ink-faint)',
                          fontWeight   : 500,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding      : '0 14px 12px',
                          textAlign    : 'start',
                          fontFamily   : 'var(--font-body)',
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => {
                    const isPending    = pendingId === lead.id
                    const rowError     = errorRow?.id === lead.id ? errorRow.msg : null
                    const hasCompany   = lead.company_id !== null
                    const hasWarning   = !!lead.warning_sent_at
                    const hasVerified  = !!lead.contact_verified_at

                    return (
                      <tr
                        key={lead.id}
                        style={{
                          borderBottom: i < filtered.length - 1 ? '1px solid var(--color-line)' : undefined,
                          background  : i % 2 === 1 ? 'var(--color-surface-warm)' : undefined,
                          opacity     : isPending ? 0.55 : 1,
                          transition  : 'opacity 150ms',
                        }}
                      >
                        {/* # — row number + short ID */}
                        <td style={{ padding: '14px', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span className="font-display font-bold" style={{ fontSize: '1rem', color: 'var(--color-ink-faint)' }}>
                            {filtered.length - i}
                          </span>
                          <br />
                          <span style={{ fontSize: '0.62rem', color: 'var(--color-line-strong)', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                            {shortId(lead.id)}
                          </span>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '14px', fontFamily: 'var(--font-body)', verticalAlign: 'middle' }}>
                          <p className="font-display font-semibold" style={{ fontSize: '0.95rem', color: 'var(--color-ink)' }}>
                            {lead.customer_name}
                          </p>
                          <a
                            href={`tel:${lead.customer_phone}`}
                            dir="ltr"
                            style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', letterSpacing: '0.03em', textDecoration: 'none' }}
                          >
                            {lead.customer_phone}
                          </a>
                          <p style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
                            {formatDate(lead.created_at)} · {lead.budget || '—'}
                          </p>
                          {/* State flags */}
                          <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {hasVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ fontSize: '0.62rem', color: 'var(--color-success)', background: 'var(--color-success-bg)' }}>
                                <IconCheck size={9} /> محقق
                              </span>
                            )}
                            {hasWarning && (
                              <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ fontSize: '0.62rem', color: 'oklch(75% 0.14 70)', background: 'oklch(20% 0.06 70)' }}>
                                <IconAlert size={9} /> إنذار
                              </span>
                            )}
                            {lead.declined_by.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ fontSize: '0.62rem', color: 'oklch(65% 0.18 25)', background: 'oklch(18% 0.06 25)' }}>
                                <IconUserX size={9} /> رُفض {lead.declined_by.length}×
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Details */}
                        <td style={{ padding: '14px', fontFamily: 'var(--font-body)', verticalAlign: 'middle' }}>
                          <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-dim)' }}>{lead.city}</p>
                          <p className="truncate" style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', maxWidth: '130px' }} title={lead.services.join('، ')}>
                            {lead.services.join('، ') || '—'}
                          </p>
                        </td>

                        {/* Company dropdown */}
                        <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                          {isPending ? <Spinner /> : (
                            <div className="flex flex-col gap-1">
                              <select
                                value={lead.company_id ?? ''}
                                disabled={isPending}
                                onChange={e => handleCompanyChange(lead, e.target.value)}
                                style={{
                                  ...selectBase,
                                  color     : hasCompany ? 'var(--color-ink)' : 'var(--color-ink-faint)',
                                  fontWeight: hasCompany ? 600 : 400,
                                  minWidth  : '140px',
                                }}
                              >
                                <option value="">— بدون شركة —</option>
                                {companies.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                              {hasCompany && (() => {
                                const co = companyMap.get(lead.company_id!)
                                return co ? <CompanyCard company={co} /> : (
                                  <p style={{ fontSize: '0.65rem', color: 'var(--color-ink-faint)', marginTop: '4px' }}>
                                    احذف الشركة لإعادتها لـ &quot;معلق&quot;
                                  </p>
                                )
                              })()}
                            </div>
                          )}
                        </td>

                        {/* Status dropdown — disabled when no company */}
                        <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                          {isPending ? <Spinner /> : (
                            <div className="flex flex-col gap-1">
                              <select
                                value={lead.status}
                                disabled={isPending || !hasCompany}
                                title={!hasCompany ? 'عيِّن شركة أولاً لتغيير الحالة' : undefined}
                                onChange={e => handleStatusChange(lead, e.target.value)}
                                style={{
                                  ...selectBase,
                                  color          : hasCompany ? (STATUS_COLORS[lead.status]?.color ?? 'var(--color-ink-dim)') : 'var(--color-ink-faint)',
                                  background     : hasCompany ? (STATUS_COLORS[lead.status]?.bg    ?? 'var(--color-bg)') : 'var(--color-bg)',
                                  fontWeight     : hasCompany ? 600 : 400,
                                  cursor         : hasCompany ? 'pointer' : 'not-allowed',
                                  opacity        : hasCompany ? 1 : 0.45,
                                }}
                              >
                                <option value="معلق" disabled={hasCompany}>معلق</option>
                                {ASSIGNED_STATUSES.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              {!hasCompany && (
                                <p style={{ fontSize: '0.65rem', color: 'var(--color-ink-faint)' }}>
                                  يتطلب شركة مُعيَّنة
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px', verticalAlign: 'middle' }}>
                          <div className="flex flex-col gap-1.5">
                            {hasCompany && (
                              <button
                                disabled={isPending}
                                onClick={() => runAction(lead.id, () => releaseLeadAdmin(lead.id))}
                                className="rounded-md px-2.5 py-1 font-body font-medium transition-colors duration-150 text-start"
                                style={{ fontSize: '0.72rem', background: 'oklch(20% 0.06 70)', color: 'oklch(75% 0.14 70)', border: '1px solid oklch(35% 0.12 70)' }}
                              >
                                <span className="inline-flex items-center gap-1"><IconUndo size={11} /> تحرير</span>
                              </button>
                            )}
                            {lead.declined_by.length > 0 && (
                              <button
                                disabled={isPending}
                                onClick={() => runAction(lead.id, () => clearDeclinedListAdmin(lead.id))}
                                className="rounded-md px-2.5 py-1 font-body font-medium transition-colors duration-150 text-start"
                                style={{ fontSize: '0.72rem', background: 'oklch(18% 0.06 25)', color: 'oklch(65% 0.18 25)', border: '1px solid oklch(35% 0.14 25)' }}
                              >
                                <span className="inline-flex items-center gap-1"><IconBan size={11} /> مسح الرفض ({lead.declined_by.length})</span>
                              </button>
                            )}
                            {rowError && (
                              <p style={{ fontSize: '0.68rem', color: 'oklch(65% 0.18 25)' }}>{rowError}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile Cards ──────────────────────────────── */}
          <div className="lg:hidden flex flex-col gap-3">
            {filtered.map((lead, i) => {
              const isPending   = pendingId === lead.id
              const rowError    = errorRow?.id === lead.id ? errorRow.msg : null
              const hasCompany  = lead.company_id !== null
              const hasWarning  = !!lead.warning_sent_at
              const hasVerified = !!lead.contact_verified_at

              return (
                <div
                  key={lead.id}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{
                    background: 'var(--color-surface)',
                    border    : '1px solid var(--color-line)',
                    opacity   : isPending ? 0.55 : 1,
                    transition: 'opacity 150ms',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-body" style={{ fontSize: '0.65rem', color: 'var(--color-ink-faint)' }}>
                          #{filtered.length - i} · {shortId(lead.id)}
                        </span>
                      </div>
                      <p className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--color-ink)', marginTop: '2px' }}>
                        {lead.customer_name}
                      </p>
                      <a href={`tel:${lead.customer_phone}`} dir="ltr" style={{ fontSize: '0.82rem', color: 'var(--color-secondary)', letterSpacing: '0.03em' }}>
                        {lead.customer_phone}
                      </a>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="font-body" style={{ fontSize: '0.82rem', color: 'var(--color-ink-dim)' }}>{lead.city}</span>
                    <span className="font-body" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}>{formatDate(lead.created_at)}</span>
                    <span className="font-body" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}>{lead.budget || '—'}</span>
                  </div>

                  {/* State flags */}
                  {(hasVerified || hasWarning || lead.declined_by.length > 0) && (
                    <div className="flex gap-1.5 flex-wrap">
                      {hasVerified && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-body" style={{ fontSize: '0.65rem', color: 'var(--color-success)', background: 'var(--color-success-bg)' }}><IconCheck size={9} /> محقق</span>}
                      {hasWarning  && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-body" style={{ fontSize: '0.65rem', color: 'oklch(75% 0.14 70)', background: 'oklch(20% 0.06 70)' }}><IconAlert size={9} /> إنذار</span>}
                      {lead.declined_by.length > 0 && <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-body" style={{ fontSize: '0.65rem', color: 'oklch(65% 0.18 25)', background: 'oklch(18% 0.06 25)' }}><IconUserX size={9} /> رُفض {lead.declined_by.length}×</span>}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid var(--color-line)' }}>
                    {/* Company */}
                    <div className="flex items-center gap-2">
                      <span className="font-body shrink-0" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', width: '52px' }}>الشركة</span>
                      {isPending ? <Spinner /> : (
                        <select
                          value={lead.company_id ?? ''}
                          disabled={isPending}
                          onChange={e => handleCompanyChange(lead, e.target.value)}
                          style={{ ...selectBase, flex: 1 }}
                        >
                          <option value="">— بدون شركة —</option>
                          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      )}
                    </div>

                    {/* Company details */}
                    {hasCompany && (() => {
                      const co = companyMap.get(lead.company_id!)
                      return co ? (
                        <div className="rounded-lg px-3 py-2" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-line)' }}>
                          <CompanyCard company={co} />
                        </div>
                      ) : null
                    })()}

                    {/* Status — disabled without company */}
                    <div className="flex items-center gap-2">
                      <span className="font-body shrink-0" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)', width: '52px' }}>الحالة</span>
                      {isPending ? <Spinner /> : (
                        <div className="flex-1">
                          <select
                            value={lead.status}
                            disabled={isPending || !hasCompany}
                            title={!hasCompany ? 'عيِّن شركة أولاً' : undefined}
                            onChange={e => handleStatusChange(lead, e.target.value)}
                            style={{
                              ...selectBase,
                              width  : '100%',
                              opacity: hasCompany ? 1 : 0.4,
                              cursor : hasCompany ? 'pointer' : 'not-allowed',
                            }}
                          >
                            <option value="معلق" disabled={hasCompany}>معلق</option>
                            {ASSIGNED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {!hasCompany && (
                            <p className="font-body mt-0.5" style={{ fontSize: '0.65rem', color: 'var(--color-ink-faint)' }}>عيِّن شركة أولاً لتغيير الحالة</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {hasCompany && (
                        <button
                          disabled={isPending}
                          onClick={() => runAction(lead.id, () => releaseLeadAdmin(lead.id))}
                          className="rounded-md px-3 py-1.5 font-body font-medium"
                          style={{ fontSize: '0.78rem', background: 'oklch(20% 0.06 70)', color: 'oklch(75% 0.14 70)', border: '1px solid oklch(35% 0.12 70)' }}
                        >
                          <span className="inline-flex items-center gap-1.5"><IconUndo size={12} /> تحرير للمجموعة</span>
                        </button>
                      )}
                      {lead.declined_by.length > 0 && (
                        <button
                          disabled={isPending}
                          onClick={() => runAction(lead.id, () => clearDeclinedListAdmin(lead.id))}
                          className="rounded-md px-3 py-1.5 font-body font-medium"
                          style={{ fontSize: '0.78rem', background: 'oklch(18% 0.06 25)', color: 'oklch(65% 0.18 25)', border: '1px solid oklch(35% 0.14 25)' }}
                        >
                          <span className="inline-flex items-center gap-1.5"><IconBan size={12} /> مسح الرفض ({lead.declined_by.length})</span>
                        </button>
                      )}
                    </div>

                    {rowError && (
                      <p className="font-body" style={{ fontSize: '0.75rem', color: 'oklch(65% 0.18 25)' }}>{rowError}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
