'use client'

import { useTransition } from 'react'
import { updateLeadStatusByClaim, type LeadStatus } from './updateLeadStatusByClaim'

const STATUS_ORDER: LeadStatus[] = [
  'تم التواصل',
  'تمت الزيارة',
  'تمت البيعة',
  'لم يتم الاتفاق',
]

const TERMINAL = new Set<LeadStatus>(['تمت البيعة', 'لم يتم الاتفاق'])

const STATUSES: { key: LeadStatus; color: string; bg: string }[] = [
  {
    key: 'تم التواصل',
    color: 'var(--color-secondary)',
    bg: 'oklch(18% 0.06 235)',
  },
  {
    key: 'تمت الزيارة',
    color: 'oklch(75% 0.14 70)',
    bg: 'oklch(20% 0.06 70)',
  },
  {
    key: 'تمت البيعة',
    color: 'var(--color-success)',
    bg: 'var(--color-success-bg)',
  },
  {
    key: 'لم يتم الاتفاق',
    color: 'oklch(65% 0.18 25)',
    bg: 'oklch(18% 0.06 25)',
  },
]

export default function ClaimStatusButtons({
  claimToken,
  currentStatus,
}: {
  claimToken: string
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition()

  const currentIndex = STATUS_ORDER.indexOf(currentStatus as LeadStatus)
  const isTerminal   = TERMINAL.has(currentStatus as LeadStatus)

  return (
    <div className="flex flex-col gap-3">
      {STATUSES.map(({ key, color, bg }) => {
        const isActive    = currentStatus === key
        const buttonIndex = STATUS_ORDER.indexOf(key)
        const isLocked    = isTerminal || buttonIndex < currentIndex

        return (
          <button
            key={key}
            type="button"
            disabled={isPending || isActive || isLocked}
            onClick={() => startTransition(() => updateLeadStatusByClaim(claimToken, key))}
            className="
              min-h-[56px] px-5 py-4 rounded-lg border
              font-body text-[1rem] font-medium
              flex items-center justify-between gap-3
              transition-all duration-[180ms]
              disabled:opacity-60 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            "
            style={
              isActive
                ? { background: bg, borderColor: color, color: color }
                : { background: 'var(--color-surface)', borderColor: 'var(--color-line)', color: 'var(--color-ink)' }
            }
          >
            <span>{key}</span>

            {isActive && (
              <svg
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}

            {isPending && !isActive && (
              <span
                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
