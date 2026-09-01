import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/category/$slug", params: { slug: "sarees" }, label: "Sarees" },
  { to: "/category/$slug", params: { slug: "suits" }, label: "Suits" },
  { to: "/category/$slug", params: { slug: "kurtas" }, label: "Kurtas" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
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
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/90 shadow-[0_16px_32px_rgba(19,13,10,0.06)] backdrop-blur-md"
          : "border-transparent bg-background/70 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open menu"
          className="-ml-2 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-wide text-primary">
            Sanvika Collection
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                params={"params" in l ? l.params : undefined}
                className="text-[0.72rem] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Button asChild variant="ghost" size="icon" aria-label="Search products" className="ml-auto md:ml-0">
          <Link to="/shop">
            <Search className="h-4 w-4" />
          </Link>
        </Button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 md:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  params={"params" in l ? l.params : undefined}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/70 py-3 text-sm tracking-[0.16em] uppercase text-muted-foreground"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
