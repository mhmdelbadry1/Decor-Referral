'use client'

import RevealOnScroll from './RevealOnScroll'

const STEPS = [
  {
    number: '٠١',
    title: 'تعبئة البيانات',
    description: 'أخبرنا عن نوع مشروعك، مدينتك، والميزانية المتوقعة من خلال نموذج سريع.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    number: '٠٢',
    title: 'الترشيح الذكي',
    description: 'يقوم خبراؤنا بدراسة طلبك واختيار أفضل ٣ شركات في منطقتك تناسب متطلباتك.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M11 8v6" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    number: '٠٣',
    title: 'استلام العروض',
    description: 'تصلك عروض الأسعار والتصاميم مباشرة، مع إمكانية المقارنة والاختيار بكل سهولة.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
      </svg>
    ),
  },
]

export default function Process() {
  return (
    <section 
      id="process-section"
      className="bg-bg px-6 py-20 border-t border-line" 
      aria-label="كيف نعمل"
    >
      <div className="max-w-[1000px] mx-auto">
        <RevealOnScroll className="text-center mb-16">
          <span className="block text-[0.78rem] font-bold text-accent mb-3 tracking-widest uppercase">
            رحلتك معنا
          </span>
          <h2
            className="font-display font-bold text-ink max-w-[20ch] mx-auto leading-[1.2] mb-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)' }}
          >
            كيف ستحصل على المنسق المثالي؟
          </h2>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </RevealOnScroll>

        <div className="grid gap-16 md:grid-cols-3 relative">
          {/* Connector Line (Desktop) */}
          <div
            className="hidden md:block absolute top-[5.5rem] left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(to right, transparent, var(--color-line), transparent)' }}
            aria-hidden="true"
          />

          {STEPS.map((step) => (
            <RevealOnScroll
              key={step.title}
              variant="stagger"
              className="flex flex-col items-center text-center group"
            >
              {/* Step counter — in-flow above icon */}
              <span
                className="font-display font-bold text-accent leading-none select-none mb-5"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Icon Container */}
              <div
                className="
                  w-16 h-16 rounded-2xl bg-surface border border-line shadow-sm
                  flex items-center justify-center text-accent mb-6
                  transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg
                  group-hover:border-accent
                "
              >
                {step.icon}
              </div>

              <h3 className="font-display text-[1.35rem] font-bold text-ink mb-3">
                {step.title}
              </h3>
              <p className="text-ink-dim leading-[1.8] text-[0.95rem] max-w-[28ch] transition-colors group-hover:text-ink">
                {step.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
