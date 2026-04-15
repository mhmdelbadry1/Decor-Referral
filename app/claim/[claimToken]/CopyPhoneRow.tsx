'use client'

import { useState } from 'react'

export default function CopyPhoneRow({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('input')
      el.value = phone
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="font-body font-medium"
        style={{ fontSize: '0.73rem', color: 'var(--color-ink-faint)', letterSpacing: '0.06em' }}
      >
        رقم الجوال
      </span>
      <div className="flex items-center gap-2">
        <span
          dir="ltr"
          className="font-body"
          style={{ fontSize: '0.97rem', color: 'var(--color-ink)' }}
        >
          {phone}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'تم النسخ' : 'نسخ رقم الجوال'}
          className="shrink-0 rounded-md flex items-center justify-center transition-all duration-150"
          style={{
            width: '26px',
            height: '26px',
            background: copied ? 'oklch(22% 0.08 145)' : 'var(--color-surface)',
            border: `1px solid ${copied ? 'oklch(38% 0.12 145)' : 'var(--color-line)'}`,
            color: copied ? 'var(--color-success)' : 'var(--color-ink-faint)',
            cursor: 'pointer',
          }}
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
