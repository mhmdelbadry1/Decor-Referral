'use client'

import HeroGallery from './HeroGallery'
import RevealOnScroll from './RevealOnScroll'

export default function Hero() {
  function scrollToForm() {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="
        min-h-[100dvh] flex flex-col md:grid md:grid-cols-[46%_8%_46%]
        pt-[57px] bg-bg overflow-hidden
      "
      aria-label="قسم التعريف الرئيسي"
    >
      {/* ── Text column ────────────────────────────────── */}
      <div className="flex flex-col items-start justify-center px-6 py-12 md:ps-16 md:pe-6 lg:pe-4 md:py-16">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-3 font-medium text-ink-faint mb-6" style={{ fontSize: '0.82rem' }}>
          <span
            className="block w-7 shrink-0"
            style={{ height: '1px', background: 'var(--color-accent)' }}
            aria-hidden="true"
          />
          مستشار تشطيب · المملكة العربية السعودية
        </span>

        {/* Heading */}
        <h1
          className="font-display font-bold text-ink mb-6 leading-[1.22] max-w-[16ch]"
          style={{ fontSize: 'clamp(2.1rem, 7vw, 3.8rem)' }}
        >
          احصل على أفضل شركات الديكور لمنزلك
        </h1>

        {/* Sub-heading */}
        <p
          className="text-ink-dim leading-[1.75] mb-8 max-w-[42ch]"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}
        >
          نربطك بأفضل مقاولي التشطيب الموثوقين في مدينتك — بناءً على ميزانيتك
          وخدمتك المطلوبة. مجاناً تماماً.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            type="button"
            onClick={scrollToForm}
            className="
              bg-accent text-surface font-body text-base font-medium
              px-8 py-[14px] rounded-full border-none cursor-pointer
              transition-all duration-200
              hover:bg-accent-hover hover:-translate-y-0.5
              active:scale-[0.98]
              shadow-[0_10px_28px_oklch(30%_0.08_50_/_0.28)]
              hover:shadow-[0_12px_32px_oklch(30%_0.08_50_/_0.32)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg
            "
          >
            ابدأ الآن — مجاناً
          </button>

          <button
            type="button"
            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="
              font-body text-[0.9rem] text-ink-dim bg-transparent
              border border-line-strong px-6 py-[13px] rounded-full cursor-pointer
              transition-all duration-200
              hover:border-accent hover:text-accent hover:-translate-y-px
              active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
            "
          >
            تعرف علينا
          </button>
        </div>

        {/* Proof stats */}
        <RevealOnScroll
          variant="stagger"
          className="flex gap-8 mt-12 pt-8 border-t border-line w-full"
        >
          <div>
            <span 
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              +200
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-0.5 block">عميل مخدوم</span>
          </div>
          <div>
            <span 
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              +35
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-0.5 block">شركة موثوقة</span>
          </div>
          <div>
            <span 
              className="font-display font-bold text-accent block leading-none"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)' }}
            >
              8
            </span>
            <span className="text-[0.8rem] text-ink-faint mt-0.5 block">مدن رئيسية</span>
          </div>
        </RevealOnScroll>
      </div>

      {/* ── Structural Gutter (Editorial Divider) ─────── */}
      <div className="hidden md:flex relative flex-col items-center justify-center overflow-hidden select-none pointer-events-none">
        {/* Vertical rule */}
        <div className="w-[1px] flex-1 mx-auto" style={{ background: 'var(--color-line)' }} aria-hidden="true" />

        {/* Center tag */}
        <div
          className="rotate-[-90deg] whitespace-nowrap my-6 opacity-30"
          style={{ fontSize: '0.6rem', letterSpacing: '0.25em', fontWeight: 600, color: 'var(--color-ink-faint)' }}
          aria-hidden="true"
        >
          KSA · 2025
        </div>

        {/* Vertical rule */}
        <div className="w-[1px] flex-1 mx-auto" style={{ background: 'var(--color-line)' }} aria-hidden="true" />
      </div>

      {/* ── Image column ────────────────────────────────── */}
      <div className="flex items-center justify-center p-12 md:p-16 xl:p-20 bg-bg relative overflow-hidden md:overflow-visible">
        <HeroGallery />
      </div>
    </section>
  )
}
