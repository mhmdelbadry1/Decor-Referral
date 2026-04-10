import type { Metadata, Viewport } from 'next'
import { El_Messiri, Tajawal } from 'next/font/google'
import './globals.css'

/* ─── Font optimisation via next/font ─────────────────────
   Variables injected on <html> element, referenced in @theme.
   ───────────────────────────────────────────────────────── */
const elMessiri = El_Messiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-el-messiri',
  display: 'swap',
  preload: true,
})

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
  preload: true,
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'مستشار الديكور — احصل على أفضل شركات التشطيب',
  description:
    'نربطك بأفضل مقاولي التشطيب الموثوقين في مدينتك — بناءً على ميزانيتك وخدمتك المطلوبة. مجاناً تماماً.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${elMessiri.variable} ${tajawal.variable}`}
    >
      <body className="lg:pl-20 pb-16 min-h-screen bg-bg antialiased">
        {children}
      </body>
    </html>
  )
}
