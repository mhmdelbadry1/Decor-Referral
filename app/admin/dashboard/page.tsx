import { cookies }          from 'next/headers'
import { redirect }         from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { ADMIN_COOKIE }     from '@/lib/auth'

import KpiGrid,            { KpiData }                from './components/KpiGrid'
import StatusDistribution, { StatusDistributionData } from './components/StatusDistribution'
import TrustLeaderboard,   { CompanyLeaderboardRow }  from './components/TrustLeaderboard'
import RecentLeads,        { RecentLeadRow }           from './components/RecentLeads'
import LogoutButton                                    from './components/LogoutButton'
import AddCompanyPanel                                 from './components/AddCompanyPanel'
import SettingsPanel                                   from './components/SettingsPanel'
import { getFormConfig }                               from '@/lib/getFormConfig'

export const dynamic = 'force-dynamic'

/* ── Helpers ──────────────────────────────────────────────── */
function maskName(name: string): string {
  const first = name.trim().split(' ')[0]
  return `${first} ***`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ar-SA', {
    year : 'numeric',
    month: 'short',
    day  : 'numeric',
  })
}

/* ── Logout action ─────────────────────────────────────────── */
async function logout() {
  'use server'
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

/* ── Types ─────────────────────────────────────────────────── */
type LeadRow = {
  id                : string
  customer_name     : string
  city              : string
  services          : string[] | null
  budget            : string | null
  status            : string
  company_id        : string | null
  claimed_at        : string | null
  contact_verified_at: string | null
  created_at        : string
}

type CompanyRow = {
  id  : string
  name: string
}

type BroadcastRow = {
  lead_id   : string
  company_id: string
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  /* 4 parallel queries */
  const [leadsResult, companiesResult, broadcastsResult, formConfig] = await Promise.all([
    supabase
      .from('leads')
      .select('id, customer_name, city, services, budget, status, company_id, claimed_at, contact_verified_at, created_at')
      .order('created_at', { ascending: false }),

    supabase
      .from('companies')
      .select('id, name'),

    supabase
      .from('lead_broadcasts')
      .select('lead_id, company_id'),

    getFormConfig(),
  ])

  const leads      = (leadsResult.data     ?? []) as LeadRow[]
  const companies  = (companiesResult.data ?? []) as CompanyRow[]
  const broadcasts = (broadcastsResult.data ?? []) as BroadcastRow[]

  /* ── KPI Aggregations ─────────────────────────────────── */
  const totalLeads       = leads.length
  const closedDeals      = leads.filter(l => l.status === 'تمت البيعة').length
  const pendingLeads     = leads.filter(l => l.status === 'معلق').length
  const activeLeads      = leads.filter(l => l.status === 'تم التواصل' || l.status === 'تمت الزيارة').length
  const nonPendingLeads  = leads.filter(l => l.status !== 'معلق').length
  const conversionRate   = nonPendingLeads > 0 ? Math.round((closedDeals / nonPendingLeads) * 100) : 0
  const claimedLeads     = leads.filter(l => l.company_id !== null)
  const verifiedLeads    = leads.filter(l => l.contact_verified_at !== null)
  const verificationRate = claimedLeads.length > 0
    ? Math.round((verifiedLeads.length / claimedLeads.length) * 100) : 0

  const kpiData: KpiData = {
    totalLeads,
    closedDeals,
    conversionRate,
    activeLeads,
    verificationRate,
    pendingLeads,
  }

  /* ── Status Distribution ─────────────────────────────── */
  const statusDistribution: StatusDistributionData[] = [
    { label: 'معلق',           count: pendingLeads,                                                    color: 'var(--color-ink-faint)' },
    { label: 'تم التواصل',     count: leads.filter(l => l.status === 'تم التواصل').length,             color: 'var(--color-secondary)' },
    { label: 'تمت الزيارة',    count: leads.filter(l => l.status === 'تمت الزيارة').length,            color: 'oklch(75% 0.14 70)' },
    { label: 'تمت البيعة',     count: closedDeals,                                                     color: 'var(--color-success)' },
    { label: 'لم يتم الاتفاق', count: leads.filter(l => l.status === 'لم يتم الاتفاق').length,        color: 'oklch(65% 0.18 25)' },
  ].filter(s => s.count > 0)

  /* ── Company Leaderboard ─────────────────────────────── */
  const broadcastCountByCompany = new Map<string, number>()
  for (const b of broadcasts) {
    broadcastCountByCompany.set(b.company_id, (broadcastCountByCompany.get(b.company_id) ?? 0) + 1)
  }

  const leaderboard: CompanyLeaderboardRow[] = companies
    .map(company => {
      const claimedByThis = leads.filter(l => l.company_id === company.id)
      const verified      = claimedByThis.filter(l => l.contact_verified_at !== null)
      const closed        = claimedByThis.filter(l => l.status === 'تمت البيعة')
      const received      = broadcastCountByCompany.get(company.id) ?? 0
      const trustScore    = claimedByThis.length > 0
        ? Math.round((verified.length / claimedByThis.length) * 100) : 0

      return {
        name      : company.name,
        received,
        claimed   : claimedByThis.length,
        verified  : verified.length,
        closed    : closed.length,
        trustScore,
      }
    })
    .sort((a, b) => b.trustScore - a.trustScore)

  /* ── Recent Leads (last 20) ──────────────────────────── */
  const companyNameById = new Map(companies.map(c => [c.id, c.name]))

  const recentLeads: RecentLeadRow[] = leads.slice(0, 20).map(lead => ({
    id         : lead.id,
    date       : formatDate(lead.created_at),
    maskedName : maskName(lead.customer_name),
    city       : lead.city,
    services   : (lead.services ?? []).join('، ') || '—',
    budget     : lead.budget ?? '—',
    status     : lead.status,
    companyName: lead.company_id ? (companyNameById.get(lead.company_id) ?? '—') : '—',
  }))

  /* ── Last-updated timestamp ──────────────────────────── */
  const updatedAt = new Date().toLocaleString('ar-SA', {
    hour  : '2-digit',
    minute: '2-digit',
    day   : 'numeric',
    month : 'short',
  })

  return (
    <div
      className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--color-ink)' }}
          >
            لوحة التحكم
          </h1>
          <p
            className="font-body mt-1"
            style={{ fontSize: '0.82rem', color: 'var(--color-ink-faint)' }}
          >
            آخر تحديث: {updatedAt}
          </p>
        </div>

        <LogoutButton logoutAction={logout} />
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <SettingsPanel
          cities={formConfig.cities}
          services={formConfig.services}
          budgets={formConfig.budgets}
        />

        <AddCompanyPanel
          cities={formConfig.cities}
          services={formConfig.services}
        />

        <KpiGrid data={kpiData} />

        {statusDistribution.length > 0 && (
          <StatusDistribution data={statusDistribution} total={totalLeads} />
        )}

        <TrustLeaderboard rows={leaderboard} />

        <RecentLeads rows={recentLeads} />
      </div>
    </div>
  )
}
