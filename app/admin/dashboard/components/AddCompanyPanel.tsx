'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { addCompany } from '@/app/admin/actions/addCompany'

const SERVICES = [
  'ارضيات', 'اضاءة', 'دهانات', 'ديكور', 'جبس',
  'مطابخ', 'أثاث', 'ستائر', 'حمامات', 'واجهات',
]

const CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة',
  'الدمام', 'الخبر', 'الظهران', 'القطيف', 'الأحساء',
  'تبوك', 'بريدة', 'حائل', 'أبها', 'خميس مشيط',
  'الطائف', 'نجران', 'جازان', 'ينبع', 'الجبيل',
]

const inputStyle: React.CSSProperties = {
  background  : 'var(--color-bg)',
  border      : '1px solid var(--color-line)',
  color       : 'var(--color-ink)',
  borderRadius: 'var(--radius)',
  fontSize    : '0.95rem',
  width       : '100%',
  padding     : '10px 14px',
  outline     : 'none',
  fontFamily  : 'var(--font-body)',
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-body font-medium mb-2"
      style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
    >
      {children}
    </p>
  )
}

function CheckGroup({
  name, options, cols = 3,
}: {
  name: string
  options: string[]
  cols?: number
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map(opt => (
        <label
          key={opt}
          className="flex items-center gap-2 cursor-pointer select-none rounded-lg px-3 py-2 transition-colors duration-150"
          style={{ border: '1px solid var(--color-line)', background: 'var(--color-bg)' }}
        >
          <input
            type="checkbox"
            name={name}
            value={opt}
            className="accent-accent w-4 h-4 shrink-0"
          />
          <span className="font-body" style={{ fontSize: '0.82rem', color: 'var(--color-ink-dim)' }}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  )
}

export default function AddCompanyPanel() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(addCompany, null)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form and close on success
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      // Keep panel open so Mohammed can see the success message
    }
  }, [state?.success])

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
    >
      {/* ── Toggle Header ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-5 flex items-center justify-between gap-3 transition-colors duration-150"
        style={{ background: 'transparent', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          {/* Plus / Minus icon */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150"
            style={{
              background: open ? 'var(--color-accent-muted)' : 'oklch(20% 0.04 255)',
              color: open ? 'var(--color-accent)' : 'var(--color-ink-dim)',
            }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open
                ? <line x1="5" y1="12" x2="19" y2="12" />
                : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
              }
            </svg>
          </div>
          <div className="text-start">
            <p className="font-display font-semibold" style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>
              إضافة شركة جديدة
            </p>
            <p className="font-body" style={{ fontSize: '0.78rem', color: 'var(--color-ink-faint)', marginTop: '2px' }}>
              أضف شركة شريكة يدوياً وحدد تخصصاتها ومناطقها
            </p>
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          style={{
            color: 'var(--color-ink-faint)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Form Body ─────────────────────────────────── */}
      {open && (
        <div style={{ borderTop: '1px solid var(--color-line)' }}>
          {/* Success banner */}
          {state?.success && (
            <div
              className="px-6 py-3 flex items-center gap-2"
              style={{ background: 'var(--color-success-bg)', borderBottom: '1px solid var(--color-line)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'var(--color-success)', flexShrink: 0 }}
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="font-body font-medium" style={{ fontSize: '0.88rem', color: 'var(--color-success)' }}>
                تمت إضافة الشركة بنجاح — ستظهر في قائمة الشركات أعلاه
              </p>
            </div>
          )}

          <form ref={formRef} action={formAction} className="px-6 py-6 flex flex-col gap-6">

            {/* Row 1: Company name + Rep name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel>اسم الشركة *</FieldLabel>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="مثال: شركة النخبة للتشطيبات"
                  className="input-field"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>اسم المندوب *</FieldLabel>
                <input
                  type="text"
                  name="contactName"
                  required
                  placeholder="مثال: أحمد الشمري"
                  className="input-field"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2: WhatsApp */}
            <div className="max-w-xs">
              <FieldLabel>رقم واتساب المندوب *</FieldLabel>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+966512345678"
                dir="ltr"
                className="input-field text-start"
                style={{ ...inputStyle, letterSpacing: '0.05em' }}
              />
              <p className="font-body mt-1.5" style={{ fontSize: '0.73rem', color: 'var(--color-ink-faint)' }}>
                يجب أن يبدأ بـ +9665
              </p>
            </div>

            {/* Row 3: Services */}
            <div>
              <FieldLabel>التخصصات * (اختر واحدة أو أكثر)</FieldLabel>
              <CheckGroup name="services" options={SERVICES} cols={3} />
            </div>

            {/* Row 4: Cities */}
            <div>
              <FieldLabel>المناطق * (اختر واحدة أو أكثر)</FieldLabel>
              <CheckGroup name="cities" options={CITIES} cols={3} />
            </div>

            {/* Error */}
            {state?.error && (
              <p
                className="font-body"
                role="alert"
                style={{ fontSize: '0.85rem', color: 'oklch(65% 0.18 25)' }}
              >
                {state.error}
              </p>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="
                  px-6 py-2.5 rounded-lg font-body font-semibold
                  flex items-center gap-2
                  transition-all duration-[180ms]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                "
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                  fontSize: '0.92rem',
                }}
              >
                {isPending && (
                  <span
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isPending ? 'جارٍ الإضافة...' : 'إضافة الشركة'}
              </button>

              <button
                type="button"
                onClick={() => { formRef.current?.reset(); setOpen(false) }}
                className="px-4 py-2.5 rounded-lg font-body transition-all duration-[180ms]"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-ink-faint)',
                  fontSize: '0.88rem',
                }}
              >
                إلغاء
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  )
}
