export interface StatusDistributionData {
  label: string
  count: number
  color: string
}

export default function StatusDistribution({
  data,
  total,
}: {
  data : StatusDistributionData[]
  total: number
}) {
  if (total === 0) return null

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
      }}
    >
      <h2
        className="font-display font-semibold mb-5"
        style={{ fontSize: '1rem', color: 'var(--color-ink)' }}
      >
        توزيع الطلبات
      </h2>

      <div className="flex flex-col gap-4">
        {data.map(({ label, count, color }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="font-body font-medium"
                    style={{ fontSize: '0.88rem', color: 'var(--color-ink-dim)' }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}
                  >
                    ({pct}%)
                  </span>
                </div>
                <span
                  className="font-display font-bold tabular-nums"
                  style={{ fontSize: '1rem', color }}
                >
                  {count}
                </span>
              </div>

              {/* Track + Fill */}
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: '6px', background: 'var(--color-line)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
