import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Instagram, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";

import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & Boutique Concierge | ${siteConfig.name}` },
      { name: "description", content: `Reach ${siteConfig.name} on WhatsApp, Instagram or by phone for orders and private styling.` },
      { property: "og:title", content: `Contact | ${siteConfig.name}` },
      { property: "og:description", content: siteConfig.description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-[#c59b4e]" />
          <p className="eyebrow">Client Concierge</p>
          <span className="h-px w-6 bg-[#c59b4e]" />
        </div>
        <h1 className="hairline-center mt-3 font-display text-4xl sm:text-5xl font-light text-foreground">
          We are here to assist your styling.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm font-light text-muted-foreground sm:text-base">
          Connect with our boutique team for catalog inquiries, custom orders, video call showcases, or boutique appointments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* WhatsApp Card */}
        <div className="group border border-[#c59b4e]/40 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b4e] hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center border border-[#c59b4e]/40 bg-[#c59b4e]/10 text-primary">
            <MessageCircle className="h-5 w-5 text-[#c59b4e]" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-normal text-foreground">WhatsApp Stylist</h2>
          <p className="mt-2 text-xs text-muted-foreground font-light">Instant answers, video previews & orders</p>
          <p className="mt-3 text-sm font-medium text-foreground">{siteConfig.phoneDisplay}</p>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I would like to inquire about your collection.`)}
            target="_blank"
            rel="noreferrer"
            className="luxury-button mt-6 w-full text-center"
          >
            Chat Now
          </a>
        </div>

        {/* Instagram Card */}
        <div className="group border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b4e]/60 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center border border-border bg-secondary/50 text-foreground">
            <Instagram className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-normal text-foreground">Instagram</h2>
          <p className="mt-2 text-xs text-muted-foreground font-light">Daily reels, lookbooks & new drops</p>
          <p className="mt-3 text-sm font-medium text-foreground">@{siteConfig.instagramUsername}</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="luxury-outline mt-6 w-full text-center"
          >
            DM on Instagram
          </a>
        </div>

        {/* Phone Card */}
        <div className="group border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b4e]/60 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center border border-border bg-secondary/50 text-foreground">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-normal text-foreground">Call Directly</h2>
          <p className="mt-2 text-xs text-muted-foreground font-light">Mon – Sat, 10 AM to 8 PM IST</p>
          <p className="mt-3 text-sm font-medium text-foreground">{siteConfig.phoneDisplay}</p>
          <a
            href={`tel:${siteConfig.phoneDisplay.replace(/\s+/g, "")}`}
            className="luxury-outline mt-6 w-full text-center"
          >
            Call Boutique
          </a>
        </div>

        {/* Timings & Visit */}
        <div className="group border border-border/80 bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b4e]/60 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center border border-border bg-secondary/50 text-foreground">
            <Clock3 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-normal text-foreground">Boutique Hours</h2>
          <p className="mt-2 text-xs text-muted-foreground font-light">Pune Showroom Hours</p>
          <p className="mt-3 text-xs font-light text-foreground leading-relaxed">{siteConfig.hours}</p>
          {siteConfig.location && (
            <a
              href="https://maps.google.com/?q=Shop+No.+12,+Laxmi+Market,+Pune,+Maharashtra+411001"
              target="_blank"
              rel="noreferrer"
              className="luxury-outline mt-6 w-full text-center"
            >
              Get Directions
            </a>
          )}
        </div>
      </div>

      {/* Address Showcase */}
      {siteConfig.location && (
        <div className="mt-14 border border-[#c59b4e]/40 bg-secondary/35 p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c59b4e]/40 bg-background text-primary">
                <MapPin className="h-5 w-5 text-[#c59b4e]" />
              </div>
              <div>
                <p className="eyebrow text-[0.62rem] text-[#c59b4e]">Flagship Location</p>
                <p className="mt-1 font-display text-xl sm:text-2xl text-foreground font-normal">
                  {siteConfig.location}
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Shop+No.+12,+Laxmi+Market,+Pune,+Maharashtra+411001"
              target="_blank"
              rel="noreferrer"
              className="luxury-button"
            >
              Open Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

