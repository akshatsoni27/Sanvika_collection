import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Clock, MessageCircle, Sparkles } from "lucide-react";

import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-[#c59b4e]/30 bg-[#f7f2ea] text-foreground">
      {/* Top Footer Newsletter / Concierge Bar */}
      <div className="border-b border-[#c59b4e]/20 bg-[#efe7db] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <Sparkles className="h-4 w-4 text-[#c59b4e]" />
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/90 font-medium">
              Sanvika Boutique Personal Styling & Bridal Consultations
            </p>
          </div>
          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to book a private consultation or styling appointment.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#c59b4e] bg-[#c59b4e]/10 px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-5">
          {/* Brand Info */}
          <div className="xl:col-span-2">
            <Link to="/" className="group inline-block">
              <span className="font-display text-4xl font-normal tracking-[0.24em] uppercase text-primary">
                Sanvika
              </span>
              <span className="block mt-1 text-[0.6rem] font-semibold tracking-[0.4em] uppercase text-[#c59b4e]">
                Collection • Haute Couture
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center border border-[#c59b4e]/40 bg-background text-[#7a581e] transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={whatsappUrl(`Hi ${siteConfig.name}, I'm reaching out from your website.`)}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center border border-[#c59b4e]/40 bg-background text-[#7a581e] transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.24em] uppercase text-[#c59b4e]">
              Collections
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80 font-light">
              <li><Link to="/shop" className="transition-colors hover:text-primary">Shop All Catalog</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "sarees" }} className="transition-colors hover:text-primary">Banarasi & Silk Sarees</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "suits" }} className="transition-colors hover:text-primary">Designer Suits</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "kurtas" }} className="transition-colors hover:text-primary">Handcrafted Kurtas</Link></li>
              <li><Link to="/shop" search={{ sort: "newest" }} className="transition-colors hover:text-primary">New Season Arrivals</Link></li>
            </ul>
          </div>

          {/* Maison */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.24em] uppercase text-[#c59b4e]">
              The Boutique
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-foreground/80 font-light">
              <li><Link to="/about" className="transition-colors hover:text-primary">Our Story & Heritage</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-primary">Contact & Directions</Link></li>
              <li><a href={instagramUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">Instagram Lookbook</a></li>
              <li><a href={whatsappUrl(`Hi ${siteConfig.name}, I would like to inquire about custom orders.`)} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">Custom Orders</a></li>
            </ul>
          </div>

          {/* Boutique Visit */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.24em] uppercase text-[#c59b4e]">
              Visit & Inquiries
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-foreground/80 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span className="leading-snug">{siteConfig.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#c59b4e]/30 pt-6 text-center text-xs tracking-[0.22em] uppercase text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Handcrafted with precision.</p>
          <p className="text-[0.65rem] text-[#c59b4e]">Authentic Handlooms • Pan-India</p>
        </div>
      </div>
    </footer>
  );
}

