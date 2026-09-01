import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle } from "lucide-react";

import heroImage from "@/assets/hero.jpg";
import storyImage from "@/assets/story.jpg";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig, whatsappUrl, instagramUrl } from "@/config/site";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  head: () => ({
    meta: [
      { title: `${siteConfig.name} — Sarees, Suits & Kurtas Online Catalog` },
      { name: "description", content: siteConfig.description },
      { property: "og:title", content: `${siteConfig.name} — ${siteConfig.tagline}` },
      { property: "og:description", content: siteConfig.description },
    ],
  }),
  component: Home,
  errorComponent: ({ error }) => (
    <p role="alert" className="p-16 text-center text-sm text-muted-foreground">
      {error.message}
    </p>
  ),
  notFoundComponent: () => <p className="p-16 text-center">Nothing here yet.</p>,
});

function Home() {
  const { data } = useSuspenseQuery(catalogQueryOptions());
  const newArrivals = data.products.filter((p) => p.new_arrival).slice(0, 4);
  const featured = data.products.filter((p) => p.featured).slice(0, 4);
  const heroCategories = data.categories.slice(0, 4);

  return (
    <>
      <div className="bg-primary py-2.5 text-center text-[0.68rem] tracking-[0.25em] uppercase text-primary-foreground">
        ✨ {siteConfig.announcement}
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="grid items-center gap-0 lg:grid-cols-2">
          <div className="order-2 px-6 py-14 sm:px-10 lg:order-1 lg:px-16 lg:py-24">
            <p className="eyebrow fade-up">Handpicked Indian Ethnic Wear</p>
            <h1 className="fade-up mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Elegance in
              <br />
              Every Thread
            </h1>
            <p className="fade-up mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Discover timeless Indian fashion, thoughtfully curated for every occasion.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="bg-primary px-8 py-4 text-[0.7rem] tracking-[0.22em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop"
                search={{ sort: "newest" }}
                className="border border-foreground/20 px-8 py-4 text-[0.7rem] tracking-[0.22em] uppercase transition-colors hover:border-primary hover:text-primary"
              >
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src={heroImage}
              alt="Model wearing a maroon Banarasi silk saree from Sanvika Collection"
              width={1600}
              height={1104}
              className="h-[42vh] w-full object-cover sm:h-[56vh] lg:h-[86vh]"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Shop by" title="Featured Categories" />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {heroCategories.map((c) => {
            const sample = data.products.find((p) => p.category_id === c.id);
            return (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden bg-secondary"
              >
                <div className="aspect-4/5">
                  {sample && (
                    <img
                      src={sample.images[0]?.image_url}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/70 to-transparent p-4 text-center text-xs tracking-[0.24em] uppercase text-background">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeading
            centered={false}
            eyebrow="Just In"
            title="New Arrivals"
            action={
              <Link
                to="/shop"
                className="text-[0.7rem] tracking-[0.2em] uppercase text-primary underline-offset-4 hover:underline"
              >
                View all
              </Link>
            }
          />
          <div className="mt-10">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-secondary/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Curated"
              title="Featured Collection"
              description="Pieces we love this season — woven, printed and embroidered by hand."
            />
            <div className="mt-10">
              <ProductGrid products={featured} />
            </div>
          </div>
        </section>
      )}

      {/* Brand story */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <img
          src={storyImage}
          alt="Silk fabrics being arranged at the Sanvika Collection boutique"
          loading="lazy"
          width={1200}
          height={1400}
          className="aspect-4/5 w-full object-cover"
        />
        <div>
          <p className="eyebrow">Our Story</p>
          <h2 className="hairline mt-4 font-display text-4xl">
            A boutique built on craft and care
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.name} began with a simple belief — that everyday Indian wear deserves the
            same attention as occasion wear. Every saree, suit and kurta in our catalog is chosen
            personally, for the fall of its fabric, the honesty of its weave and the way it makes
            you feel when you wear it.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We work directly with weavers and small ateliers across India, keeping our collection
            small, seasonal and genuinely special.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-block border border-foreground/20 px-8 py-4 text-[0.7rem] tracking-[0.22em] uppercase transition-colors hover:border-primary hover:text-primary"
          >
            More About Us
          </Link>
        </div>
      </section>

      {/* Instagram */}
      <section className="border-y border-border bg-secondary/40 py-16 text-center">
        <p className="eyebrow">@{siteConfig.instagramUsername}</p>
        <h2 className="mt-3 font-display text-3xl">Follow {siteConfig.name}</h2>
        <p className="mx-auto mt-3 max-w-md px-4 text-sm text-muted-foreground">
          New pieces, styling ideas and behind-the-scenes from the boutique.
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 bg-foreground px-8 py-4 text-[0.7rem] tracking-[0.22em] uppercase text-background transition-opacity hover:opacity-90"
        >
          <Instagram className="h-4 w-4" /> Follow on Instagram
        </a>
      </section>

      {/* WhatsApp CTA */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="eyebrow">Personal Shopping</p>
        <h2 className="mt-3 font-display text-4xl">Looking for something special?</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Tell us the occasion, colour or budget you have in mind and we'll send you handpicked
          options on WhatsApp.
        </p>
        <a
          href={whatsappUrl(
            `Hi ${siteConfig.name}, I'm looking for something special. Can you help me choose?`,
          )}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-primary px-9 py-4 text-[0.7rem] tracking-[0.22em] uppercase text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
        </a>
      </section>
    </>
  );
}
