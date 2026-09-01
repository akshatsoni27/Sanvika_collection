import { Instagram, MessageCircle } from "lucide-react";

import { siteConfig, whatsappUrl, instagramUrl } from "@/config/site";

/** Fixed, discreet WhatsApp + Instagram buttons, visible on every page. */
export function FloatingContact() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 sm:right-6 sm:bottom-6">
      <a
        href={whatsappUrl(`Hi ${siteConfig.name}, I'd like to know more about your collection.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
      >
        <MessageCircle className="h-[18px] w-[18px]" />
      </a>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Visit our Instagram"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
      >
        <Instagram className="h-[18px] w-[18px]" />
      </a>
    </div>
  );
}
