'use client'

export default function LogoutButton({ logoutAction }: { logoutAction: () => Promise<void> }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="
          px-4 py-2 rounded-lg font-body font-medium
          transition-all duration-[180ms]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        "
        style={{
          background: 'transparent',
          border: '1px solid var(--color-line)',
          color: 'var(--color-ink-faint)',
          fontSize: '0.85rem',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(50% 0.18 25)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(65% 0.18 25)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-line)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink-faint)'
        }}
      >
        تسجيل الخروج
      </button>
    </form>
  )
}
