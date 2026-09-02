import { Instagram, MessageCircle } from "lucide-react";

import { siteConfig, whatsappUrl, instagramUrl } from "@/config/site";

/** Fixed, discreet WhatsApp + Instagram buttons with luxury gold styling */
export function FloatingContact() {
  return (
    <div className="fixed right-4 bottom-5 z-50 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6">
      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to ask a question about your collection.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center border border-[#c59b4e]/60 bg-background/95 text-[#7a581e] shadow-[0_8px_20px_rgba(30,15,10,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:border-primary"
      >
        <span className="pointer-events-none absolute right-14 whitespace-nowrap border border-[#c59b4e]/40 bg-background/95 px-3 py-1.5 text-[0.65rem] font-medium tracking-wider uppercase text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
          WhatsApp Styling
        </span>
        <MessageCircle className="h-5 w-5 text-[#c59b4e] transition-colors group-hover:text-primary-foreground" />
      </a>

      {/* Instagram Floating Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Visit our Instagram"
        className="group relative flex h-11 w-11 items-center justify-center border border-border bg-background/90 text-foreground/80 shadow-[0_4px_14px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary"
      >
        <span className="pointer-events-none absolute right-14 whitespace-nowrap border border-border bg-background/95 px-3 py-1 text-[0.65rem] font-medium tracking-wider uppercase text-foreground opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
          Instagram Lookbook
        </span>
        <Instagram className="h-4 w-4" />
      </a>
    </div>
  );
}

