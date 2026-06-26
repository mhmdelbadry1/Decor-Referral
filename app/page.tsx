import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Process from '@/components/Process'
import Footer from '@/components/Footer'
import { getFormConfig } from '@/lib/getFormConfig'

export default async function LandingPage() {
  const config = await getFormConfig()

  return (
    <>
      <Nav />

      <main id="main-content">
        <Hero
          cities={config.cities}
          services={config.services}
          budgets={config.budgets}
        />
        <About />
        <Process />
      </main>

      <Footer />
    </>
  )
}
