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
} from "../components";

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
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
