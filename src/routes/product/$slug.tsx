import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Instagram } from "lucide-react";
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
    return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted-foreground">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="eyebrow">Product unavailable</p>
        <h1 className="mt-4 font-display text-4xl">We couldn't find this product.</h1>
        <Link to="/shop" className="mt-8 inline-flex bg-primary px-7 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
          Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ image_url: primaryImage(product), display_order: 0 }];
  const activeImage = images[selectedImageIndex] ?? images[0];
  const price = effectivePrice(product);
  const hasDiscount = !!product.discount_price && product.discount_price > 0 && product.discount_price < product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative overflow-hidden border border-border bg-secondary/20">
            <img
              src={activeImage.image_url}
              alt={product.product_name}
              className="h-[32.5rem] w-full object-cover"
            />
            {!product.available && (
              <div className="absolute left-4 top-4 bg-foreground px-3 py-2 text-[0.7rem] tracking-[0.2em] uppercase text-background">
                Sold Out
              </div>
            )}
            {product.new_arrival && product.available && (
              <div className="absolute left-4 top-4 bg-gold px-3 py-2 text-[0.7rem] tracking-[0.2em] uppercase text-gold-foreground">
                New Arrival
              </div>
            )}
            {product.featured && (
              <div className="absolute right-4 top-4 bg-primary px-3 py-2 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
                Featured
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`overflow-hidden border ${index === selectedImageIndex ? "border-primary" : "border-border"}`}
              >
                <img
                  src={image.image_url}
                  alt={`${product.product_name} view ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{product.category?.name ?? "Collection"}</p>
          <h1 className="mt-3 font-display text-5xl text-primary">{product.product_name}</h1>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-3xl font-medium text-primary">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 space-y-3 text-sm">
            <div className="flex gap-3"><span className="w-28 text-muted-foreground">Product ID</span><span className="font-medium">{product.sku}</span></div>
            <div className="flex gap-3"><span className="w-28 text-muted-foreground">Fabric</span><span>{product.fabric ?? "—"}</span></div>
            <div className="flex gap-3"><span className="w-28 text-muted-foreground">Color</span><span>{product.color ?? "—"}</span></div>
            <div className="flex gap-3"><span className="w-28 text-muted-foreground">Sizes</span><span>{product.sizes?.length ? product.sizes.join(", ") : "—"}</span></div>
            <div className="flex gap-3"><span className="w-28 text-muted-foreground">Availability</span><span>{product.available ? "Available" : "Sold Out"}</span></div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {product.available ? (
              <a
                href={productWhatsappUrl(product)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-primary px-6 py-4 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground"
              >
                <MessageCircle className="h-4 w-4" /> Order on WhatsApp
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 border border-border bg-secondary/20 px-6 py-4 text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">
                Sold Out — unavailable for order
              </div>
            )}

            <a
              href={productInstagramUrl() + `?text=${encodeURIComponent(productInstagramMessage(product))}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-4 text-[0.7rem] tracking-[0.2em] uppercase"
            >
              <Instagram className="h-4 w-4" /> DM on Instagram
            </a>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2 className="mt-2 font-display text-4xl text-primary">Related pieces</h2>
            </div>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
