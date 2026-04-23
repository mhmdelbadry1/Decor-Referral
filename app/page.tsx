import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Process from '@/components/Process'
import ConsultationForm from '@/components/ConsultationForm'
import PartnerRegistrationForm from '@/components/PartnerRegistrationForm'
import Footer from '@/components/Footer'
import { getFormConfig } from '@/lib/getFormConfig'

export default async function LandingPage() {
  const config = await getFormConfig()

  return (
    <>
      <Nav />

      <main id="main-content">
        <Hero />
        <About />
        <Process />
        <ConsultationForm
          cities={config.cities}
          services={config.services}
          budgets={config.budgets}
        />
        <PartnerRegistrationForm
          cities={config.cities}
          services={config.services}
        />
      </main>

      <Footer />
    </>
  )
}
