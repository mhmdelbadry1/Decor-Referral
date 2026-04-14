'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { declineLead } from '@/app/actions/declineLead'

export default function DeclineButton({ claimToken }: { claimToken: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDecline() {
    if (!window.confirm('هل تريد إعادة هذا العميل للمجموعة؟\nلن تتمكن من استرجاعه لاحقاً.')) return
    startTransition(async () => {
      await declineLead(claimToken)
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDecline}
      className="
        min-h-[48px] w-full rounded-lg
        font-body text-[0.9rem] font-medium
        flex items-center justify-center gap-2
        transition-all duration-[180ms]
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      "
      style={{
        background: 'transparent',
        border: '1px solid var(--color-line)',
        color: 'var(--color-ink-dim)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
          'oklch(50% 0.18 25)'
        ;(e.currentTarget as HTMLButtonElement).style.color =
          'oklch(65% 0.18 25)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
          'var(--color-line)'
        ;(e.currentTarget as HTMLButtonElement).style.color =
          'var(--color-ink-dim)'
      }}
    >
      {isPending ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : null}
      غير مناسب / إعادة للمجموعة
    </button>
  )
}
