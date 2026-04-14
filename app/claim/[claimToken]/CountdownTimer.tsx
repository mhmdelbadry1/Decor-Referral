'use client'

import { useEffect, useState } from 'react'

const TWO_HOURS_MS = 2 * 60 * 60 * 1000

function getRemainingMs(claimedAt: string): number {
  const deadline = new Date(claimedAt).getTime() + TWO_HOURS_MS
  return Math.max(0, deadline - Date.now())
}

export default function CountdownTimer({ claimedAt }: { claimedAt: string }) {
  const [remaining, setRemaining] = useState(() => getRemainingMs(claimedAt))

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining(getRemainingMs(claimedAt)), 1000)
    return () => clearInterval(id)
  }, [claimedAt, remaining])

  if (remaining <= 0) {
    return (
      <span style={{ color: 'oklch(65% 0.18 25)', fontWeight: 600 }}>
        انتهى الوقت
      </span>
    )
  }

  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  const s = Math.floor((remaining % 60_000) / 1_000)
  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <span
      dir="ltr"
      className="font-body font-semibold tabular-nums"
      style={{ color: 'oklch(75% 0.14 70)' }}
    >
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}
