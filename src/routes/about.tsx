import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MessageCircle, Instagram, HeartHandshake, Award, Clock } from "lucide-react";

import storyImage from "@/assets/story.jpg";
import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `Our Heritage & Story | ${siteConfig.name}` },
      { name: "description", content: "A boutique story shaped by thoughtful design, lasting craftsmanship and premium Indian ethnic wear." },
      { property: "og:title", content: `About | ${siteConfig.name}` },
      { property: "og:description", content: siteConfig.description },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Editorial Intro */}
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#c59b4e]" />
            <p className="eyebrow">Our Story & Heritage</p>
          </div>
          <h1 className="hairline mt-3 font-display text-4xl font-light text-foreground sm:text-5xl lg:text-6xl leading-tight">
            Thoughtful pieces, beautifully worn.
          </h1>
          <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">
            {siteConfig.name} brings together elevated silhouettes, rich handloom textures, and delicate artisanal detailing to create a wardrobe that feels extraordinarily special from the first wear to the last.
          </p>
          <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground">
            Our focus is on premium Indian ethnic wear that balances centuries of craft tradition with contemporary ease — from heirloom Banarasi silk sarees and tailored festive suits to versatile kurtas designed for modern celebrations.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="relative border border-[#c59b4e]/40 bg-card p-3 shadow-[0_16px_40px_rgba(30,20,12,0.08)]">
            <img
              src={storyImage}
              alt="Sanvika Collection boutique craft & fabrics"
              className="aspect-4/5 w-full object-cover"
            />
            <div className="absolute -bottom-4 -left-4 border border-[#c59b4e]/60 bg-background/95 p-4 backdrop-blur-md shadow-md">
              <p className="font-display text-lg text-primary">Handcrafted Excellence</p>
              <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#c59b4e]">Direct from Indian Weavers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <section className="mt-24">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#c59b4e]" />
            <p className="eyebrow">Boutique Values</p>
            <span className="h-px w-6 bg-[#c59b4e]" />
          </div>
          <h2 className="hairline-center mt-3 font-display text-3xl sm:text-4xl font-light">
            The Sanvika Standard
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-[#c59b4e]/30 bg-card p-8 shadow-xs transition-all duration-300 hover:border-[#c59b4e]/60 hover:shadow-md">
            <HeartHandshake className="h-6 w-6 text-[#c59b4e]" />
            <p className="eyebrow mt-4 text-[0.65rem]">Philosophy</p>
            <h3 className="mt-2 font-display text-2xl font-normal text-foreground">Curated with Intention</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              Every saree and suit is personally inspected for weave density, drape softness, and impeccable finish before it enters our boutique.
            </p>
          </div>

          <div className="border border-[#c59b4e]/30 bg-card p-8 shadow-xs transition-all duration-300 hover:border-[#c59b4e]/60 hover:shadow-md">
            <Award className="h-6 w-6 text-[#c59b4e]" />
            <p className="eyebrow mt-4 text-[0.65rem]">Craftsmanship</p>
            <h3 className="mt-2 font-display text-2xl font-normal text-foreground">Artisanal Roots</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              We champion traditional Indian hand-weaving, zardozi embroidery, and heritage block prints, supporting artisan communities across the country.
            </p>
          </div>

          <div className="border border-[#c59b4e]/30 bg-card p-8 shadow-xs transition-all duration-300 hover:border-[#c59b4e]/60 hover:shadow-md">
            <Clock className="h-6 w-6 text-[#c59b4e]" />
            <p className="eyebrow mt-4 text-[0.65rem]">Timelessness</p>
            <h3 className="mt-2 font-display text-2xl font-normal text-foreground">Made to Endure</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
              Our silhouettes avoid fleeting fast fashion trends in favor of enduring silhouettes that remain graceful across decades of family celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="mt-24 border border-[#c59b4e]/40 bg-secondary/40 p-10 text-center sm:p-14 shadow-xs">
        <Sparkles className="mx-auto h-5 w-5 text-[#c59b4e]" />
        <p className="eyebrow mt-2">Experience The Boutique</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-light text-foreground">
          Discover your next heirloom piece.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground font-light">
          Browse our online catalog or message our stylist directly for custom color matching and bridal queries.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="luxury-button">
            Shop Catalog
          </Link>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I would like to consult on an outfit.`)}
            target="_blank"
            rel="noreferrer"
            className="luxury-gold-outline"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#c59b4e]" />
            <span>WhatsApp Styling</span>
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-border px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase transition-colors hover:border-primary"
          >
            <Instagram className="h-3.5 w-3.5" />
            <span>Instagram</span>
          </a>
        </div>
      </section>
    </div>
  );
}

