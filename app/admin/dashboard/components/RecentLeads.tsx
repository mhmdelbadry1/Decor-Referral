export interface RecentLeadRow {
  id         : string
  date       : string
  maskedName : string
  city       : string
  services   : string
  budget     : string
  status     : string
  companyName: string
}

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  'معلق'          : { color: 'var(--color-ink-faint)',  bg: 'var(--color-surface-warm)' },
  'تم التواصل'    : { color: 'var(--color-secondary)',  bg: 'oklch(18% 0.06 235)' },
  'تمت الزيارة'   : { color: 'oklch(75% 0.14 70)',      bg: 'oklch(20% 0.06 70)' },
  'تمت البيعة'    : { color: 'var(--color-success)',    bg: 'var(--color-success-bg)' },
  'لم يتم الاتفاق': { color: 'oklch(65% 0.18 25)',      bg: 'oklch(18% 0.06 25)' },
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    color: 'var(--color-ink-faint)',
    bg   : 'var(--color-surface-warm)',
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-body font-medium whitespace-nowrap"
      style={{ fontSize: '0.75rem', color: style.color, background: style.bg }}
    >
      {status}
    </span>
  )
}

export default function RecentLeads({ rows }: { rows: RecentLeadRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
      >
        <p className="font-body" style={{ color: 'var(--color-ink-faint)', fontSize: '0.9rem' }}>
          لا توجد طلبات حتى الآن
        </p>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    color: 'var(--color-ink-faint)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0 12px 12px',
    textAlign: 'start',
  }

  const tdStyle: React.CSSProperties = {
    fontSize: '0.88rem',
    color: 'var(--color-ink-dim)',
    padding: '12px',
    textAlign: 'start',
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
    >
      <div className="px-6 pt-6 pb-4">
        <h2
          className="font-display font-semibold"
          style={{ fontSize: '1rem', color: 'var(--color-ink)' }}
        >
          آخر الطلبات
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
              <th style={thStyle}>التاريخ</th>
              <th style={thStyle}>العميل</th>
              <th style={thStyle}>المدينة</th>
              <th style={thStyle}>الخدمة</th>
              <th style={thStyle}>الميزانية</th>
              <th style={thStyle}>الحالة</th>
              <th style={thStyle}>الشركة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: i < rows.length - 1 ? '1px solid var(--color-line)' : undefined,
                  background: i % 2 === 1 ? 'var(--color-surface-warm)' : undefined,
                }}
              >
                <td style={{ ...tdStyle, color: 'var(--color-ink-faint)', whiteSpace: 'nowrap' }}>
                  {row.date}
                </td>
                <td style={{ ...tdStyle, color: 'var(--color-ink)', fontWeight: 500 }}>
                  {row.maskedName}
                </td>
                <td style={tdStyle}>{row.city}</td>
                <td style={{ ...tdStyle, maxWidth: '140px' }}>
                  <span className="block truncate">{row.services}</span>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  {row.budget}
                </td>
                <td style={tdStyle}>
                  <StatusBadge status={row.status} />
                </td>
                <td style={{ ...tdStyle, color: row.companyName === '—' ? 'var(--color-ink-faint)' : 'var(--color-ink-dim)' }}>
                  {row.companyName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y" style={{ borderTop: '1px solid var(--color-line)' }}>
        {rows.map((row) => (
          <div key={row.id} className="px-5 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-body font-medium"
                style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}
              >
                {row.maskedName}
              </span>
              <StatusBadge status={row.status} />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-body" style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
                {row.city}
              </span>
              <span style={{ color: 'var(--color-line)' }}>·</span>
              <span className="font-body" style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
                {row.date}
              </span>
              {row.companyName !== '—' && (
                <>
                  <span style={{ color: 'var(--color-line)' }}>·</span>
                  <span className="font-body" style={{ fontSize: '0.8rem', color: 'var(--color-ink-dim)' }}>
                    {row.companyName}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
