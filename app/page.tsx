import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { VideosSection } from "@/components/videos-section"
import { ServicesSection } from "@/components/services-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <VideosSection />
        <ServicesSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  )
}
