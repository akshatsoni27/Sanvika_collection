import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";

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
    return <div className="mx-auto max-w-7xl px-4 py-16 text-sm text-muted-foreground">Loading category...</div>;
  }

  if (error || !category) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="eyebrow">Category unavailable</p>
        <h1 className="mt-4 font-display text-4xl">This collection is not available.</h1>
        <Link to="/shop" className="mt-8 inline-flex bg-primary px-7 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-10">
        <p className="eyebrow">Collection</p>
        <h1 className="mt-3 font-display text-5xl text-primary">{category.name}</h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-none border border-dashed border-border bg-secondary/25 px-6 py-16 text-center">
          <p className="eyebrow">Empty collection</p>
          <h2 className="mt-4 font-display text-4xl">No products in this category yet.</h2>
          <Link to="/shop" className="mt-6 inline-flex bg-primary px-7 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
            Explore shop
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
