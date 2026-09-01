/**
 * SINGLE SOURCE OF TRUTH for all business contact details.
 * The owner can edit this one file to change WhatsApp / Instagram / address etc.
 */
export const siteConfig = {
  name: "Sanvika Collection",
  tagline: "Elegance in Every Thread",
  description:
    "Sanvika Collection — handpicked sarees, suits, kurtas and lehengas. Browse the catalog and order easily on WhatsApp or Instagram.",
  announcement: "New Collection Now Available — Order on WhatsApp",

  /** International format, digits only. Example: 919876543210 (91 = India) */
  whatsappNumber: "919755537777",
  /** Instagram username without the @ */
  instagramUsername: "sanvika_collection23",

  phoneDisplay: "+91 97555 37777",
  email: "hello@sanvikacollection.in",
  location: "Shop No. 12, Laxmi Market, Pune, Maharashtra 411001",
  hours: "Monday – Saturday · 10:00 AM – 8:00 PM",

  currency: "₹",
} as const;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const instagramUrl = `https://instagram.com/${siteConfig.instagramUsername}`;
