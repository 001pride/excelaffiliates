import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { Seo } from "../../components/Seo";
import { SITE } from "../../data/content";
import { LegalLayout } from "./LegalLayout";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo title={`Privacy Policy — ${SITE.brand}`} description="How we handle information on this site." path="/privacy" noindex />
      <Nav />
      <LegalLayout title="Privacy Policy">
        <p>
          This page explains, plainly, what happens with information when you use this website. It's written to
          be accurate about a small, independent website — not copied from a template for a larger business.
        </p>

        <h2>What this site collects</h2>
        <p>
          This site does not run its own server-side database and does not require you to create an account or
          submit a form that's stored on our servers. The "starting point" assessment runs entirely in your
          browser — your answers are used to show you a personalized result on the spot and are not transmitted
          to us or stored anywhere by this site itself.
        </p>
        <p>
          If you choose to continue to WhatsApp (either the community group or a direct conversation), that
          conversation happens on WhatsApp, under WhatsApp's own privacy terms — not ours. Anything you share
          there (your name, number, messages) is handled by WhatsApp and by us as the people you're messaging,
          the same as any other WhatsApp conversation.
        </p>

        <h2>Standard website data</h2>
        <p>
          Like virtually any website, the hosting provider may log basic technical information (such as IP
          address, browser type, and pages visited) for security and performance purposes. We don't use this to
          build a personal profile of visitors.
        </p>

        <h2>Cookies and tracking</h2>
        <p>
          This site does not currently use advertising trackers or third-party analytics cookies. If that
          changes, this page will be updated to reflect it.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site links to WhatsApp and may link to other third-party resources (such as the S.I.G.C. program).
          Those services have their own privacy practices, which we don't control — please check their policies
          directly.
        </p>

        <h2>Questions</h2>
        <p>
          If you have a question about how information is handled, reach out via the contact details on this
          site.
        </p>

        <p className="text-sm text-ink-soft/70">
          This policy describes current practice and isn't a substitute for formal legal advice. If {SITE.brand}
          starts collecting personal data directly (e.g. through a form or account system) in the future, this
          page will be updated accordingly and reviewed properly at that point.
        </p>
      </LegalLayout>
      <Footer />
    </div>
  );
}
