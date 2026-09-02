import { Link } from "@tanstack/react-router";
import { Menu, Search, X, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig, whatsappUrl } from "@/config/site";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  { to: "/category/$slug", params: { slug: "sarees" }, label: "Sarees" },
  { to: "/category/$slug", params: { slug: "suits" }, label: "Suits" },
  { to: "/category/$slug", params: { slug: "kurtas" }, label: "Kurtas" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Boutique" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-[#c59b4e]/30 bg-background/90 shadow-[0_12px_32px_rgba(25,18,12,0.06)] backdrop-blur-md"
          : "border-border/60 bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Open menu"
          className="-ml-2 p-2 text-foreground transition-colors hover:text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo & Tag */}
        <Link to="/" className="group flex flex-col items-start leading-none sm:items-center">
          <span className="font-display text-2xl font-normal tracking-[0.24em] uppercase text-primary transition-colors group-hover:text-primary/90 sm:text-3xl">
            Sanvika
          </span>
          <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.38em] uppercase text-[#c59b4e]">
            Collection • Bhopal
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-7 lg:gap-9 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                params={"params" in l ? l.params : undefined}
                className="group relative py-1 text-[0.7rem] font-medium tracking-[0.22em] uppercase text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] scale-x-0 bg-[#c59b4e] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Search products" className="text-foreground/80 hover:text-primary hover:bg-[#c59b4e]/10">
            <Link to="/shop">
              <Search className="h-4 w-4" />
            </Link>
          </Button>

          <a
            href={whatsappUrl(`Hi ${siteConfig.name}, I would like to inquire about your collection.`)}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-none border border-[#c59b4e]/50 bg-[#c59b4e]/10 px-3.5 py-2 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#c59b4e]" />
            <span>VIP Styling</span>
          </a>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="border-t border-[#c59b4e]/30 bg-background/98 backdrop-blur-lg md:hidden">
          <ul className="mx-auto max-w-7xl px-5 py-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={"params" in l ? l.params : undefined}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-border/60 py-3.5 text-xs tracking-[0.2em] uppercase text-foreground/85 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary font-semibold" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  <span>{l.label}</span>
                  <span className="text-xs text-[#c59b4e]">→</span>
                </Link>
              </li>
            ))}
            <li className="pt-4 pb-2">
              <a
                href={whatsappUrl(`Hi ${siteConfig.name}, I would like to inquire about your collection.`)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 text-center text-[0.7rem] font-medium tracking-[0.2em] uppercase text-primary-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Stylist on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

