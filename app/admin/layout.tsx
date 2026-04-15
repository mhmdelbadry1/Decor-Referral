import AdminNav from './components/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * Root layout applies `lg:pl-20` on <body> to compensate for the fixed
     * sidebar Nav. Admin pages don't render the Nav, so we counteract that
     * physical left padding with a negative left margin.
     * Using physical `ml` (not logical `ms`) intentionally — we're undoing a
     * physical property set on <body>.
     */
    <div
      className="min-h-screen lg:-ml-20 lg:pb-0"
      style={{ background: 'var(--color-bg)' }}
    >
      <AdminNav />
      {children}
    </div>
  )
}
