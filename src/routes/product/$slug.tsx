import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MessageCircle, Instagram, Sparkles, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { ProductGrid } from "@/components/site/ProductCard";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { effectivePrice, formatPrice, primaryImage, productWhatsappUrl, productInstagramMessage, productInstagramUrl, type Product } from "@/lib/catalog";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  head: ({ params, location }) => {
    const product = location.state?.product as Product | undefined;
    return {
      meta: [
        { title: `${product?.product_name ?? params.slug.replace(/-/g, " ")} | ${siteConfig.name}` },
        { name: "description", content: product?.description ?? siteConfig.description },
      ],
    };
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery(catalogQueryOptions());
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = useMemo(
    () => data?.products.find((item) => item.slug === slug) ?? null,
    [data, slug],
  );

  const relatedProducts = useMemo(() => {
    if (!data || !product) return [] as Product[];
    const sameCategory = data.products.filter(
      (item) => item.category_id === product.category_id && item.id !== product.id,
    );
    const available = sameCategory.filter((item) => item.available);
    const sorted = [...(available.length > 0 ? available : sameCategory)].filter(
      (item) => item.id !== product.id,
    );
    return sorted.slice(0, 4);
  }, [data, product]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-muted-foreground">
        <Sparkles className="mx-auto h-6 w-6 text-[#c59b4e] animate-pulse" />
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="eyebrow">Product Unavailable</p>
        <h1 className="mt-4 font-display text-4xl text-primary font-normal">We couldn't find this piece.</h1>
        <Link to="/shop" className="luxury-button mt-8">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ image_url: primaryImage(product), display_order: 0 }];
  const activeImage = images[selectedImageIndex] ?? images[0];
  const price = effectivePrice(product);
  const hasDiscount = !!product.discount_price && product.discount_price > 0 && product.discount_price < product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-primary font-medium">
          <ArrowLeft className="h-4 w-4 text-[#c59b4e]" /> Back to Collection
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden border border-[#c59b4e]/40 bg-card p-2 sm:p-3 shadow-[0_16px_40px_rgba(25,18,12,0.06)]">
            <div className="aspect-4/5 overflow-hidden bg-secondary/30">
              <img
                src={activeImage.image_url}
                alt={product.product_name}
                className="h-full w-full object-cover transition-all duration-700"
              />
            </div>

            {/* Badges */}
            <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-2">
              {!product.available && (
                <div className="border border-foreground bg-foreground/90 px-3 py-1.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase text-background">
                  Sold Out
                </div>
              )}
              {product.new_arrival && product.available && (
                <div className="border border-[#c59b4e]/40 bg-background/95 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#7a581e] backdrop-blur-sm shadow-xs">
                  ✨ New Season
                </div>
              )}
              {product.featured && (
                <div className="border border-primary/30 bg-primary/95 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-primary-foreground shadow-xs">
                  Featured Couture
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image.image_url}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden border p-1 transition-all ${
                    index === selectedImageIndex
                      ? "border-primary shadow-sm"
                      : "border-border/80 opacity-70 hover:opacity-100 hover:border-[#c59b4e]/60"
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.product_name} view ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Actions */}
        <div className="lg:col-span-5 lg:py-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-[#c59b4e]" />
            <p className="eyebrow text-[#c59b4e]">{product.category?.name ?? "Collection"}</p>
          </div>
          
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-light text-foreground leading-tight">
            {product.product_name}
          </h1>

          {/* Pricing */}
          <div className="mt-6 flex items-baseline gap-3 border-b border-border/80 pb-6">
            <span className="font-display text-3xl font-medium text-primary sm:text-4xl">
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground/75 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {hasDiscount && (
              <span className="border border-[#c59b4e]/50 bg-[#c59b4e]/10 px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-wider uppercase text-[#7a581e]">
                Special Price
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground">Overview & Fabric</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Specs Table */}
          <div className="mt-8 space-y-3 border-y border-border/80 py-6 text-xs text-foreground">
            <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[0.65rem]">Product SKU</span><span className="font-medium font-mono">{product.sku}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[0.65rem]">Fabric</span><span className="font-medium">{product.fabric ?? "Pure Handloom"}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[0.65rem]">Colour Tone</span><span className="font-medium">{product.color ?? "Bespoke"}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[0.65rem]">Available Sizing</span><span className="font-medium">{product.sizes?.length ? product.sizes.join(", ") : "Free Size / Unstitched Blouse"}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground uppercase tracking-wider text-[0.65rem]">Status</span><span className={`font-semibold tracking-wider uppercase text-[0.65rem] ${product.available ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}>{product.available ? "Ready to Order" : "Sold Out"}</span></div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3.5">
            {product.available ? (
              <a
                href={productWhatsappUrl(product)}
                target="_blank"
                rel="noreferrer"
                className="luxury-button w-full text-center"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Order on WhatsApp</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 border border-border bg-secondary/30 py-4 text-xs tracking-widest uppercase text-muted-foreground">
                Sold Out — Inquire for Restock
              </div>
            )}

            <a
              href={productInstagramUrl() + `?text=${encodeURIComponent(productInstagramMessage(product))}`}
              target="_blank"
              rel="noreferrer"
              className="luxury-outline w-full text-center"
            >
              <Instagram className="h-4 w-4" />
              <span>DM on Instagram</span>
            </a>
          </div>

          {/* Boutique Guarantee */}
          <div className="mt-8 flex items-center gap-3 border border-[#c59b4e]/30 bg-secondary/30 p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#c59b4e]" />
            <p className="text-[0.72rem] text-muted-foreground font-light leading-snug">
              Authentic handloom verification • Pan-India insured shipping • Video call assistance available
            </p>
          </div>
        </div>
      </div>

      {/* Related Pieces */}
      {relatedProducts.length > 0 && (
        <div className="mt-28 border-t border-border/80 pt-16">
          <div className="mb-10">
            <p className="eyebrow text-[#c59b4e]">Complete The Look</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-light text-foreground">
              Related Atelier Pieces
            </h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}

