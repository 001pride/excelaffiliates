import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { Seo } from "../../components/Seo";
import { SITE, CURRENT_OFFER } from "../../data/content";
import { LegalLayout } from "./LegalLayout";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo title={`Terms of Use — ${SITE.brand}`} description="Terms for using this website." path="/terms" noindex />
      <Nav />
      <LegalLayout title="Terms of Use">
        <p>
          These terms cover your use of this website. They're about the website itself — not about {CURRENT_OFFER.name},
          which has its own separate terms set by its own program.
        </p>

        <h2>What this site is</h2>
        <p>
          This is an educational and informational website run by {SITE.brand}, an independent affiliate-marketing
          business. It's intended to help visitors understand digital and affiliate marketing, and to present the
          {" "}{CURRENT_OFFER.fullName} ({CURRENT_OFFER.name}) system, which {SITE.brand} is not the owner or official
          operator of.
        </p>

        <h2>No guaranteed outcomes</h2>
        <p>
          Nothing on this site is a promise or guarantee of income, sales, or any particular financial result.
          Affiliate marketing, like any business activity, depends on effort, skill, market conditions and
          circumstances that vary from person to person. Results mentioned on this site (including on the
          results/blog page) are real but individual, and are not representative of what any other person should
          expect.
        </p>

        <h2>Accuracy of information</h2>
        <p>
          We try to keep the information on this site accurate and current, including details about the
          {" "}{CURRENT_OFFER.name} system. However, since {SITE.brand} doesn't control {CURRENT_OFFER.name} itself, the
          complete and current details (pricing, inclusions, access terms) should always be confirmed directly
          with us or with the program before you make a purchasing decision.
        </p>

        <h2>Use of this site</h2>
        <p>
          You're welcome to browse, read, and share this site's content. Please don't copy the site's content
          wholesale for your own commercial use without permission, and don't use the site in a way that disrupts
          it for other visitors.
        </p>

        <h2>Changes</h2>
        <p>These terms may be updated from time to time as the site and offer evolve.</p>

        <h2>Contact</h2>
        <p>Questions about these terms can be sent through the contact details on this site.</p>
      </LegalLayout>
      <Footer />
    </div>
  );
}
