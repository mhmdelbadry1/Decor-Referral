'use client'

import { useCallback, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/* ── Types ────────────────────────────────────────────── */
type FormData = {
  city: string | null
  service: string | null
  budget: string | null
  name: string
  phone: string
}

const CITIES = [
  'الرياض', 'جدة', 'الدمام',
  'الخبر', 'مكة المكرمة', 'المدينة المنورة',
]

const BUDGETS = [
  'أقل من 50,000 ريال',
  '50,000 – 150,000 ريال',
  '150,000 – 300,000 ريال',
  'أكثر من 300,000 ريال',
]

/* ── Service icons (inline SVG as components) ─────────── */
function FloorsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function PaintIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
      <path d="M12 11v10M8 15h8" />
    </svg>
  )
}

function WoodIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function AluminumIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" />
    </svg>
  )
}

function DoorsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h18v18H3z" />
      <path d="M14 12h.01" />
    </svg>
  )
}

function FurnitureIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18v3M20 18v3M19 13v5H5v-5M19 13V8a2 2 0 00-2-2H7a2 2 0 00-2 2v5" />
      <path d="M19 13h2a1 1 0 001-1V9a1 1 0 00-1-1h-2M5 13H3a1 1 0 01-1-1V9a1 1 0 011-1h2" />
    </svg>
  )
}

function LightingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  )
}

function KitchenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18M9 3v18" />
      <circle cx="15" cy="15" r="2" />
    </svg>
  )
}

const SERVICES: { label: string; icon: ReactNode }[] = [
  { label: 'المنيوم', icon: <AluminumIcon /> },
  { label: 'ارضيات', icon: <FloorsIcon /> },
  { label: 'ابواب', icon: <DoorsIcon /> },
  { label: 'اثاث', icon: <FurnitureIcon /> },
  { label: 'اضاءة', icon: <LightingIcon /> },
  { label: 'دهانات', icon: <PaintIcon /> },
  { label: 'مطابخ', icon: <KitchenIcon /> },
]

/* ── Shake utility ─────────────────────────────────────── */
function shake(el: HTMLElement | null) {
  if (!el) return
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-3px)' },
      { transform: 'translateX(3px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 380, easing: 'ease-out' }
  )
}

/* ── Main component ────────────────────────────────────── */
export default function ConsultationForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [data, setData] = useState<FormData>({
    city: null, service: null, budget: null, name: '', phone: '',
  })

  /* Refs for shake targets and focus management */
  const cityRef    = useRef<HTMLDivElement>(null)
  const serviceRef = useRef<HTMLDivElement>(null)
  const budgetRef  = useRef<HTMLDivElement>(null)
  const nameRef    = useRef<HTMLInputElement>(null)
  const phoneRef   = useRef<HTMLInputElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)

  /* Move focus to step question for screen reader flow */
  const focusQuestion = useCallback(() => {
    setTimeout(() => questionRef.current?.focus(), 50)
  }, [])

  function goNext() {
    if (step === 0 && !data.city)    { shake(cityRef.current);    return }
    if (step === 1 && !data.service) { shake(serviceRef.current); return }
    if (step === 2 && !data.budget)  { shake(budgetRef.current);  return }
    setStep((s) => s + 1)
    focusQuestion()
  }

  function goPrev() {
    setStep((s) => s - 1)
    focusQuestion()
  }

  function handleSubmit() {
    if (!data.name)  { shake(nameRef.current);  return }
    if (!data.phone) { shake(phoneRef.current); return }
    // TODO: POST to Supabase or API route
    console.log('Lead submitted:', data)
    setSubmitted(true)
  }

  /* Pill/tile selection helpers */
  function select(key: keyof FormData, value: string) {
    setData((d) => ({ ...d, [key]: value }))
  }

  /* Shared class strings - using global tokens */
  const coreBtn = "min-h-[52px] px-2 py-3 border rounded-[6px] font-body text-[0.95rem] cursor-pointer transition-all duration-[180ms] ease-out text-center flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
  const restBtn = "bg-bg text-ink border-line hover:border-accent hover:bg-accent-muted"
  const selectedBtn = "bg-accent text-surface border-accent transform scale-[1.02] shadow-md"

  const coreTile = "flex flex-col items-center justify-center gap-3 px-4 py-6 border rounded-[10px] font-body text-[0.95rem] font-medium cursor-pointer min-h-[110px] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
  const restTile = "bg-bg text-ink border-line hover:border-accent hover:bg-accent-muted hover:-translate-y-[2px]"
  const selectedTile = "bg-accent text-surface border-accent overflow-visible -translate-y-[2px] shadow-md"

  const coreBudget = "flex items-center justify-between px-5 py-4 border rounded-[6px] font-body text-[0.97rem] cursor-pointer text-start transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
  const restBudget = "bg-bg text-ink border-line hover:border-accent hover:bg-accent-muted"
  const selectedBudget = "bg-accent text-surface border-accent shadow-md"

  const STEP_LABELS = ['السؤال ١ من ٤', 'السؤال ٢ من ٤', 'السؤال ٣ من ٤', 'السؤال ٤ من ٤']
  const STEP_QUESTIONS = [
    'في أي مدينة يقع منزلك؟',
    'ما الخدمة التي تحتاجها؟',
    'ما ميزانيتك التقريبية للمشروع؟',
    'كيف يمكننا التواصل معك؟',
  ]

  return (
    <section
      id="form-section"
      className="bg-surface-warm px-6 py-16"
      aria-label="نموذج طلب الاستشارة"
    >
      <div className="max-w-[540px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="font-display font-bold text-ink mb-3"
            style={{ fontSize: 'clamp(1.65rem, 5vw, 2.3rem)' }}
          >
            أخبرنا عن مشروعك
          </h2>
          <p className="text-[1.05rem] text-ink-dim">
            بضعة أسئلة فقط — سنجد لك الشركة المناسبة
          </p>
        </div>

        {/* Progress track — aria-label updated on step change */}
        {!submitted && (
          <div
            className="flex gap-2 mb-6"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={step + 1}
            aria-label={`الخطوة ${step + 1} من 4`}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-[3px] rounded-full transition-colors duration-[350ms]"
                style={{
                  background: i <= step
                    ? 'var(--color-accent)'
                    : 'var(--color-line)',
                }}
              />
            ))}
          </div>
        )}

        {/* Form card */}
        <div
          className="bg-surface border border-line rounded-lg p-8 flex flex-col"
          style={{ minHeight: '360px' }}
        >
          {submitted ? (
            /* ── Success ───────────────────────────────── */
            <div
              className="step-enter flex-1 flex flex-col items-center justify-center text-center px-6 py-12"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="w-16 h-16 rounded-full bg-success-bg grid place-items-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--color-success)' }} aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-[1.4rem] font-bold text-ink mb-3">
                تم استلام طلبك!
              </h3>
              <p className="text-ink-dim max-w-[38ch] mx-auto leading-[1.7]">
                سيتواصل معك المستشار عبر واتساب خلال 24 ساعة بأفضل العروض
                الموثوقة لمشروعك.
              </p>
            </div>
          ) : (
            /* ── Active step ───────────────────────────── */
            <div
              key={step}
              className="step-enter flex-1 flex flex-col"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Counter + question — focusable for keyboard/screen reader flow */}
              <div
                ref={questionRef}
                tabIndex={-1}
                className="outline-none"
              >
                <span className="text-[0.78rem] font-medium text-ink-faint mb-3 block">
                  {STEP_LABELS[step]}
                </span>
                <div
                  className="font-display text-[1.35rem] font-semibold text-ink mb-6 leading-[1.35]"
                  aria-label={STEP_QUESTIONS[step]}
                >
                  {STEP_QUESTIONS[step]}
                </div>
              </div>

              {/* ── Step content ──────────────────────── */}
              <div className="flex-1">
                {/* Step 0: City */}
                {step === 0 && (
                   <div
                    ref={cityRef}
                    className="grid grid-cols-2 gap-3 min-[400px]:grid-cols-3"
                    role="group"
                    aria-label="اختر المدينة"
                  >
                    {CITIES.map((city) => {
                      const isSelected = data.city === city
                      return (
                        <button
                          key={city}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => select('city', city)}
                          className={`${coreBtn} ${isSelected ? selectedBtn : restBtn}`}
                        >
                          {city}
                        </button>
                      )
                    })}
                  </div>
                )}
 
                {/* Step 1: Service */}
                {step === 1 && (
                  <div
                    ref={serviceRef}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                    role="group"
                    aria-label="اختر نوع الخدمة"
                  >
                    {SERVICES.map(({ label, icon }) => {
                      const isSelected = data.service === label
                      return (
                        <button
                          key={label}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => select('service', label)}
                          className={`${coreTile} ${isSelected ? selectedTile : restTile}`}
                        >
                          <div className={`transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                            {icon}
                          </div>
                          {label}
                        </button>
                      )
                    })}
                  </div>
                )}
 
                {/* Step 2: Budget */}
                {step === 2 && (
                  <div
                    ref={budgetRef}
                    className="flex flex-col gap-3"
                    role="radiogroup"
                    aria-label="اختر نطاق الميزانية"
                  >
                    {BUDGETS.map((budget) => {
                      const selected = data.budget === budget
                      return (
                        <button
                          key={budget}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => select('budget', budget)}
                          className={`${coreBudget} ${selected ? selectedBudget : restBudget}`}
                        >
                          <span 
                            className="radio-ring"
                            style={{ 
                              background: selected ? 'var(--color-surface)' : 'transparent',
                              borderColor: selected ? 'var(--color-surface)' : 'var(--color-line-strong)'
                            }} 
                          >
                            {selected && (
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            )}
                          </span>
                          {budget}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Step 3: Contact */}
                {step === 3 && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="f-name"
                        className="block text-[0.82rem] font-medium text-ink-dim mb-2"
                      >
                        الاسم الكامل
                      </label>
                      <input
                        ref={nameRef}
                        id="f-name"
                        type="text"
                        placeholder="مثال: أحمد محمد"
                        value={data.name}
                        onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                        autoComplete="name"
                        className="
                          input-field w-full px-4 py-[13px] border border-line rounded-sm
                          bg-bg text-ink font-body text-base
                          placeholder:text-ink-faint
                          transition-[border-color,box-shadow] duration-[180ms]
                        "
                        style={{ direction: 'rtl' }}
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="f-phone"
                        className="block text-[0.82rem] font-medium text-ink-dim mb-2"
                      >
                        رقم الجوال
                      </label>
                      <input
                        ref={phoneRef}
                        id="f-phone"
                        type="tel"
                        placeholder="+966 5X XXX XXXX"
                        value={data.phone}
                        onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                        autoComplete="tel"
                        className="
                          input-field w-full px-4 py-[13px] border border-line rounded-sm
                          bg-bg text-ink font-body text-base
                          placeholder:text-ink-faint
                          transition-[border-color,box-shadow] duration-[180ms]
                        "
                        dir="ltr"
                        style={{ textAlign: 'left' }}
                        aria-required="true"
                        aria-describedby="phone-hint"
                      />
                      <span id="phone-hint" className="text-[0.77rem] text-ink-faint mt-1 block">
                        سيتم التواصل معك عبر واتساب خلال 24 ساعة
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Step navigation ───────────────────── */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="
                      font-body text-[0.88rem] text-ink-faint bg-transparent
                      border border-line px-4 py-2 rounded-full cursor-pointer
                      transition-[color,border-color,transform] duration-[180ms]
                      hover:text-ink hover:border-line-strong hover:scale-105
                      active:scale-95
                    "
                    aria-label="العودة للسؤال السابق"
                  >
                    → رجوع
                  </button>
                ) : (
                  /* Invisible placeholder to keep layout stable */
                  <span className="invisible" aria-hidden="true">رجوع</span>
                )}

                <button
                  type="button"
                  onClick={step < 3 ? goNext : handleSubmit}
                  className="
                    ms-auto bg-accent text-surface font-body text-[0.97rem] font-medium
                    px-8 py-[11px] rounded-full border-none cursor-pointer
                    transition-all duration-[180ms]
                    hover:bg-accent-hover hover:-translate-y-px hover:shadow-lg
                    active:scale-95
                  "
                >
                  {step < 3 ? 'التالي ←' : 'إرسال الطلب ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
