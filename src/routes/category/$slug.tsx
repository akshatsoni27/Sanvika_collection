import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/site/ProductCard";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  head: ({ params }) => {
    const title = `${params.slug ? params.slug.replace(/-/g, " ") : "Category"} | Sanvika Collection`;
    return {
      meta: [
        { title },
        { name: "description", content: "Discover curated ethnic wear from this Sanvika Collection category." },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery(catalogQueryOptions());

  const category = useMemo(
    () => data?.categories.find((item) => item.slug === slug) ?? null,
    [data, slug],
  );

  const products = useMemo(
    () => (data?.products.filter((product) => product.category?.slug === slug) ?? []),
    [data, slug],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-muted-foreground">
        <Sparkles className="mx-auto h-6 w-6 text-[#c59b4e] animate-pulse" />
        <p className="mt-3">Loading collection...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="eyebrow">Category Unavailable</p>
        <h1 className="mt-4 font-display text-4xl text-primary font-normal">This collection is currently unavailable.</h1>
        <Link to="/shop" className="luxury-button mt-8">
          Back to All Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb navigation */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground font-medium">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="text-[#c59b4e]">/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">Catalog</Link>
        <span className="text-[#c59b4e]">/</span>
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>

      <div className="mb-12 border-b border-border/80 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-[#c59b4e]" />
          <p className="eyebrow text-[#c59b4e]">Curated Atelier Edit</p>
        </div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-light text-foreground">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-light">
          Showing {products.length} handpicked {category.name.toLowerCase()} crafted for celebrations and special traditions.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="border border-dashed border-[#c59b4e]/40 bg-secondary/25 px-6 py-20 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[#c59b4e]" />
          <p className="eyebrow mt-3">Upcoming Collection</p>
          <h2 className="mt-3 font-display text-3xl font-light text-foreground sm:text-4xl">
            New pieces are arriving soon.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground font-light">
            Our weavers are finishing the next series of {category.name.toLowerCase()}. Check our full catalog or message us for bespoke orders.
          </p>
          <Link to="/shop" className="luxury-button mt-7">
            <span>Explore All Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

