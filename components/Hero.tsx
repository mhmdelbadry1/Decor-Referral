'use client'

import RevealOnScroll from './RevealOnScroll'

export default function Hero() {
  function scrollToForm() {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-20 bg-bg text-center"
      aria-label="قسم التعريف الرئيسي"
    >
      <div className="max-w-[620px] mx-auto flex flex-col items-center">

        {/* Eyebrow */}
        <RevealOnScroll>
          <span
            className="inline-block font-medium text-ink-faint mb-6"
            style={{ fontSize: '0.82rem', letterSpacing: '0.12em' }}
          >
            مستشار الديكور · المملكة العربية السعودية
          </span>
        </RevealOnScroll>

        {/* Heading */}
        <RevealOnScroll delay={80}>
          <h1
            className="font-display font-bold text-ink mb-6 leading-[1.22]"
            style={{ fontSize: 'clamp(2.1rem, 7vw, 3.8rem)' }}
          >
            احصل على أفضل شركات الديكور لبيتك
          </h1>
        </RevealOnScroll>

        {/* Sub-heading */}
        <RevealOnScroll delay={160}>
          <p
            className="text-ink-dim leading-[1.75] mb-10 max-w-[42ch]"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}
          >
            نربطك بأفضل شركات الديكور الموثوقة في مدينتك — على حسب ميزانيتك واحتياجك. مجاناً.
          </p>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll delay={240}>
          <button
            type="button"
            onClick={scrollToForm}
            className="
              bg-accent text-surface font-body text-base font-medium
              px-10 py-[15px] rounded-full border-none cursor-pointer
              transition-all duration-200
              hover:bg-accent-hover hover:-translate-y-0.5
              active:scale-[0.98]
              shadow-[0_10px_28px_oklch(30%_0.08_50_/_0.28)]
              hover:shadow-[0_12px_32px_oklch(30%_0.08_50_/_0.32)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg
            "
          >
            ابدأ الآن مجاناً
          </button>
        </RevealOnScroll>

        {/* Proof stats */}
        <RevealOnScroll
          variant="stagger"
          className="flex gap-10 mt-14 pt-10 border-t border-line w-full justify-center"
          delay={320}
        >
          <div className="flex flex-col items-center">
            <span
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              +200
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-1 block">عميل مخدوم</span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              +35
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-1 block">شركة موثوقة</span>
          </div>
          <div className="flex flex-col items-center">
            <span
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              8
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-1 block">مدن رئيسية</span>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  )
}
