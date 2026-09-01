import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { ProductGrid } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PRICE_BANDS, sortProducts, type Product } from "@/lib/catalog";
import { catalogQueryOptions } from "@/lib/catalog.functions";
import { useQuery } from "@tanstack/react-query";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured" },
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
      { title: "Shop | Sanvika Collection" },
      { name: "description", content: "Browse sarees, suits, kurtas and more from the Sanvika Collection catalog." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const navigate = useNavigate({ from: "/shop" });
  const search = Route.useSearch();
  const { data, isLoading, error } = useQuery(catalogQueryOptions());

  const categoryOptions = useMemo(
    () => [{ value: "all", label: "All categories" }, ...(data?.categories ?? []).map((c) => ({ value: c.slug, label: c.name }))],
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-40 rounded bg-secondary" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 rounded bg-secondary" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="eyebrow">Catalog unavailable</p>
        <h1 className="mt-4 font-display text-4xl">We couldn’t load the collection right now.</h1>
        <p className="mt-4 text-sm text-muted-foreground">Please refresh the page or try again later.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="mt-3 font-display text-5xl text-primary">The Collection</h1>
        </div>
        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <input
            value={search.q ?? ""}
            onChange={(e) => updateSearch({ q: e.target.value })}
            placeholder="Search products, fabric, colour..."
            className="h-11 w-full rounded-none border border-border bg-background px-4 text-sm outline-none ring-0 focus:border-primary"
          />
          <select
            value={search.sort ?? "newest"}
            onChange={(e) => updateSearch({ sort: e.target.value })}
            className="h-11 rounded-none border border-border bg-background px-3 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <select
          value={search.category ?? "all"}
          onChange={(e) => updateSearch({ category: e.target.value })}
          className="h-11 rounded-none border border-border bg-background px-3 text-sm"
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
          className="h-11 rounded-none border border-border bg-background px-3 text-sm"
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
          className="h-11 rounded-none border border-border bg-background px-3 text-sm"
        >
          <option value="all">All items</option>
          <option value="available">Available</option>
          <option value="sold-out">Sold out</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-none border border-dashed border-border bg-secondary/25 px-6 py-16 text-center">
          <p className="eyebrow">No matches</p>
          <h2 className="mt-4 font-display text-4xl text-primary">Nothing fits this selection.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Try another category, price range or keyword to explore the collection.
          </p>
          <Link to="/shop" className="mt-6 inline-flex bg-primary px-7 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filteredProducts.length} products</p>
          </div>
          <ProductGrid products={filteredProducts} />
        </>
      )}

      <div className="mt-20">
        <SectionHeading eyebrow="shop by" title="Popular categories" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {data.categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="border border-border bg-secondary/30 p-6 text-left transition-colors hover:border-primary"
            >
              <p className="eyebrow">{category.name}</p>
              <h3 className="mt-3 font-display text-3xl text-primary">Browse</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
