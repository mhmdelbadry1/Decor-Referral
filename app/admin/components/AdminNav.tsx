'use client'

import Link        from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin/dashboard', label: 'لوحة التحكم' },
  { href: '/admin/leads',     label: 'إدارة الطلبات' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-30 px-4 md:px-8"
      style={{
        background  : 'var(--color-surface)',
        borderBottom: '1px solid var(--color-line)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-1 h-14">
        {/* Brand mark */}
        <span
          className="font-display font-bold me-4"
          style={{ fontSize: '0.95rem', color: 'var(--color-accent)', letterSpacing: '0.02em' }}
        >
          إدارة النظام
        </span>

        {LINKS.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg font-body font-medium transition-colors duration-150"
              style={{
                fontSize : '0.88rem',
                color    : isActive ? 'var(--color-accent)' : 'var(--color-ink-faint)',
                background: isActive ? 'var(--color-accent-muted)' : 'transparent',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
