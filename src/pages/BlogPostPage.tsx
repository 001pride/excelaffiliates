import { Link, Navigate, useParams } from "react-router-dom";
import { Seo, SITE_URL } from "../components/Seo";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ResultVisual } from "../components/ResultVisual";
import { useCms } from "../context/CmsContext";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { testimonials, settings } = useCms();
  const post = slug ? testimonials.find((t) => t.slug === slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // post.images[0] may already be an absolute Supabase Storage URL (admin
  // upload) or a root-relative built-in path — only prefix it if it isn't
  // already absolute.
  const absoluteImage = post.images[0]
    ? post.images[0].startsWith("http")
      ? post.images[0]
      : `${SITE_URL}${post.images[0]}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: post.attributedTo },
    image: absoluteImage,
    description: post.excerpt,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const related = testimonials.filter((t) => t.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Seo
        title={`${post.title} — ${settings.brand}`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.images[0]}
        jsonLd={jsonLd}
      />
      <Nav />
      <main className="pt-36 pb-24 md:pt-44">
        <article className="mx-auto max-w-2xl px-6 md:px-10">
          <Link to="/blog" className="text-sm font-medium text-ink-soft hover:text-ink">
            ← All stories
          </Link>

          {post.resultTag && (
            <span className="mt-6 flex w-fit items-center rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink-deep">
              {post.resultTag}
            </span>
          )}

          <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight text-ink md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm font-medium text-ink-soft">
            {post.attributedTo} ·{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </p>

          {post.images.length > 0 ? (
            <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: post.images.length > 1 ? "1fr 1fr" : "1fr" }}>
              {post.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Result shared by ${post.attributedTo}, image ${i + 1}`}
                  className="w-full rounded-2xl border border-paper-line object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <ResultVisual tag={post.resultTag ?? post.title} />
            </div>
          )}

          <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-ink">{post.body}</p>

          <div className="mt-10 rounded-2xl border border-paper-line bg-paper-dim p-6 text-center">
            <p className="font-display text-xl text-ink">Curious if this could be you?</p>
            <Link
              to="/#qualifier"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-deep transition-transform hover:-translate-y-0.5 hover:bg-gold-deep"
            >
              Find your starting point
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-xl text-ink">More stories</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/blog/${r.slug}`}
                    className="rounded-xl border border-paper-line p-4 text-sm font-medium text-ink-soft transition-colors hover:border-gold hover:text-ink"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
