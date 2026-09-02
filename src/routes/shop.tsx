import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PRICE_BANDS, sortProducts, type Product } from "@/lib/catalog";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { useQuery } from "@tanstack/react-query";

const sortOptions = [
  { value: "newest", label: "Sort: Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Curated / Featured" },
] as const;

type SearchState = {
  q?: string;
  category?: string;
  price?: string;
  available?: string;
  sort?: string;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): SearchState => ({
    q: typeof search.q === "string" ? search.q : "",
    category: typeof search.category === "string" ? search.category : "all",
    price: typeof search.price === "string" ? search.price : "all",
    available: typeof search.available === "string" ? search.available : "all",
    sort: typeof search.sort === "string" ? search.sort : "newest",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions()),
  head: () => ({
    meta: [
      { title: "Shop Complete Haute Couture Catalog | Sanvika Collection" },
      { name: "description", content: "Explore the curated catalog of handloom Banarasi sarees, designer suits, and festive kurtas from Sanvika Collection." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const navigate = useNavigate({ from: "/shop" });
  const search = Route.useSearch();
  const { data, isLoading, error } = useQuery(catalogQueryOptions());

  const categoryOptions = useMemo(
    () => [{ value: "all", label: "All Categories" }, ...(data?.categories ?? []).map((c) => ({ value: c.slug, label: c.name }))],
    [data],
  );

  const filteredProducts = useMemo(() => {
    if (!data) return [] as Product[];
    const term = search.q?.trim().toLowerCase() ?? "";
    let list = data.products.filter((product) => {
      const matchesSearch =
        !term ||
        [
          product.product_name,
          product.sku,
          product.category?.name,
          product.fabric,
          product.color,
          product.description,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));

      const matchesCategory = search.category === "all" || product.category?.slug === search.category;

      const priceBand = PRICE_BANDS.find((band) => band.id === search.price) ?? PRICE_BANDS[0];
      const effective = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
      const matchesPrice = effective >= priceBand.min && effective < priceBand.max;

      const matchesAvailability =
        search.available === "all" ||
        (search.available === "available" && product.available) ||
        (search.available === "sold-out" && !product.available);

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    const sort = (search.sort as keyof typeof sortOptions[number] | undefined) ?? "newest";
    return sortProducts(list, sort === "price-asc" ? "price-asc" : sort === "price-desc" ? "price-desc" : sort === "featured" ? "featured" : "newest");
  }, [data, search]);

  const updateSearch = (next: Partial<SearchState>) => {
    navigate({
      to: "/shop",
      search: {
        q: search.q ?? "",
        category: search.category ?? "all",
        price: search.price ?? "all",
        available: search.available ?? "all",
        sort: search.sort ?? "newest",
        ...next,
      },
    });
  };

  const hasActiveFilters = (search.category && search.category !== "all") || (search.price && search.price !== "all") || (search.available && search.available !== "all") || !!search.q;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-secondary/80" />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-3/4 bg-secondary/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="eyebrow">Catalog Unavailable</p>
        <h1 className="mt-4 font-display text-4xl text-primary font-normal">We could not load the collection.</h1>
        <p className="mt-3 text-sm text-muted-foreground font-light">Please check your connection and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/80 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-[#c59b4e]" />
            <p className="eyebrow">Sanvika Catalog</p>
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-light text-foreground">
            The Haute Couture Collection
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-light">
            Handpicked sarees, bespoke suits, and timeless ethnic wardrobe staples.
          </p>
        </div>

        {/* Search Input & Sort */}
        <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c59b4e]" />
            <input
              value={search.q ?? ""}
              onChange={(e) => updateSearch({ q: e.target.value })}
              placeholder="Search saree, fabric, color..."
              className="h-11 w-full border border-border bg-background pl-10 pr-4 text-xs font-medium tracking-wide outline-none transition-colors focus:border-primary"
            />
            {search.q && (
              <button
                type="button"
                onClick={() => updateSearch({ q: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={search.sort ?? "newest"}
            onChange={(e) => updateSearch({ sort: e.target.value })}
            className="h-11 border border-border bg-background px-3 text-xs tracking-wider uppercase font-medium text-foreground outline-none transition-colors focus:border-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 border border-[#c59b4e]/30 bg-secondary/35 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#c59b4e]" />
            <span className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-foreground">
              Filter Curations
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() =>
                navigate({
                  to: "/shop",
                  search: { q: "", category: "all", price: "all", available: "all", sort: "newest" },
                })
              }
              className="text-[0.65rem] tracking-[0.16em] uppercase text-primary underline underline-offset-4 hover:opacity-80"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={search.category ?? "all"}
            onChange={(e) => updateSearch({ category: e.target.value })}
            className="h-10 border border-border bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={search.price ?? "all"}
            onChange={(e) => updateSearch({ price: e.target.value })}
            className="h-10 border border-border bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
          >
            {PRICE_BANDS.map((band) => (
              <option key={band.id} value={band.id}>
                {band.label}
              </option>
            ))}
          </select>

          <select
            value={search.available ?? "all"}
            onChange={(e) => updateSearch({ available: e.target.value })}
            className="h-10 border border-border bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="all">All Availability</option>
            <option value="available">Ready to Order (In Stock)</option>
            <option value="sold-out">Archive / Sold Out</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-[#c59b4e]/50 bg-secondary/25 px-6 py-20 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-[#c59b4e]" />
          <p className="eyebrow mt-3">No Exact Matches</p>
          <h2 className="mt-3 font-display text-3xl font-light text-foreground sm:text-4xl">
            No pieces match this filter combination.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground font-light">
            Try choosing another category, price range or resetting your search keywords to view our full catalog.
          </p>
          <button
            onClick={() =>
              navigate({
                to: "/shop",
                search: { q: "", category: "all", price: "all", available: "all", sort: "newest" },
              })
            }
            className="luxury-button mt-7"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between text-xs tracking-wider uppercase text-muted-foreground">
            <p className="font-medium text-foreground">Showing {filteredProducts.length} curated pieces</p>
          </div>
          <ProductGrid products={filteredProducts} />
        </>
      )}

      {/* Bottom Category Highlights */}
      <div className="mt-24 border-t border-border/80 pt-16">
        <SectionHeading eyebrow="Explore More" title="Popular Atelier Collections" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {data.categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="group border border-border/80 bg-card p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b4e]/60 hover:shadow-md"
            >
              <p className="eyebrow text-[#c59b4e]">{category.name}</p>
              <h3 className="mt-3 font-display text-2xl font-light text-foreground transition-colors group-hover:text-primary">
                Browse {category.name} →
              </h3>
              <p className="mt-2 text-xs text-muted-foreground font-light">
                View exclusive handpicked designs in our {category.name.toLowerCase()} catalog.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

