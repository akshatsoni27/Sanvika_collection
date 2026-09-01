import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";

import type { Category, Product } from "./catalog";

/** Publishable-key client for public, read-only catalog reads during SSR. */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_SELECT =
  "id, product_name, slug, sku, category_id, price, discount_price, description, fabric, color, sizes, available, featured, new_arrival, created_at, product_images(image_url, display_order), categories(name, slug)";

type RawProduct = Omit<Product, "images" | "category"> & {
  product_images: { image_url: string; display_order: number }[] | null;
  categories: { name: string; slug: string } | null;
};

const mapProduct = (row: RawProduct): Product => ({
  ...row,
  price: Number(row.price),
  discount_price: row.discount_price === null ? null : Number(row.discount_price),
  sizes: row.sizes ?? [],
  images: [...(row.product_images ?? [])].sort((a, b) => a.display_order - b.display_order),
  category: row.categories,
});

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [categoriesRes, productsRes] = await Promise.all([
    sb.from("categories").select("id, name, slug, display_order").order("display_order"),
    sb.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false }),
  ]);

  if (categoriesRes.error) throw new Error(categoriesRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);

  return {
    categories: (categoriesRes.data ?? []) as Category[],
    products: ((productsRes.data ?? []) as unknown as RawProduct[]).map(mapProduct),
  };
});

export const catalogQueryOptions = () =>
  queryOptions({
    queryKey: ["catalog"],
    queryFn: () => getCatalog(),
    staleTime: 30_000,
  });
