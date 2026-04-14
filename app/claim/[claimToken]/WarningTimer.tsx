'use client'

import { useEffect, useState } from 'react'

const FORTY_FIVE_MIN_MS = 45 * 60 * 1000

function getRemaining(warningSentAt: string): number {
  const deadline = new Date(warningSentAt).getTime() + FORTY_FIVE_MIN_MS
  return Math.max(0, deadline - Date.now())
}

export default function WarningTimer({ warningSentAt }: { warningSentAt: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(warningSentAt))

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining(getRemaining(warningSentAt)), 1000)
    return () => clearInterval(id)
  }, [warningSentAt, remaining])

  if (remaining <= 0) {
    return (
      <span
        className="font-body font-semibold"
        style={{ fontSize: '0.85rem', color: 'oklch(65% 0.18 25)' }}
      >
        جاري معالجة القرار…
      </span>
    )
  }

  const m = Math.floor(remaining / 60_000)
  const s = Math.floor((remaining % 60_000) / 1_000)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <span
      dir="ltr"
      className="font-body font-semibold tabular-nums"
      style={{ fontSize: '1rem', color: 'oklch(75% 0.15 50)' }}
    >
      {pad(m)}:{pad(s)}
    </span>
  )
}
