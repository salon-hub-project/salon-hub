import { Navbar } from "@/app/components/landing-page/Navbar";
import { HeroSection } from "@/app/components/landing-page/HeroSection";
import { TargetAudience } from "@/app/components/landing-page/TargetAudience";
import { PainPoints } from "@/app/components/landing-page/PainPoints";
import { Features } from "@/app/components/landing-page/Features";
import { WhyChoose } from "@/app/components/landing-page/WhyChoose";
import { Pricing } from "@/app/components/landing-page/Pricing";
import { CTA } from "@/app/components/landing-page/CTA";
import { Footer } from "@/app/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <TargetAudience />
        <PainPoints />
        <Features />
        <WhyChoose />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
