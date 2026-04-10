'use client'

const LINKS = [
  { href: '#about-section', label: 'من نحن' },
  { href: '#stats-section', label: 'شركاؤنا' },
  { href: 'https://wa.me/966500000000', label: 'واتساب' },
  { href: '#', label: 'سياسة الخصوصية' },
]

export default function Footer() {
  return (
    <footer className="bg-surface px-6 pb-8 pt-12 text-center border-t border-line" aria-label="تذييل الصفحة">
      <div className="max-w-[600px] mx-auto">
        <span
          className="font-display text-[1.45rem] font-bold text-accent block mb-3"
          aria-label="مستشار الديكور"
        >
          مستشار الديكور
        </span>

        <p className="text-[0.9rem] mb-8 text-ink-dim leading-relaxed">
          نربطك بأفضل شركات التشطيب الموثوقة في مدينتك — مجاناً.
        </p>

        <nav aria-label="روابط التذييل">
          <ul className="flex justify-center gap-8 flex-wrap mb-10 list-none">
            {LINKS.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => {
                    if (href.startsWith('#')) {
                      e.preventDefault()
                      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="
                    text-[0.88rem] text-ink-faint no-underline transition-all duration-300
                    hover:text-accent hover:scale-105 inline-block
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                  "
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="h-px w-16 mx-auto mb-8 bg-line-strong"
          aria-hidden="true"
        />

        <p className="text-[0.7rem] text-ink-faint tracking-widest uppercase">
          © 2025 مستشار الديكور · جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}
