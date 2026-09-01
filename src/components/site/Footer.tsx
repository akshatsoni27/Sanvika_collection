import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";

import { siteConfig, instagramUrl, whatsappUrl } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[#f4efe7]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <p className="font-display text-3xl tracking-[0.22em] uppercase text-primary">Sanvika</p>
            <p className="eyebrow mt-2">Collection</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-foreground">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "sarees" }} className="hover:text-primary">Sarees</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "suits" }} className="hover:text-primary">Suits</Link></li>
              <li><Link to="/category/$slug" params={{ slug: "kurtas" }} className="hover:text-primary">Kurtas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-foreground">Company</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a></li>
              <li><a href={whatsappUrl(`Hi ${siteConfig.name}, I would like to know more about your collection.`)} target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-foreground">Visit</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{siteConfig.location}</li>
              <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{siteConfig.phoneDisplay}</li>
              <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{siteConfig.hours}</li>
              <li className="flex gap-2"><Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-primary">@{siteConfig.instagramUsername}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/80 pt-5 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
