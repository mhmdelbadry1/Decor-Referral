import Image from 'next/image'
import RevealOnScroll from './RevealOnScroll'

const TRUST_CHIPS = [
  'شركات معتمدة',
  'خدمة مجانية للعميل',
  'ضمان جودة العروض',
  'متابعة حتى إغلاق الصفقة',
]

export default function About() {
  return (
    <section 
      id="about-section"
      className="bg-surface-warm px-6 py-16" 
      aria-label="من نحن"
    >
      <div className="max-w-[840px] mx-auto grid gap-12 items-center md:grid-cols-[1fr_1.6fr]">

        {/* Photo placeholder — replace src with real image */}
        <RevealOnScroll>
          <div
            className="relative aspect-[3/4] rounded-lg overflow-hidden w-full max-w-[260px] mx-auto md:max-w-none md:mx-0 border border-line shadow-lg"
            aria-label="صورة المستشار المعتمد"
          >
            <Image
              src="/certified_consultant_midnight_1775841874273.png"
              alt="مستشار ديكور معتمد بزي مهني"
              fill
              className="object-cover"
            />
          </div>
        </RevealOnScroll>

        {/* Content */}
        <RevealOnScroll>
          <span className="block text-[0.78rem] font-bold text-ink-faint mb-1">
            محمد القديحي
          </span>
          <span className="block text-[0.75rem] text-ink-faint mb-4">
            متخصص في خامات الديكور
          </span>
          <h2
            className="font-display font-bold text-ink leading-[1.25] mb-6"
            style={{ fontSize: 'clamp(1.7rem, 5vw, 2.5rem)' }}
          >
            أساعدك توصل للشركة المناسبة
          </h2>
          <p className="text-ink-dim leading-[1.85] max-w-[52ch] mb-8 text-[1.02rem]">
            بخبرة تمتد لأكثر من ١٠ سنوات في سوق الديكور بالمملكة العربية
            السعودية، أعرف من هم المقاولون الموثوقون في كل مدينة. الخدمة
            مجانية للعملاء — نكسب عمولتنا من الشركات التي تجتاز معاييرنا
            الصارمة فقط.
          </p>

          {/* Trust chips */}
          <ul className="flex flex-wrap gap-3 list-none" aria-label="مميزاتنا">
            {TRUST_CHIPS.map((chip) => (
              <li
                key={chip}
                className="
                  inline-flex items-center gap-2 px-4 py-2
                  bg-surface border border-line rounded-full
                  text-[0.82rem] text-ink-dim
                "
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'var(--color-success)' }}
                  aria-hidden="true"
                />
                {chip}
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  )
}
