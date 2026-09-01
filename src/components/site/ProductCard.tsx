import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import {
  formatPrice,
  primaryImage,
  productWhatsappUrl,
  type Product,
} from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount = !!product.discount_price && product.discount_price < product.price;

  return (
    <article className="group relative overflow-hidden border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="relative overflow-hidden bg-secondary/40">
        <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
          <div className="aspect-3/4 w-full overflow-hidden">
            <img
              src={primaryImage(product)}
              alt={product.product_name}
              loading="lazy"
              width={900}
              height={1200}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-2">
          {product.new_arrival && product.available && (
            <span className="bg-gold px-2 py-1 text-[0.58rem] tracking-[0.18em] uppercase text-gold-foreground">
              New
            </span>
          )}
          {!product.available && (
            <span className="bg-foreground/85 px-2 py-1 text-[0.58rem] tracking-[0.18em] uppercase text-background">
              Sold Out
            </span>
          )}
        </div>

        {product.available && (
          <a
            href={productWhatsappUrl(product)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Order ${product.product_name} on WhatsApp`}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-background/60 bg-background/70 text-primary backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="space-y-3 p-4">
        <p className="eyebrow text-[0.58rem]">{product.category?.name ?? "Collection"}</p>
        <h3 className="font-display text-2xl leading-none text-foreground">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.product_name}
          </Link>
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-primary">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/80 pt-3">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="text-[0.68rem] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary"
          >
            View Product
          </Link>
          {product.available && (
            <span className="text-[0.58rem] tracking-[0.18em] uppercase text-primary">Available</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
