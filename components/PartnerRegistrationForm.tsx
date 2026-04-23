'use client'

import { useCallback, useRef, useState } from 'react'
import PhoneInput from '@/components/PhoneInput'
import { submitPartnerRegistration } from '@/app/actions/submitPartnerRegistration'

/* ── Types ────────────────────────────────────────────── */
type CompanyData = {
  companyName: string
  services: string[]
  cities: string[]
  contactName: string
  phone: string
  phoneNormalized: string | null
}

type Props = {
  cities?: string[]
  services?: string[]
}

const DEFAULT_CITIES   = ['الدمام', 'القطيف', 'الخبر', 'الاحساء', 'الرياض', 'جدة', 'مكة', 'المدينة']
const DEFAULT_SERVICES = ['المنيوم', 'ارضيات', 'ابواب', 'اثاث', 'اضاءة', 'دهانات', 'مطابخ']

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

/* ── CheckIcon ─────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── BuildingIcon ──────────────────────────────────────── */
function BuildingIcon() {
  return (
    <svg
      width="22" height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

/* ── Main component ────────────────────────────────────── */
export default function PartnerRegistrationForm({
  cities   = DEFAULT_CITIES,
  services = DEFAULT_SERVICES,
}: Props) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [data, setData] = useState<CompanyData>({
    companyName: '',
    services: [],
    cities: [],
    contactName: '',
    phone: '',
    phoneNormalized: null,
  })

  const companyNameRef  = useRef<HTMLInputElement>(null)
  const servicesRef     = useRef<HTMLDivElement>(null)
  const citiesRef       = useRef<HTMLDivElement>(null)
  const contactNameRef  = useRef<HTMLInputElement>(null)
  const phoneRef        = useRef<HTMLInputElement>(null)
  const questionRef     = useRef<HTMLDivElement>(null)

  const focusQuestion = useCallback(() => {
    setTimeout(() => questionRef.current?.focus(), 50)
  }, [])

  function toggleService(val: string) {
    setData((d) => ({
      ...d,
      services: d.services.includes(val)
        ? d.services.filter((s) => s !== val)
        : [...d.services, val],
    }))
  }

  function toggleCity(val: string) {
    setData((d) => ({
      ...d,
      cities: d.cities.includes(val)
        ? d.cities.filter((c) => c !== val)
        : [...d.cities, val],
    }))
  }

  function goNext() {
    if (step === 0) {
      if (!data.companyName.trim()) { shake(companyNameRef.current); return }
      if (data.services.length === 0) { shake(servicesRef.current); return }
    }
    if (step === 1 && data.cities.length === 0) { shake(citiesRef.current); return }
    setStep((s) => s + 1)
    focusQuestion()
  }

  function goPrev() {
    setStep((s) => s - 1)
    focusQuestion()
  }

  async function handleSubmit() {
    if (!data.contactName.trim()) { shake(contactNameRef.current); return }
    if (!data.phoneNormalized)    { shake(phoneRef.current);       return }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitPartnerRegistration({
        companyName:  data.companyName,
        services:     data.services,
        cities:       data.cities,
        contactName:  data.contactName,
        phone:        data.phoneNormalized,
      })
      if (result?.error) {
        setSubmitError(result.error)
      } else {
        setSubmitted(true)
      }
    } catch {
      setSubmitError('حدث خطأ أثناء الإرسال. حاول مجدداً.')
    } finally {
      setSubmitting(false)
    }
  }

  const STEP_LABELS    = ['الخطوة ١ من ٣', 'الخطوة ٢ من ٣', 'الخطوة ٣ من ٣']
  const STEP_QUESTIONS = [
    'ما اسم شركتك وماذا تقدم؟',
    'ما المدن التي تغطيها؟',
    'كيف يمكننا التواصل معكم؟',
  ]

  /* pill style helpers */
  const corePill     = "min-h-[44px] px-4 py-2.5 border rounded-full font-body text-[0.9rem] cursor-pointer transition-all duration-[160ms] flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
  const restPill     = "bg-bg text-ink-dim border-line hover:border-accent hover:text-ink hover:bg-accent-muted"
  const selectedPill = "bg-accent text-surface border-accent"

  return (
    <section
      id="partners-section"
      className="bg-bg px-6 py-20"
      aria-label="نموذج تسجيل الشركات الشريكة"
    >
      <div className="max-w-[540px] mx-auto">

        {/* ── Section header ───────────────────────────── */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
            aria-hidden="true"
          >
            <BuildingIcon />
          </div>
          <div>
            <p className="text-[0.75rem] font-bold tracking-widest uppercase text-ink-faint mb-0.5">
              للشركات والمقاولين
            </p>
            <h2
              className="font-display font-bold text-ink leading-tight"
              style={{ fontSize: 'clamp(1.35rem, 4vw, 1.8rem)' }}
            >
              انضم كشريك موثوق
            </h2>
          </div>
        </div>

        <p className="text-[0.97rem] text-ink-dim leading-[1.75] mb-10 max-w-[46ch]">
          نحن نبحث عن شركات تشطيب وديكور موثوقة في المملكة للتعاون المستمر.
          سجّل شركتك وسنتواصل معك عند توفر عملاء مناسبين.
        </p>

        {/* Progress track */}
        {!submitted && (
          <div
            className="flex gap-2 mb-6"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={step + 1}
            aria-label={`الخطوة ${step + 1} من 3`}
          >
            {[0, 1, 2].map((i) => (
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
          style={{ minHeight: '340px' }}
        >
          {submitted ? (
            /* ── Success state ─────────────────────────── */
            <div
              className="step-enter flex-1 flex flex-col items-center justify-center text-center px-6 py-10"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div
                className="w-14 h-14 rounded-full grid place-items-center mb-5"
                style={{ background: 'var(--color-accent-muted)' }}
              >
                <svg
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--color-accent)' }}
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-[1.35rem] font-bold text-ink mb-3">
                تم استلام طلبكم!
              </h3>
              <p className="text-ink-dim leading-[1.7] max-w-[36ch] mx-auto">
                سيراجع المستشار بيانات شركتكم ويتواصل معكم قريباً لترتيب التعاون.
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
              <div ref={questionRef} tabIndex={-1} className="outline-none">
                <span className="text-[0.76rem] font-medium text-ink-faint mb-2.5 block">
                  {STEP_LABELS[step]}
                </span>
                <p
                  className="font-display text-[1.25rem] font-semibold text-ink mb-6 leading-[1.35]"
                  aria-label={STEP_QUESTIONS[step]}
                >
                  {STEP_QUESTIONS[step]}
                </p>
              </div>

              {/* ── Step content ──────────────────────── */}
              <div className="flex-1">

                {/* Step 0: Company name + services */}
                {step === 0 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label
                        htmlFor="p-company"
                        className="block text-[0.8rem] font-medium text-ink-dim mb-2"
                      >
                        اسم الشركة
                      </label>
                      <input
                        ref={companyNameRef}
                        id="p-company"
                        type="text"
                        placeholder="مثال: شركة الإتقان للتشطيبات"
                        value={data.companyName}
                        onChange={(e) => setData((d) => ({ ...d, companyName: e.target.value }))}
                        autoComplete="organization"
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
                      <p className="text-[0.8rem] font-medium text-ink-dim mb-3">
                        نوع الخدمات{' '}
                        <span className="text-ink-faint font-normal">(اختر ما ينطبق)</span>
                      </p>
                      <div
                        ref={servicesRef}
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="نوع الخدمات المقدمة"
                      >
                        {services.map((s) => {
                          const selected = data.services.includes(s)
                          return (
                            <button
                              key={s}
                              type="button"
                              role="checkbox"
                              aria-checked={selected}
                              onClick={() => toggleService(s)}
                              className={`${corePill} ${selected ? selectedPill : restPill}`}
                            >
                              {selected && <CheckIcon />}
                              {s}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Cities */}
                {step === 1 && (
                  <div>
                    <p className="text-[0.8rem] font-medium text-ink-dim mb-3">
                      المدن المغطاة{' '}
                      <span className="text-ink-faint font-normal">(اختر جميع المدن التي تعمل فيها)</span>
                    </p>
                    <div
                      ref={citiesRef}
                      className="flex flex-wrap gap-2"
                      role="group"
                      aria-label="المدن التي تغطيها الشركة"
                    >
                      {cities.map((c) => {
                        const selected = data.cities.includes(c)
                        return (
                          <button
                            key={c}
                            type="button"
                            role="checkbox"
                            aria-checked={selected}
                            onClick={() => toggleCity(c)}
                            className={`${corePill} ${selected ? selectedPill : restPill}`}
                          >
                            {selected && <CheckIcon />}
                            {c}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Contact */}
                {step === 2 && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="p-name"
                        className="block text-[0.8rem] font-medium text-ink-dim mb-2"
                      >
                        اسم المسؤول
                      </label>
                      <input
                        ref={contactNameRef}
                        id="p-name"
                        type="text"
                        placeholder="مثال: خالد العمري"
                        value={data.contactName}
                        onChange={(e) => setData((d) => ({ ...d, contactName: e.target.value }))}
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
                      <PhoneInput
                        ref={phoneRef}
                        id="p-phone"
                        value={data.phone}
                        onChange={(raw, normalized) =>
                          setData((d) => ({ ...d, phone: raw, phoneNormalized: normalized }))
                        }
                        aria-describedby="p-phone-hint"
                      />
                      <span id="p-phone-hint" className="text-[0.76rem] text-ink-faint mt-1 block">
                        سيتواصل المستشار معكم للتحقق والتفاصيل
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Navigation ────────────────────────── */}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-line">
                {submitError && (
                  <p className="text-[0.83rem] text-center" style={{ color: 'oklch(65% 0.18 25)' }}>
                    {submitError}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={submitting}
                      className="
                        font-body text-[0.87rem] text-ink-faint bg-transparent
                        border border-line px-4 py-2 rounded-full cursor-pointer
                        transition-[color,border-color,transform] duration-[180ms]
                        hover:text-ink hover:border-line-strong hover:scale-105
                        active:scale-95 disabled:opacity-40
                      "
                      aria-label="العودة للخطوة السابقة"
                    >
                      → رجوع
                    </button>
                  ) : (
                    <span className="invisible" aria-hidden="true">رجوع</span>
                  )}

                  <button
                    type="button"
                    onClick={step < 2 ? goNext : handleSubmit}
                    disabled={submitting}
                    className="
                      ms-auto bg-accent text-surface font-body text-[0.95rem] font-medium
                      px-7 py-[11px] rounded-full border-none cursor-pointer
                      transition-all duration-[180ms]
                      hover:bg-accent-hover hover:-translate-y-px hover:shadow-lg
                      active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                      flex items-center gap-2
                    "
                  >
                    {submitting && (
                      <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    )}
                    {step < 2 ? 'التالي ←' : submitting ? 'جاري الإرسال…' : 'إرسال الطلب ✓'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fine print */}
        {!submitted && (
          <p className="text-[0.75rem] text-ink-faint mt-4 text-center leading-relaxed">
            يخضع القبول لمعايير الجودة — لا يُقبل كل المتقدمين
          </p>
        )}
      </div>
    </section>
  )
}
