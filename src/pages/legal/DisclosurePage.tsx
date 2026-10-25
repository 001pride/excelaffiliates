import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { Seo } from "../../components/Seo";
import { SITE, CURRENT_OFFER } from "../../data/content";
import { LegalLayout } from "./LegalLayout";

export function DisclosurePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo
        title={`Affiliate Disclosure — ${SITE.brand}`}
        description="Our relationship to the programs we recommend."
        path="/disclosure"
        noindex
      />
      <Nav />
      <LegalLayout title="Affiliate Disclosure">
        <p>
          {SITE.brand} is an independent affiliate-marketing business. We may earn a commission when you purchase
          a product or program through our affiliate links — including {CURRENT_OFFER.name} ({CURRENT_OFFER.fullName}) —
          at no additional cost to you.
        </p>

        <h2>Our relationship to {CURRENT_OFFER.name}</h2>
        <p>
          We are affiliates and members of the {CURRENT_OFFER.name} community — not its owner, creator, or official
          representative. We present {CURRENT_OFFER.name} because we use it ourselves and believe in it, and because
          we earn a commission when someone we refer decides to join. That commission does not change the price
          you pay.
        </p>

        <h2>Why we disclose this</h2>
        <p>
          We think you should know this before taking our recommendation seriously — an honest recommendation is
          worth more than a sale, and we'd rather you trust what we say because it's true, not because you didn't
          know we had a stake in it.
        </p>

        <h2>No guaranteed outcomes</h2>
        <p>
          This disclosure doesn't change what's said elsewhere on the site: nothing here is a guarantee of income
          or results, for {CURRENT_OFFER.name} or anything else.
        </p>

        <h2>Questions</h2>
        <p>If you'd like more detail about this relationship, ask us directly — see the contact details on this site.</p>
      </LegalLayout>
      <Footer />
    </div>
  );
}
