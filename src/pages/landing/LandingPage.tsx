// pages/landing/LandingPage.tsx
import {
  FeaturesByRole,
  FinalCta,
  Footer,
  Header,
  Hero,
  HowItWorks,
  MobileMoneyShowcase,
  PricingSection,
  ProblemStatement,
  SocialProof,
} from "@/features/landing";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <main className="pt-16">
        <Hero />
        <SocialProof />
        <ProblemStatement />
        <HowItWorks />
        <FeaturesByRole />
        <MobileMoneyShowcase />
        <PricingSection />
        {/* <UseCaseSection /> */}
        <FinalCta />
        {/* Hero, etc. viendront ici */}
      </main>
      <Footer />
    </div>
  );
}
