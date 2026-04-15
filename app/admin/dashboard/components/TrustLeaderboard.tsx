export interface CompanyLeaderboardRow {
  name      : string
  received  : number
  claimed   : number
  verified  : number
  closed    : number
  trustScore: number
}

function TrustBadge({ score }: { score: number }) {
  let color: string
  let bg   : string

  if (score >= 70) {
    color = 'var(--color-success)'
    bg    = 'var(--color-success-bg)'
  } else if (score >= 40) {
    color = 'oklch(75% 0.14 70)'
    bg    = 'oklch(20% 0.06 70)'
  } else {
    color = 'oklch(65% 0.18 25)'
    bg    = 'oklch(18% 0.06 25)'
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 font-body font-semibold tabular-nums"
      style={{ fontSize: '0.82rem', color, background: bg, minWidth: '3rem' }}
    >
      {score}%
    </span>
  )
}

export default function TrustLeaderboard({ rows }: { rows: CompanyLeaderboardRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
      >
        <p className="font-body" style={{ color: 'var(--color-ink-faint)', fontSize: '0.9rem' }}>
          لا توجد شركات مسجلة حتى الآن
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
    fontSize: '0.9rem',
    color: 'var(--color-ink-dim)',
    padding: '14px 12px',
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
          مؤشر ثقة الشركات
        </h2>
        <p
          className="font-body mt-1"
          style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}
        >
          نسبة العملاء الذين أكدوا التواصل من الشركات الملتقِطة
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
              <th style={thStyle}>الشركة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>الطلبات المرسلة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>الملتقطة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>التواصل المحقق</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>نقاط الثقة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>الصفقات المغلقة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.name}
                style={{
                  borderBottom: i < rows.length - 1 ? '1px solid var(--color-line)' : undefined,
                  background: i % 2 === 1 ? 'var(--color-surface-warm)' : undefined,
                }}
              >
                <td style={{ ...tdStyle, color: 'var(--color-ink)', fontWeight: 600 }}>
                  <span className="font-display">{row.name}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{row.received}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{row.claimed}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{row.verified}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <TrustBadge score={row.trustScore} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span
                    className="font-body font-semibold"
                    style={{ color: row.closed > 0 ? 'var(--color-success)' : 'var(--color-ink-faint)' }}
                  >
                    {row.closed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y" style={{ borderTop: '1px solid var(--color-line)' }}>
        {rows.map((row) => (
          <div
            key={row.name}
            className="px-5 py-4 flex items-center justify-between gap-3"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <span
                className="font-display font-semibold truncate"
                style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}
              >
                {row.name}
              </span>
              <span
                className="font-body"
                style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}
              >
                {row.claimed} ملتقطة · {row.closed} مغلقة
              </span>
            </div>
            <TrustBadge score={row.trustScore} />
          </div>
        ))}
      </div>
    </div>
  )
}
