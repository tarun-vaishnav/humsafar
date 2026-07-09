import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { Navigation } from '@components/nav'
import { HeroScene, HeroContent, Preloader, RoutesSection } from '@components/hero'

// Lazy-load below-fold sections for performance
const SearchJourneys = lazy(() => import('@components/search/SearchJourneys'))
const HowItWorks = lazy(() => import('@components/journey/HowItWorks'))
const InquiryFlow = lazy(() => import('@components/inquiry/InquiryFlow'))
const Footer = lazy(() => import('@components/layout/Footer'))


/**
 * Landing page. The 3D canvas is fixed behind all scrollable content.
 * Flow: Hero → Search → Results → Select journey → Inquiry form
 */
export default function HomePage() {
  const [sceneReady, setSceneReady] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState(null)

  const handleSceneReady = useCallback(() => setSceneReady(true), [])

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false)
    setRevealed(true)
  }, [])

  const handleJourneySelect = useCallback((journey) => {
    setSelectedJourney(journey)
  }, [])

  // Always scroll to top on mount/refresh
  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <>
      {/* Fixed 3D background */}
      <HeroScene onReady={handleSceneReady} revealed={revealed} />

      {/* Site navigation */}
      <Navigation />


      {/* Scrollable content */}
      <section className="relative min-h-screen">
        <HeroContent revealed={revealed} />
      </section>

      <RoutesSection />

      <Suspense fallback={null}>
        <SearchJourneys onJourneySelect={handleJourneySelect} />
      </Suspense>

      <Suspense fallback={null}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={null}>
        <InquiryFlow key={selectedJourney?.id || 'no-journey'} journey={selectedJourney} />
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Preloader overlay */}

      {showPreloader && (
        <Preloader ready={sceneReady} onComplete={handlePreloaderComplete} />
      )}
    </>
  )
}
