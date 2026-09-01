import { createFileRoute, Link } from "@tanstack/react-router";

import storyImage from "@/assets/story.jpg";
import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About | ${siteConfig.name}` },
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
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 font-display text-5xl text-primary">Thoughtful pieces, beautifully worn.</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {siteConfig.name} brings together elevated silhouettes, rich textures and delicate
            detailing to create a wardrobe that feels special from the first wear to the last.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Our focus is on premium Indian ethnic wear that balances tradition with contemporary
            ease — from statement sarees and tailored suits to versatile kurtas meant for everyday
            elegance and meaningful celebrations.
          </p>
        </div>
        <img
          src={storyImage}
          alt="Sanvika Collection boutique story imagery"
          className="aspect-4/5 w-full object-cover"
        />
      </div>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        <div className="rounded-none border border-border bg-secondary/30 p-8">
          <p className="eyebrow">Philosophy</p>
          <h2 className="mt-4 font-display text-3xl text-primary">Curated with intention</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every collection is carefully selected to reflect comfort, quality and a polished sense
            of occasion-wear dressing.
          </p>
        </div>
        <div className="rounded-none border border-border bg-secondary/30 p-8">
          <p className="eyebrow">Craft</p>
          <h2 className="mt-4 font-display text-3xl text-primary">Inspired by artistry</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We celebrate the beauty of textile craftsmanship, hand-finished details and modern
            styling that feels refined without trying too hard.
          </p>
        </div>
        <div className="rounded-none border border-border bg-secondary/30 p-8">
          <p className="eyebrow">Wear</p>
          <h2 className="mt-4 font-display text-3xl text-primary">Made to last</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Thoughtful silhouettes and premium fabrics make our pieces easy to style for festive,
            formal and everyday moments alike.
          </p>
        </div>
      </section>

      <section className="mt-20 rounded-none border border-border bg-secondary/35 px-6 py-12 text-center sm:px-10">
        <p className="eyebrow">Browse the boutique</p>
        <h2 className="mt-3 font-display text-4xl text-primary">Discover your next favorite piece.</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="bg-primary px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
            Shop Collection
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-foreground/20 px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase"
          >
            Instagram
          </a>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd love to explore the collection.`)}
            target="_blank"
            rel="noreferrer"
            className="border border-foreground/20 px-7 py-4 text-[0.7rem] tracking-[0.2em] uppercase"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
