'use client'

export interface KpiData {
  totalLeads      : number
  closedDeals     : number
  conversionRate  : number
  activeLeads     : number
  verificationRate: number
  pendingLeads    : number
}

interface KpiCardProps {
  label      : string
  value      : string | number
  sub?       : string
  tooltip    : string
  valueColor?: string
}

/* ── Tooltip styles injected once ──────────────────────────── */
const TOOLTIP_STYLES = `
  .kpi-info {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: default;
    flex-shrink: 0;
    background: var(--color-line);
    color: var(--color-ink-faint);
    font-size: 0.6rem;
    font-family: var(--font-body);
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1;
    transition: background 160ms ease, color 160ms ease;
  }
  .kpi-info:hover {
    background: var(--color-accent-muted);
    color: var(--color-accent);
  }
  .kpi-info::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    right: 50%;
    transform: translateX(50%);
    width: 210px;
    padding: 9px 12px;
    border-radius: 8px;
    background: oklch(14% 0.03 255);
    color: oklch(82% 0.02 255);
    font-size: 0.75rem;
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0;
    text-transform: none;
    white-space: normal;
    text-align: right;
    direction: rtl;
    pointer-events: none;
    opacity: 0;
    transform: translateX(50%) translateY(4px);
    transition: opacity 160ms ease, transform 160ms ease;
    z-index: 50;
    box-shadow: 0 4px 20px oklch(0% 0 0 / 0.35);
    border: 1px solid oklch(25% 0.03 255);
  }
  .kpi-info:hover::after {
    opacity: 1;
    transform: translateX(50%) translateY(0);
  }
`

function KpiCard({ label, value, sub, tooltip, valueColor }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
      }}
    >
      {/* Label row with info icon */}
      <div className="flex items-center justify-between gap-2">
        <p
          className="font-body font-medium uppercase tracking-wider"
          style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)', letterSpacing: '0.08em' }}
        >
          {label}
        </p>
        <span
          className="kpi-info"
          data-tooltip={tooltip}
          aria-label={tooltip}
          role="img"
        >
          ?
        </span>
      </div>

      {/* Value */}
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
    <>
      <style dangerouslySetInnerHTML={{ __html: TOOLTIP_STYLES }} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KpiCard
          label="إجمالي الطلبات"
          value={data.totalLeads}
          sub="منذ البداية"
          tooltip="عدد جميع الطلبات الواردة عبر النموذج منذ إطلاق المنصة، بغض النظر عن حالتها."
        />
        <KpiCard
          label="الصفقات المغلقة"
          value={data.closedDeals}
          sub="تمت البيعة"
          valueColor="var(--color-success)"
          tooltip="عدد الطلبات التي وصلت إلى حالة «تمت البيعة» — أي أن الشركة أتمت العقد مع العميل بنجاح."
        />
        <KpiCard
          label="معدل التحويل"
          value={`${data.conversionRate}%`}
          sub="من الطلبات المُسنَدة"
          valueColor="var(--color-success)"
          tooltip="نسبة الصفقات المغلقة من كل الطلبات التي أُسندت لشركة (مستثنياً «معلق»). الحساب: صفقات مغلقة ÷ طلبات غير معلقة × 100."
        />
        <KpiCard
          label="طلبات نشطة"
          value={data.activeLeads}
          sub="تواصل + زيارة"
          valueColor="var(--color-secondary)"
          tooltip="الطلبات التي هي الآن في مرحلة «تم التواصل» أو «تمت الزيارة» — أي قيد المتابعة مع شركة."
        />
        <KpiCard
          label="نسبة التحقق"
          value={`${data.verificationRate}%`}
          sub="العملاء أكدوا التواصل"
          tooltip="نسبة العملاء الذين أكدوا أن الشركة اتصلت بهم فعلاً، من بين جميع الطلبات المُسنَدة. مؤشر لمصداقية الشركات."
        />
        <KpiCard
          label="طلبات معلقة"
          value={data.pendingLeads}
          sub="تنتظر التقاطاً"
          valueColor="oklch(75% 0.14 70)"
          tooltip="الطلبات التي لم تُسند بعد لأي شركة — إما لعدم وجود شركة مناسبة أو لأنها جديدة وتنتظر التوزيع."
        />
      </div>
    </>
  )
}

