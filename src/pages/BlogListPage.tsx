import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Seo, SITE_URL } from "../components/Seo";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ResultVisual } from "../components/ResultVisual";
import { useCms } from "../context/CmsContext";

export function BlogListPage() {
  const { testimonials, settings } = useCms();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Community results — ${settings.brand}`,
    url: `${SITE_URL}/blog`,
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo
        title={`Results & stories — ${settings.brand}`}
        description="Real progress and results shared by members of the S.I.G.C. community, in their own words."
        path="/blog"
        keywords={["online income results", "affiliate marketing results", "S.I.G.C. student stories", "digital marketing success stories"]}
        jsonLd={jsonLd}
      />
      <Nav />
      <main className="pt-36 pb-24 md:pt-44">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <h1 className="font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
            Stories from the community
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
            Progress shared directly by members of the community, in their own words.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/blog/${item.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-paper-line bg-paper-dim transition-colors hover:border-gold"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-ink/5">
                    {item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={`Result shared by ${item.attributedTo}: ${item.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ResultVisual tag={item.resultTag ?? item.title} seed={i} />
                    )}
                  </div>
                  <div className="p-6">
                    {item.resultTag && (
                      <span className="inline-flex items-center rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink-deep">
                        {item.resultTag}
                      </span>
                    )}
                    <h2 className="mt-3 font-display text-xl text-ink">{item.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.excerpt}</p>
                    <p className="mt-4 text-xs font-medium text-ink-soft/70">
                      {item.attributedTo} · {formatDate(item.date)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}
