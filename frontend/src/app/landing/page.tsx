import Hero from "@/components/landing/hero";
import Navbar from "@/components/landing/navbar";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Stats from "@/components/landing/stats";
import Testimonials from "@/components/landing/testimonials";
import Footer from "@/components/landing/footer";
import { SkyParticles } from "@/components/landing/sky-particles";

export default function Landing() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      <div className="h-full w-full fixed inset-0 z-0">
        <SkyParticles
          id="skyparticles"
          background="transparent"
          minSize={0.8}
          maxSize={2.0}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#A855F7"
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}
