'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { declineLead } from '@/app/actions/declineLead'

const TERMINAL_STATUSES = ['تمت البيعة', 'لم يتم الاتفاق']

export default function DeclineButton({
  claimToken,
  currentStatus,
}: {
  claimToken: string
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isTerminal = TERMINAL_STATUSES.includes(currentStatus)
  const isDisabled  = isPending || isTerminal

  function handleDecline() {
    if (isDisabled) return
    setError(null)
    startTransition(async () => {
      const result = await declineLead(claimToken)
      if (result.success) {
        router.refresh()
      } else {
        setError('حدث خطأ أثناء إعادة الطلب. حاول مرة أخرى أو تواصل مع الدعم.')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleDecline}
        title={isTerminal ? 'تم إغلاق هذا الطلب نهائياً ولا يمكن إعادته' : undefined}
        className="
          min-h-[48px] w-full rounded-lg
          font-body text-[0.9rem] font-medium
          flex items-center justify-center gap-2
          transition-all duration-[180ms]
          disabled:opacity-40 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        "
        style={{
          background:    'transparent',
          border:        '1px solid var(--color-line)',
          color:         isTerminal ? 'var(--color-ink-faint)' : 'var(--color-ink-dim)',
          textDecoration: isTerminal ? 'line-through' : 'none',
          pointerEvents:  isTerminal ? 'none' : undefined,
        }}
        onMouseEnter={(e) => {
          if (isTerminal) return
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(50% 0.18 25)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(65% 0.18 25)'
        }}
        onMouseLeave={(e) => {
          if (isTerminal) return
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-line)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink-dim)'
        }}
      >
        {isPending && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        غير مناسب / إعادة للمجموعة
      </button>

      {isTerminal && (
        <p
          className="font-body text-center"
          style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', marginTop: '6px' }}
        >
          الطلب مُغلق — لا يمكن إعادته بعد اختيار حالة نهائية
        </p>
      )}

      {error && (
        <p
          className="font-body text-center"
          style={{ fontSize: '0.8rem', color: 'oklch(65% 0.18 25)', marginTop: '8px' }}
        >
          {error}
        </p>
      )}
    </>
  )
}
