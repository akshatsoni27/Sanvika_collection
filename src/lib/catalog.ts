import { siteConfig, whatsappUrl, instagramUrl } from "@/config/site";

export type Category = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
};

export type ProductImage = {
  id?: string;
  image_url: string;
  display_order: number;
};

export type Product = {
  id: string;
  product_name: string;
  slug: string;
  sku: string;
  category_id: string | null;
  price: number;
  discount_price: number | null;
  description: string | null;
  fabric: string | null;
  color: string | null;
  sizes: string[];
  available: boolean;
  featured: boolean;
  new_arrival: boolean;
  created_at: string;
  images: ProductImage[];
  category: { name: string; slug: string } | null;
};

export const formatPrice = (value: number) =>
  `${siteConfig.currency}${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const effectivePrice = (p: Pick<Product, "price" | "discount_price">) =>
  p.discount_price && p.discount_price > 0 ? p.discount_price : p.price;

export const primaryImage = (p: Product) =>
  p.images?.[0]?.image_url ?? "/images/demo/placeholder.jpg";

/** Pre-filled WhatsApp enquiry for a specific product. */
export const productWhatsappUrl = (p: Product) =>
  whatsappUrl(
    `Hi ${siteConfig.name}, I'm interested in this product:\n\n` +
      `Product: ${p.product_name}\n` +
      `Product ID: ${p.sku}\n` +
      `Price: ${formatPrice(effectivePrice(p))}\n\n` +
      `Is this product available?`,
  );

export const productInstagramMessage = (p: Product) =>
  `Hi, I'm interested in ${p.product_name}, Product ID ${p.sku}.`;

export const productInstagramUrl = () => instagramUrl;

export const productSearchMatch = (p: Product, term: string) => {
  const q = term.trim().toLowerCase();
  if (!q) return true;
  return [p.product_name, p.sku, p.fabric, p.color, p.category?.name, p.description]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
};

export const PRICE_BANDS = [
  { id: "all", label: "All prices", min: 0, max: Infinity },
  { id: "u1000", label: "Under ₹1,000", min: 0, max: 1000 },
  { id: "1to2", label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { id: "2to5", label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { id: "5plus", label: "₹5,000 & above", min: 5000, max: Infinity },
] as const;

export type SortKey = "newest" | "price-asc" | "price-desc" | "featured";

export const sortProducts = (items: Product[], sort: SortKey) => {
  const list = [...items];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "featured":
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
    default:
      return list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
};

/** Build a URL-safe slug, e.g. "Banarasi Silk Saree" + "SC-102". */
export const buildSlug = (name: string, sku: string) =>
  `${name} ${sku}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
