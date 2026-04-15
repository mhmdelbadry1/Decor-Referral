import { createServerClient } from '@/lib/supabase'
import LeadsTable, { type LeadRecord, type CompanyOption } from './components/LeadsTable'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const supabase = createServerClient()

  const [leadsResult, companiesResult] = await Promise.all([
    supabase
      .from('leads')
      .select(`
        id, customer_name, customer_phone,
        city, services, budget, status,
        company_id, claimed_at, warning_sent_at,
        contact_verified_at, declined_by, created_at,
        companies ( name )
      `)
      .order('created_at', { ascending: false }),

    supabase
      .from('companies')
      .select('id, name, rep_name, rep_whatsapp, specialty, city')
      .order('name'),
  ])

  const rawLeads     = leadsResult.data     ?? []
  const rawCompanies = companiesResult.data ?? []

  /* Flatten the nested companies relation */
  const leads: LeadRecord[] = rawLeads.map((l) => {
    const companyRel  = l.companies
    const companyName = Array.isArray(companyRel)
      ? (companyRel[0]?.name ?? null)
      : ((companyRel as { name: string } | null)?.name ?? null)

    return {
      id                 : l.id,
      customer_name      : l.customer_name,
      customer_phone     : l.customer_phone,
      city               : l.city,
      services           : l.services ?? [],
      budget             : l.budget ?? '',
      status             : l.status,
      company_id         : l.company_id,
      company_name       : companyName,
      claimed_at         : l.claimed_at,
      warning_sent_at    : l.warning_sent_at,
      contact_verified_at: l.contact_verified_at,
      declined_by        : l.declined_by ?? [],
      created_at         : l.created_at,
    }
  })

  const companies: CompanyOption[] = rawCompanies.map((c) => ({
    id          : c.id,
    name        : c.name,
    rep_name    : c.rep_name    ?? null,
    rep_whatsapp: c.rep_whatsapp ?? null,
    specialty   : c.specialty   ?? [],
    city        : c.city        ?? [],
  }))

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="mb-6">
        <h1
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: 'var(--color-ink)' }}
        >
          إدارة الطلبات
        </h1>
        <p
          className="font-body mt-1"
          style={{ fontSize: '0.82rem', color: 'var(--color-ink-faint)' }}
        >
          {leads.length} طلب · تحكم كامل في الحالات والتعيينات
        </p>
      </div>

      <LeadsTable leads={leads} companies={companies} />
    </div>
  )
}
