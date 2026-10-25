import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { ProblemSection } from "../sections/ProblemSection";
import { FrameworkSection } from "../sections/FrameworkSection";
import { OfferSection } from "../sections/OfferSection";
import { JourneySection } from "../sections/JourneySection";
import { AboutSection } from "../sections/AboutSection";
import { FaqSection } from "../sections/FaqSection";
import { ContactSection } from "../sections/ContactSection";
import { SocialProofSection } from "../sections/SocialProofSection";
import { Qualifier } from "../sections/Qualifier";
import { Seo, SITE_URL } from "../components/Seo";
import { CURRENT_OFFER } from "../data/content";
import { useCms } from "../context/CmsContext";

export function HomePage() {
  const { settings } = useCms();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.brand,
      url: SITE_URL,
      description:
        "Independent affiliate-marketing business providing education and presenting the S.I.G.C. training and community system.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.brand,
      url: SITE_URL,
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo
        title={`${settings.brand} — Build an Online Income System`}
        description={`${settings.brand} teaches digital and affiliate marketing, and presents the ${CURRENT_OFFER.fullName} (${CURRENT_OFFER.name}) training and community system.`}
        path="/"
        keywords={[
          "affiliate marketing for beginners",
          "digital marketing skills",
          "online income system",
          "S.I.G.C.",
          "Smart Income Circle",
          "Excelaffiliates",
        ]}
        jsonLd={jsonLd}
      />
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <FrameworkSection />
        <OfferSection />
        <JourneySection />
        <SocialProofSection />
        <Qualifier />
        <FaqSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
