'use client'

const LINKS = [
  { href: '#about-section', label: 'من نحن' },
  { href: '#stats-section', label: 'شركاؤنا' },
  { href: '#partners-section', label: 'انضم كشريك' },
  { href: 'https://wa.me/966542197220', label: 'واتساب' },
  { href: '#', label: 'سياسة الخصوصية' },
]

const IconTikTok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.72a8.18 8.18 0 004.78 1.52V6.79a4.85 4.85 0 01-1.01-.1z"/>
  </svg>
)

const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
)

export default function Footer() {
  return (
    <footer
      className="bg-surface border-t border-line"
      aria-label="تذييل الصفحة"
    >
      {/* ── Social follow strip ─────────────────────────── */}
      <div className="border-b border-line px-6 py-14 text-center">
        <div className="max-w-[480px] mx-auto">
          <p
            className="font-display font-bold text-ink leading-snug mb-2"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.6rem)' }}
          >
            تابعني لمعرفة أحدث التقنيات وصيحات الديكور العالمية
          </p>
          <p className="text-[0.82rem] text-ink-faint leading-relaxed mb-8">
            مواضيع متجددة يومياً تهم كل عشاق الديكور
          </p>

          <div className="flex justify-center gap-3">
            <a
              href="https://www.tiktok.com/@mo_daily1?_r=1&_t=ZS-95SEAIb0haW"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيك توك"
              className="
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-bg border border-line text-ink-faint
                transition-all duration-200
                hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
              "
            >
              <IconTikTok />
            </a>
            <a
              href="https://www.instagram.com/mo_daily1?igsh=MWsyN2h5Y3Zpcmtvaw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="انستغرام"
              className="
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-bg border border-line text-ink-faint
                transition-all duration-200
                hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-sm
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
              "
            >










              <IconInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────── */}
      <div className="px-6 py-8">
        <div className="max-w-[720px] mx-auto flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

          <span
            className="font-display text-[1.15rem] font-bold text-accent"
            aria-label="مستشار الديكور"
          >
            مستشار الديكور
          </span>

          <nav aria-label="روابط التذييل">
            <ul className="flex flex-wrap justify-center gap-6 list-none">
              {LINKS.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (href.startsWith('#')) {
                        e.preventDefault()
                        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="
                      text-[0.83rem] text-ink-faint no-underline
                      transition-colors duration-200 hover:text-accent
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                    "
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[0.7rem] text-ink-faint tracking-widest uppercase whitespace-nowrap">
            © 2025 · جميع الحقوق محفوظة
          </p>

        </div>
      </div>
    </footer>
  )
}
