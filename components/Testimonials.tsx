import RevealOnScroll from './RevealOnScroll'

const TESTIMONIALS = [
  {
    text: 'وفّر علي الكثير من الوقت والمجهود. بدل ما أدور بنفسي على شركات، جابولي 3 عروض موثوقة في يومين فقط. السعر كان منافساً جداً والنتيجة ممتازة.',
    name: 'خالد العمري',
    city: 'الرياض · أرضيات',
    initial: 'خ',
  },
  {
    text: 'كنت خايف أتعامل مع شركات ما أعرفها، لكن المستشار ضمنلي شركة محترمة وبسعر عادل. التشطيب طلع أحسن من توقعاتي بكثير.',
    name: 'سارة القحطاني',
    city: 'جدة · تشطيب كامل',
    initial: 'س',
  },
  {
    text: 'المستشار فاهم السوق ويعرف مين الشركات الجيدة فعلاً. ما ضيعت وقت في مفاوضات — كل شيء كان واضح ومنظم من البداية للنهاية.',
    name: 'عبدالله الشمري',
    city: 'الدمام · دهانات وخشب',
    initial: 'ع',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-bg px-6 py-16" aria-label="آراء العملاء">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <RevealOnScroll className="mb-12">
          <span className="block text-[0.78rem] font-bold text-ink-faint mb-3">
            آراء عملائنا
          </span>
          <h2
            className="font-display font-bold text-ink max-w-[28ch] leading-[1.25]"
            style={{ fontSize: 'clamp(1.7rem, 5vw, 2.5rem)' }}
          >
            عملاء وثقوا بنا — وعادوا مجدداً
          </h2>
        </RevealOnScroll>

        {/* Grid - Asymmetrical Layout for 'Impeccable' rhythm */}
        <RevealOnScroll
          variant="stagger"
          className="grid gap-8 lg:grid-cols-2 lg:grid-rows-[auto_auto]"
        >
          {TESTIMONIALS.map(({ text, name, city, initial }, idx) => {
            const isFeatured = idx === 0
            return (
              <article
                key={name}
                className={`
                  relative bg-surface border border-line rounded-lg p-8 flex flex-col
                  transition-all duration-300 hover:shadow-xl hover:border-accent/20
                  ${isFeatured ? 'lg:row-span-2' : ''}
                `}
                aria-label={`تقييم من ${name}`}
              >
                {/* Verified Badge */}
                <div className="absolute top-8 end-8 flex items-center gap-1.5 px-3 py-1 bg-success/5 border border-success/20 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-success" />
                  <span className="text-[0.68rem] font-bold text-success uppercase tracking-wider">اختيار موثق</span>
                </div>

                {/* Decorative Quote Mark */}
                <span
                  className="font-display text-[4rem] leading-[0.5] mb-6 select-none opacity-10"
                  style={{ color: 'var(--color-accent)' }}
                  aria-hidden="true"
                >
                  «
                </span>

                <blockquote className={`
                  text-ink leading-[1.8] flex-1 mb-8
                  ${isFeatured ? 'text-[1.15rem] font-medium' : 'text-[0.98rem]'}
                `}>
                  {text}
                </blockquote>

                <footer className="flex items-center gap-4 pt-6 border-t border-line/50">
                  {/* Avatar with gradient border */}
                  <div
                    className="
                      w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-accent to-accent-muted
                      shrink-0
                    "
                    aria-hidden="true"
                  >
                    <div className="w-full h-full rounded-full bg-surface grid place-items-center font-display text-lg font-bold text-accent">
                      {initial}
                    </div>
                  </div>
                  <div>
                    <span className="text-[1rem] font-bold text-ink block">{name}</span>
                    <span className="text-[0.8rem] text-ink-faint block">{city}</span>
                  </div>
                </footer>
              </article>
            )
          })}
        </RevealOnScroll>
      </div>
    </section>
  )
}
