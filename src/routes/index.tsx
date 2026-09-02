import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, MessageCircle, Sparkles, ShieldCheck, Scissors, Plane, ArrowRight } from "lucide-react";

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
      { title: `${siteConfig.name} — Luxury Sarees, Suits & Ethnic Wear Online` },
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
      {/* Top Luxury Announcement Bar */}
      <div className="relative border-b border-[#c59b4e]/30 bg-primary py-2.5 text-center text-[0.66rem] font-medium tracking-[0.26em] uppercase text-primary-foreground shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
          <Sparkles className="h-3.5 w-3.5 text-[#c59b4e] animate-pulse" />
          <span>{siteConfig.announcement}</span>
          <span className="hidden sm:inline text-[#c59b4e]">•</span>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I would like to explore the latest festive collection.`)}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline underline underline-offset-4 hover:text-[#c59b4e] transition-colors"
          >
            Direct WhatsApp Inquiry
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Content Column */}
            <div className="order-2 lg:order-1 lg:col-span-5 lg:py-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-[#c59b4e]/50 bg-[#c59b4e]/10 px-3.5 py-1.5 text-[0.62rem] font-semibold tracking-[0.24em] uppercase text-[#735118] fade-up">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c59b4e]" />
                Festive & Bridal Edition 2026
              </div>

              {/* Main Headline */}
              <h1 className="fade-up mt-6 font-display text-5xl font-normal leading-[1.06] text-foreground sm:text-6xl lg:text-7xl">
                Elegance in
                <br />
                <span className="font-light italic text-primary">Every Thread</span>
              </h1>

              {/* Subheading */}
              <p className="fade-up mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base font-light">
                Discover authentic handloom Banarasi silks, delicate organzas, and regal bridal ensembles — handcrafted by master Indian artisans with timeless grace.
              </p>

              {/* Action Buttons */}
              <div className="fade-up mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="luxury-button group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={whatsappUrl(`Hi ${siteConfig.name}, I would like to consult with your personal stylist.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="luxury-gold-outline"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#c59b4e]" />
                  <span>VIP Styling</span>
                </a>
              </div>

              {/* Mini Features List */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/80 pt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-[#c59b4e]">✓</span>
                  <span>100% Pure Silk Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c59b4e]">✓</span>
                  <span>Pan-India & Global Express</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Showcase */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative group overflow-hidden border border-[#c59b4e]/30 bg-card p-2 sm:p-3 shadow-[0_20px_50px_rgba(40,24,12,0.12)]">
                <div className="relative aspect-4/5 sm:aspect-16/11 lg:aspect-4/5 overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Royal Indian couture model draped in crimson red and gold embroidered Banarasi silk saree"
                    width={1600}
                    height={1200}
                    className="h-full w-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Floating Luxury Tag */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto border border-background/40 bg-background/85 px-4 py-3 backdrop-blur-md shadow-lg">
                    <p className="eyebrow text-[0.58rem] text-[#c59b4e]">Featured Ensemble</p>
                    <p className="font-display text-base text-foreground font-normal sm:text-lg">
                      The Royal Banarasi Heritage Saree
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Luxury Trust Pillars */}
      <section className="border-y border-[#c59b4e]/25 bg-secondary/35 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c59b4e]/40 bg-background/80 text-[#7a581e] shadow-xs">
                <Sparkles className="h-5 w-5 text-[#c59b4e]" />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-foreground">Handloom Silks</h4>
                <p className="text-[0.72rem] text-muted-foreground font-light">Authentic weave & pure fabrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c59b4e]/40 bg-background/80 text-[#7a581e] shadow-xs">
                <Scissors className="h-5 w-5 text-[#c59b4e]" />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-foreground">Custom Tailoring</h4>
                <p className="text-[0.72rem] text-muted-foreground font-light">Bespoke sizing & styling</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c59b4e]/40 bg-background/80 text-[#7a581e] shadow-xs">
                <Plane className="h-5 w-5 text-[#c59b4e]" />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-foreground">Global Delivery</h4>
                <p className="text-[0.72rem] text-muted-foreground font-light">Fast & insured worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c59b4e]/40 bg-background/80 text-[#7a581e] shadow-xs">
                <ShieldCheck className="h-5 w-5 text-[#c59b4e]" />
              </div>
              <div>
                <h4 className="font-display text-base font-medium text-foreground">Direct Atelier Care</h4>
                <p className="text-[0.72rem] text-muted-foreground font-light">Curated with personal touch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Curated Edits"
          title="Explore The Collections"
          description="Handcrafted silhouettes designed for weddings, celebrations, and festive traditions."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
          {heroCategories.map((c) => {
            const sample = data.products.find((p) => p.category_id === c.id);
            return (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden border border-border/80 bg-card shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-[#c59b4e]/50 hover:shadow-lg"
              >
                <div className="aspect-4/5 overflow-hidden bg-secondary/30">
                  {sample ? (
                    <img
                      src={sample.images[0]?.image_url}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                      {c.name}
                    </div>
                  )}
                </div>
                {/* Frosted Label */}
                <div className="absolute inset-x-3 bottom-3 border border-background/40 bg-background/90 p-3.5 text-center backdrop-blur-md transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                  <span className="block text-xs font-semibold tracking-[0.22em] uppercase text-foreground transition-colors group-hover:text-primary-foreground">
                    {c.name}
                  </span>
                  <span className="mt-0.5 block text-[0.58rem] tracking-[0.16em] uppercase text-[#c59b4e] group-hover:text-[#f8d89e]">
                    View Catalog →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeading
            centered={false}
            eyebrow="Just In"
            title="New Season Arrivals"
            description="Fresh off the loom — unique patterns, handwoven borders, and seasonal shades."
            action={
              <Link
                to="/shop"
                search={{ sort: "newest" }}
                className="group inline-flex items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.22em] uppercase text-primary underline-offset-4 hover:underline"
              >
                <span>View All Pieces</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          <div className="mt-10">
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* Featured Collection Highlight */}
      {featured.length > 0 && (
        <section className="border-y border-[#c59b4e]/25 bg-secondary/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Handpicked Curations"
              title="The Signature Collection"
              description="Masterpiece sarees and luxury ensembles woven, printed, and embroidered by artisanal hands."
            />
            <div className="mt-12">
              <ProductGrid products={featured} />
            </div>
          </div>
        </section>
      )}

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="relative border border-[#c59b4e]/40 p-3 bg-card shadow-[0_16px_40px_rgba(30,20,12,0.06)]">
              <img
                src={storyImage}
                alt="Silk fabrics being meticulously examined at Sanvika Collection"
                loading="lazy"
                width={1200}
                height={1400}
                className="aspect-4/5 w-full object-cover"
              />
              <div className="absolute -bottom-5 -right-5 hidden sm:block border border-[#c59b4e] bg-primary p-5 text-primary-foreground shadow-xl">
                <p className="font-display text-2xl">Bespoke Craft</p>
                <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[#f8d89e]">Since Inception</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#c59b4e]" />
              <p className="eyebrow">Our Ethos</p>
            </div>
            <h2 className="hairline mt-3 font-display text-4xl font-light text-foreground sm:text-5xl leading-tight">
              A boutique rooted in authentic textile craftsmanship
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base font-light">
              {siteConfig.name} was born out of deep admiration for India's rich handloom heritage. Every piece in our curation is chosen for the honesty of its weave, the luxury of its fall, and the timeless confidence it brings to the wearer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base font-light">
              We partner directly with family ateliers and weavers in Varanasi, Chanderi, and Jaipur — ensuring small-batch quality, ethical production, and heirlooms meant to be treasured for generations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="luxury-button"
              >
                Read Our Story
              </Link>
              <Link
                to="/shop"
                className="luxury-gold-outline"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VIP WhatsApp Concierge CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-[#c59b4e]/50 bg-gradient-to-br from-[#2a080e] via-primary to-[#1f050a] px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20 shadow-2xl">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#c59b4e]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#c59b4e]/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-[#c59b4e]/50 bg-[#c59b4e]/15 px-4 py-1.5 text-[0.62rem] font-semibold tracking-[0.24em] uppercase text-[#f8d89e]">
              <Sparkles className="h-3 w-3 text-[#f8d89e]" />
              Personal Styling Concierge
            </div>
            
            <h2 className="mt-5 font-display text-4xl font-normal sm:text-5xl text-white">
              Looking for a specific shade, fabric or bridal outfit?
            </h2>
            
            <p className="mt-4 text-sm leading-relaxed text-[#f4efe7]/80 sm:text-base font-light">
              Share your occasion, color palette, or budget, and our boutique stylist will send you exclusive video previews and handpicked options directly on WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappUrl(
                  `Hi ${siteConfig.name}, I am looking for something special for an upcoming occasion. Could you help me choose?`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#c59b4e] px-9 py-4 text-[0.72rem] font-semibold tracking-[0.22em] uppercase text-[#241306] shadow-lg transition-all hover:bg-[#d8b066] hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 text-[#241306]" />
                Chat with Stylist on WhatsApp
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-[0.72rem] font-medium tracking-[0.22em] uppercase text-white transition-all hover:border-white hover:bg-white/10"
              >
                <Instagram className="h-4 w-4" />
                Explore Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

