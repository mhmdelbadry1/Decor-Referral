export interface KpiData {
  totalLeads      : number
  closedDeals     : number
  conversionRate  : number
  activeLeads     : number
  verificationRate: number
  pendingLeads    : number
}

interface KpiCardProps {
  label  : string
  value  : string | number
  sub?   : string
  valueColor?: string
}

function KpiCard({ label, value, sub, valueColor }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
      }}
    >
      <p
        className="font-body font-medium uppercase tracking-wider"
        style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)', letterSpacing: '0.08em' }}
      >
        {label}
      </p>
      <p
        className="font-display font-bold leading-none"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: valueColor ?? 'var(--color-ink)' }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="font-body"
          style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)' }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

export default function KpiGrid({ data }: { data: KpiData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <KpiCard
        label="إجمالي الطلبات"
        value={data.totalLeads}
        sub="منذ البداية"
      />
      <KpiCard
        label="الصفقات المغلقة"
        value={data.closedDeals}
        sub="تمت البيعة"
        valueColor="var(--color-success)"
      />
      <KpiCard
        label="معدل التحويل"
        value={`${data.conversionRate}%`}
        sub="من الطلبات النشطة"
        valueColor="var(--color-success)"
      />
      <KpiCard
        label="طلبات نشطة"
        value={data.activeLeads}
        sub="تواصل + زيارة"
        valueColor="var(--color-secondary)"
      />
      <KpiCard
        label="نسبة التحقق"
        value={`${data.verificationRate}%`}
        sub="العملاء أكدوا التواصل"
      />
      <KpiCard
        label="طلبات معلقة"
        value={data.pendingLeads}
        sub="تنتظر التقاطاً"
        valueColor="oklch(75% 0.14 70)"
      />
    </div>
  )
}
