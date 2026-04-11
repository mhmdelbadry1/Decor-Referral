import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Process from '@/components/Process'
import ConsultationForm from '@/components/ConsultationForm'
import PartnerRegistrationForm from '@/components/PartnerRegistrationForm'
import Footer from '@/components/Footer'
import WhatsAppFab from '@/components/WhatsAppFab'

/**
 * Landing Page — Customer-facing (B2C)
 *
 * Sections in order:
 *  1. Nav         — fixed header with logo + CTA
 *  2. Hero        — consultant intro + hero image
 *  3. Form        — 4-step consultation request
 *  4. Stats       — social proof numbers (accent band)
 *  5. Testimonials — 3 client quotes
 *  6. About       — consultant background + trust chips
 *  7. Footer      — links + copyright
 *  8. WhatsAppFab — fixed floating action button
 */
export default function LandingPage() {
  return (
    <>
      <Nav />

      <main id="main-content">
        <Hero />
        <About />
<Process />
        <ConsultationForm />
        <PartnerRegistrationForm />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  )
}
