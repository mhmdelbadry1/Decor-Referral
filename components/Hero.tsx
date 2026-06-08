'use client'

import ConsultationForm from './ConsultationForm'

type Props = {
  cities?: string[]
  services?: string[]
  budgets?: string[]
}

export default function Hero({ cities, services, budgets }: Props) {
  function scrollToPartner() {
    document.getElementById('partners-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Compact value-prop header */}
      <div
        className="bg-bg pt-24 pb-8 px-6 text-center"
        aria-label="رسالة الصفحة الرئيسية"
      >
        <div className="max-w-[560px] mx-auto">
          <span
            className="inline-block font-medium text-ink-faint mb-5"
            style={{ fontSize: '0.82rem', letterSpacing: '0.12em' }}
          >
            مستشار الديكور · المملكة العربية السعودية
          </span>
          <h1
            className="font-display font-bold text-ink mb-4 leading-[1.22]"
            style={{ fontSize: 'clamp(1.85rem, 5.5vw, 3rem)' }}
          >
            احصل على أفضل شركات الديكور لبيتك
          </h1>
          <p
            className="text-ink-dim leading-[1.75] max-w-[40ch] mx-auto"
            style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.05rem)' }}
          >
            أخبرنا عن مشروعك ونوصلك بأفضل الشركات الموثوقة في مدينتك — مجاناً وبلا التزام.
          </p>
        </div>
      </div>

      {/* Client form — directly visible without scrolling */}
      <ConsultationForm cities={cities} services={services} budgets={budgets} />

      {/* Partner CTA strip */}
      <div className="bg-bg py-10 px-6 text-center border-t border-line">
        <p
          className="text-ink-dim mb-3"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
        >
          هل أنت صاحب شركة أو مقاول ديكور؟
        </p>
        <button
          type="button"
          onClick={scrollToPartner}
          className="
            inline-flex items-center gap-2
            bg-transparent border border-accent text-accent
            font-body font-medium text-[0.95rem]
            px-7 py-[10px] rounded-full cursor-pointer
            transition-all duration-[180ms]
            hover:bg-accent hover:text-surface hover:-translate-y-px
            active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
          "
        >
          سجّل شركتك واستقبل العملاء ←
        </button>
      </div>
    </>
  )
}
