import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";

import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact | ${siteConfig.name}` },
      { name: "description", content: `Reach ${siteConfig.name} on WhatsApp, Instagram or by phone.` },
      { property: "og:title", content: `Contact | ${siteConfig.name}` },
      { property: "og:description", content: siteConfig.description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-3 font-display text-5xl text-primary">We’d love to assist.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-border bg-secondary/35 p-6">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-display text-3xl">WhatsApp</h2>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.phoneDisplay}</p>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I’d like to know more about your collection.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex bg-primary px-5 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="border border-border bg-secondary/35 p-6">
          <Instagram className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-display text-3xl">Instagram</h2>
          <p className="mt-3 text-sm text-muted-foreground">@{siteConfig.instagramUsername}</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex border border-foreground/20 px-5 py-3 text-[0.7rem] tracking-[0.2em] uppercase"
          >
            DM on Instagram
          </a>
        </div>

        <div className="border border-border bg-secondary/35 p-6">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-display text-3xl">Phone</h2>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.phoneDisplay}</p>
          <a
            href={`tel:${siteConfig.phoneDisplay.replace(/\s+/g, "")}`}
            className="mt-5 inline-flex border border-foreground/20 px-5 py-3 text-[0.7rem] tracking-[0.2em] uppercase"
          >
            Call Us
          </a>
        </div>

        <div className="border border-border bg-secondary/35 p-6">
          <Clock3 className="h-5 w-5 text-primary" />
          <h2 className="mt-4 font-display text-3xl">Hours</h2>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.hours}</p>
          {siteConfig.location && (
            <a
              href="https://maps.google.com/?q=Shop+No.+12,+Laxmi+Market,+Pune,+Maharashtra+411001"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex border border-foreground/20 px-5 py-3 text-[0.7rem] tracking-[0.2em] uppercase"
            >
              Get directions
            </a>
          )}
        </div>
      </div>

      {siteConfig.location && (
        <div className="mt-12 border border-border bg-secondary/30 p-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="eyebrow">Visit</p>
              <p className="mt-3 text-base text-muted-foreground">{siteConfig.location}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
