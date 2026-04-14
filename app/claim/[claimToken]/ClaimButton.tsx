'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimLead } from '@/app/actions/claimLead'

export default function ClaimButton({ claimToken }: { claimToken: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleClaim() {
    setError(null)
    startTransition(async () => {
      const result = await claimLead(claimToken)
      if (result.success) {
        router.refresh()
      } else if (result.reason === 'already_claimed') {
        setError('عذراً، سبقتك شركة أخرى في التقاط هذا العميل.')
        router.refresh()
      } else if (result.reason === 'banned') {
        setError('تم سحب هذا الطلب من شركتك مسبقاً ولا يمكن التقاطه مجدداً.')
        router.refresh()
      } else {
        setError('رابط غير صالح أو منتهي الصلاحية.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p
          className="font-body text-[0.87rem] text-center"
          style={{ color: 'oklch(65% 0.18 25)' }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={handleClaim}
        className="
          min-h-[60px] w-full rounded-lg border-none cursor-pointer
          font-body text-[1.05rem] font-semibold
          flex items-center justify-center gap-3
          transition-all duration-[200ms]
          hover:-translate-y-px hover:shadow-xl
          active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
        "
        style={{
          background: isPending
            ? 'var(--color-success)'
            : 'linear-gradient(135deg, var(--color-success) 0%, oklch(55% 0.18 145) 100%)',
          color: '#fff',
          boxShadow: isPending ? 'none' : '0 4px 20px oklch(55% 0.18 145 / 35%)',
        }}
      >
        {isPending ? (
          <>
            <span
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"
              aria-hidden="true"
            />
            جاري التقاط العميل…
          </>
        ) : (
          'التقاط العميل وكشف رقمه ←'
        )}
      </button>
    </div>
  )
}
