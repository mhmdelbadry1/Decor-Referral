'use client'

import { forwardRef, useState } from 'react'
import { normalizeKSAPhone, formatKSAPhoneDisplay } from '@/lib/phone'

type ValidationState = 'idle' | 'valid' | 'invalid'

interface PhoneInputProps {
  id: string
  value: string
  onChange: (raw: string, normalized: string | null) => void
  'aria-describedby'?: string
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ id, value, onChange, 'aria-describedby': ariaDescribedBy }, ref) => {
    const [touched, setTouched] = useState(false)

    const normalized = value.trim() ? normalizeKSAPhone(value) : null
    const state: ValidationState = !touched || !value.trim()
      ? 'idle'
      : normalized
      ? 'valid'
      : 'invalid'

    const hintId = `${id}-hint`
    const errorId = `${id}-error`

    /* Border color by state */
    const borderColor =
      state === 'valid'   ? 'var(--color-success)' :
      state === 'invalid' ? 'oklch(65% 0.18 25)'   :
                            'var(--color-line)'

    const ringColor =
      state === 'valid'   ? 'oklch(74% 0.15 155 / 0.25)' :
      state === 'invalid' ? 'oklch(65% 0.18 25 / 0.2)'   :
                            'transparent'

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="block text-[0.82rem] font-medium"
          style={{ color: 'var(--color-ink-dim)' }}
        >
          رقم الجوال
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            placeholder="05X XXX XXXX"
            value={value}
            autoComplete="tel"
            aria-required="true"
            aria-invalid={state === 'invalid'}
            aria-describedby={[
              ariaDescribedBy,
              state === 'valid' ? hintId : undefined,
              state === 'invalid' ? errorId : undefined,
            ]
              .filter(Boolean)
              .join(' ') || undefined}
            onChange={(e) => {
              const raw = e.target.value
              onChange(raw, normalizeKSAPhone(raw))
            }}
            onBlur={() => setTouched(true)}
            className="
              w-full px-4 py-[13px] pe-10
              border rounded-sm
              bg-bg text-ink font-body text-base
              placeholder:text-ink-faint
              transition-[border-color,box-shadow] duration-[200ms]
              focus-visible:outline-none
            "
            dir="ltr"
            style={{
              textAlign: 'left',
              borderColor,
              boxShadow: `0 0 0 3px ${ringColor}`,
            }}
          />

          {/* State icon — only show X on invalid; valid state is communicated by the hint below */}
          {state === 'invalid' && (
            <span
              className="absolute top-1/2 -translate-y-1/2 end-3 pointer-events-none"
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ color: 'oklch(65% 0.18 25)' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          )}
        </div>

        {/* Valid: show normalized preview */}
        {state === 'valid' && normalized && (
          <p
            id={hintId}
            className="font-body"
            style={{ fontSize: '0.77rem', color: 'var(--color-success)', direction: 'ltr' }}
          >
            ✓ {formatKSAPhoneDisplay(normalized)}
          </p>
        )}

        {/* Invalid: error message */}
        {state === 'invalid' && (
          <p
            id={errorId}
            role="alert"
            className="font-body"
            style={{ fontSize: '0.77rem', color: 'oklch(65% 0.18 25)' }}
          >
            رقم غير صحيح — أدخل رقم جوال سعودي مثل 0512345678
          </p>
        )}

        {/* Idle hint */}
        {state === 'idle' && (
          <p
            className="font-body"
            style={{ fontSize: '0.77rem', color: 'var(--color-ink-faint)' }}
          >
            رقم جوال سعودي — مثال: 0512345678
          </p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export default PhoneInput
