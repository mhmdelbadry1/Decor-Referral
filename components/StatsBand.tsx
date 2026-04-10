import RevealOnScroll from './RevealOnScroll'

const STATS = [
  { value: '+200', label: 'مشروع ناجح منجز' },
  { value: '+35',  label: 'شركة تشطيب موثوقة' },
  { value: '8',    label: 'مدن في المملكة' },
  { value: '4.9★', label: 'متوسط تقييم العملاء' },
]

export default function StatsBand() {
  return (
    <section
      id="stats-section"
      className="bg-accent px-6 py-12"
      aria-label="أرقامنا"
    >
      <RevealOnScroll
        variant="stagger"
        className="flex flex-wrap justify-center gap-8 text-center"
      >
        {STATS.map(({ value, label }) => (
          <div key={label} className="min-w-[140px]">
            <span
              className="font-display font-bold text-surface block leading-none"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 3.8rem)' }}
            >
              {value}
            </span>
            <span
              className="text-[0.85rem] mt-2 block text-surface/70 font-medium uppercase tracking-wider"
            >
              {label}
            </span>
          </div>
        ))}
      </RevealOnScroll>
    </section>
  )
}
