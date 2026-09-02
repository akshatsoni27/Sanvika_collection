import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowUpRight } from "lucide-react";

import {
  formatPrice,
  primaryImage,
  productWhatsappUrl,
  type Product,
} from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;

  return (
    <article className="group relative overflow-hidden border border-border/80 bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-[#c59b4e]/50 hover:shadow-[0_16px_36px_rgba(25,18,12,0.08)]">
      {/* Product Image Box */}
      <div className="relative overflow-hidden bg-secondary/30">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
          <div className="aspect-3/4 w-full overflow-hidden">
            <img
              src={primaryImage(product)}
              alt={product.product_name}
              loading="lazy"
              width={900}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.new_arrival && product.available && (
            <span className="border border-[#c59b4e]/40 bg-background/90 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[#7a581e] backdrop-blur-sm shadow-xs">
              ✨ New Arrival
            </span>
          )}
          {product.featured && product.available && (
            <span className="border border-primary/30 bg-primary/90 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-primary-foreground backdrop-blur-sm shadow-xs">
              Boutique Pick
            </span>
          )}
          {!product.available && (
            <span className="bg-foreground/90 px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.2em] uppercase text-background">
              Sold Out
            </span>
          )}
        </div>

        {/* WhatsApp Order Action */}
        {product.available && (
          <a
            href={productWhatsappUrl(product)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Order ${product.product_name} on WhatsApp`}
            title="Order on WhatsApp"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-[#c59b4e]/40 bg-background/85 text-[#7a581e] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Card Details */}
      <div className="space-y-2.5 p-4.5">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-[0.62rem] font-medium text-[#c59b4e]">
            {product.category?.name ?? "Collection"}
          </p>
          {product.fabric && (
            <span className="text-[0.62rem] tracking-wider uppercase text-muted-foreground">
              {product.fabric}
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-normal leading-tight text-foreground transition-colors group-hover:text-primary">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-1">
            {product.product_name}
          </Link>
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="text-base font-semibold text-primary">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground/75 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Card Footer Link */}
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="inline-flex items-center gap-1 text-[0.65rem] font-medium tracking-[0.22em] uppercase text-muted-foreground transition-colors group-hover:text-primary"
          >
            <span>Explore Piece</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {product.available ? (
            <span className="text-[0.6rem] font-medium tracking-[0.16em] uppercase text-emerald-700 dark:text-emerald-400">
              In Stock
            </span>
          ) : (
            <span className="text-[0.6rem] tracking-[0.16em] uppercase text-muted-foreground">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

