'use client'

import { type ReactNode } from 'react'

/* ── Icons ───────────────────────────────────────────── */
function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )
}

function AboutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  )
}

function ProcessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
  )
}

function ConsultIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
  )
}

const NAV_ITEMS = [
  { id: 'top', label: 'الرئيسية', icon: <HomeIcon /> },
  { id: 'about-section', label: 'من نحن', icon: <AboutIcon /> },
  { id: 'process-section', label: 'كيف نعمل', icon: <ProcessIcon /> },
  { id: 'form-section', label: 'طلب استشارة', icon: <ConsultIcon />, primary: true },
]

export default function Nav() {
  function scroll(id: string) {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── Desktop Side Header (Left for RTL) ─────────── */}
      <nav 
        className="hidden lg:flex fixed inset-y-0 left-0 w-20 bg-surface border-r border-line flex-col items-center py-10 z-[100]"
        aria-label="التنقل الجانبي"
      >
        {/* Short Logo */}
        <div className="font-display text-accent font-bold text-lg mb-16 select-none rotate-180" style={{ writingMode: 'vertical-rl' }}>
          المستشار
        </div>

        <ul className="flex flex-col gap-10 list-none p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scroll(item.id)}
                className={`
                  p-3 rounded-xl transition-all duration-300 cursor-pointer group relative
                  ${item.primary ? 'bg-accent text-surface shadow-md hover:bg-accent-hover' : 'text-ink-faint hover:text-accent hover:bg-surface-warm'}
                  active:scale-90
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                `}
                aria-label={item.label}
              >
                {item.icon}
                {/* Tooltip - on right side of nav item */}
                <span className="
                  absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2
                  bg-accent text-surface text-[0.7rem] px-3 py-1.5 rounded-sm
                  whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity duration-150 shadow-sm
                  before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2
                  before:border-[6px] before:border-transparent before:border-r-accent
                ">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Year indicator */}
        <div className="mt-auto text-[0.65rem] font-bold tracking-widest whitespace-nowrap" style={{ transform: 'rotate(-90deg)', color: '#5c3d2e', opacity: 0.3 }}>
          EST. 2025
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ────────────────────── */}
      <nav 
        className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-surface/80 backdrop-blur-md border-t border-line grid grid-cols-4 items-center px-4 z-[100]"
        aria-label="التنقل السفلي"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scroll(item.id)}
            className={`
              flex flex-col items-center justify-center gap-1 transition-all
              ${item.primary ? 'text-accent' : 'text-ink-faint'}
              active:scale-95
            `}
            aria-label={item.label}
          >
            <div className={item.primary ? 'scale-110' : ''}>
              {item.icon}
            </div>
            <span className="text-[0.65rem] font-bold uppercase tracking-tight">
              {item.label.split(' ')[0]} {/* Short labels for mobile */}
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
