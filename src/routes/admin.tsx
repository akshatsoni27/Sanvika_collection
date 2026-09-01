import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { productStoragePathFromUrl, type AdminStatus } from "@/lib/admin";
import { type Category, type Product, effectivePrice, formatPrice, buildSlug } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { data: rolesData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    const isAdmin = (rolesData ?? []).some((row: any) => row.role === "admin");
    if (!isAdmin) {
      throw new Error("Forbidden");
    }
  },
  head: () => ({
    meta: [
      { title: `Admin Dashboard | ${siteConfig.name}` },
      { name: "description", content: "Admin dashboard for Sanvika Collection." },
    ],
  }),
  component: AdminPage,
});

type ProductFormState = {
  product_name: string;
  sku: string;
  category_id: string;
  price: string;
  discount_price: string;
  description: string;
  fabric: string;
  color: string;
  sizes: string;
  available: boolean;
  featured: boolean;
  new_arrival: boolean;
};

const emptyForm = (): ProductFormState => ({
  product_name: "",
  sku: "",
  category_id: "",
  price: "",
  discount_price: "",
  description: "",
  fabric: "",
  color: "",
  sizes: "",
  available: true,
  featured: false,
  new_arrival: false,
});

const mapProductRow = (row: any): Product => ({
  ...row,
  price: Number(row.price),
  discount_price: row.discount_price === null ? null : Number(row.discount_price),
  sizes: row.sizes ?? [],
  images: [...(row.product_images ?? [])].sort((a: any, b: any) => a.display_order - b.display_order),
  category: row.categories ? { name: row.categories.name, slug: row.categories.slug } : null,
});

async function fetchCatalogData() {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("id, name, slug, display_order").order("display_order"),
    supabase
      .from("products")
      .select(
        "id, product_name, slug, sku, category_id, price, discount_price, description, fabric, color, sizes, available, featured, new_arrival, created_at, categories(name, slug), product_images(id, image_url, display_order)",
      )
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesRes.error) throw categoriesRes.error;
  if (productsRes.error) throw productsRes.error;

  return {
    categories: (categoriesRes.data ?? []) as Category[],
    products: ((productsRes.data ?? []) as any[]).map(mapProductRow),
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<"dashboard" | "products" | "categories">("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id: string; image_url: string }>>([]);
  const [categoryName, setCategoryName] = useState("");
  const [renameCategoryId, setRenameCategoryId] = useState<string>("");
  const [renameValue, setRenameValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    const data = await fetchCatalogData();
    setCategories(data.categories);
    setProducts(data.products);
  };

  useEffect(() => {
    let active = true;

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/auth" });
        return;
      }

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = (rolesData ?? []).some((row: any) => row.role === "admin");
      if (!active) return;

      if (!isAdmin) {
        setAdminStatus({ authenticated: true, isAdmin: false, userId: session.user.id });
        setLoading(false);
        return;
      }

      setAdminStatus({ authenticated: true, isAdmin: true, userId: session.user.id });
      await loadData();
      setLoading(false);
    }

    init();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const totalProducts = products.length;
  const availableCount = products.filter((p) => p.available).length;
  const soldOutCount = products.filter((p) => !p.available).length;

  const handleProductFormChange = (field: keyof ProductFormState, value: string | boolean) => {
    setProductForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setNewFiles(files);
    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);
  };

  const resetProductForm = () => {
    setProductForm(emptyForm());
    setEditingId(null);
    setExistingImages([]);
    setNewFiles([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const populateEditForm = (product: Product) => {
    setProductForm({
      product_name: product.product_name,
      sku: product.sku,
      category_id: product.category_id ?? "",
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : "",
      description: product.description ?? "",
      fabric: product.fabric ?? "",
      color: product.color ?? "",
      sizes: product.sizes.join(", "),
      available: product.available,
      featured: product.featured,
      new_arrival: product.new_arrival,
    });
    setExistingImages((product.images ?? []).map((image) => ({ id: image.id ?? "", image_url: image.image_url })));
    setEditingId(product.id);
    setTab("products");
  };

  const handleUploadImages = async (productId: string) => {
    if (!newFiles.length) return;

    for (let index = 0; index < newFiles.length; index += 1) {
      const file = newFiles[index];
      if (!file) continue;
      const extension = file.name.split(".").pop() ?? "jpg";
      const fileName = `${productId}-${Date.now()}-${index}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) {
        throw uploadError;
      }
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      await supabase.from("product_images").insert({
        product_id: productId,
        image_url: publicUrlData.publicUrl,
        display_order: index + (existingImages.length ?? 0),
      });
    }
  };

  const submitProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productForm.product_name.trim() || !productForm.sku.trim() || !productForm.category_id || !productForm.price) {
      toast.error("Please complete the required product fields.");
      return;
    }

    const numericPrice = Number(productForm.price);
    const numericDiscount = productForm.discount_price ? Number(productForm.discount_price) : null;
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Price must be a valid positive number.");
      return;
    }
    if (numericDiscount !== null && (Number.isNaN(numericDiscount) || numericDiscount >= numericPrice)) {
      toast.error("Discount price must be lower than the regular price.");
      return;
    }

    setSaving(true);

    try {
      const slug = buildSlug(productForm.product_name, productForm.sku);
      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update({
            product_name: productForm.product_name.trim(),
            sku: productForm.sku.trim(),
            category_id: productForm.category_id,
            price: numericPrice,
            discount_price: numericDiscount,
            description: productForm.description.trim() || null,
            fabric: productForm.fabric.trim() || null,
            color: productForm.color.trim() || null,
            sizes: productForm.sizes.split(",").map((item) => item.trim()).filter(Boolean),
            available: productForm.available,
            featured: productForm.featured,
            new_arrival: productForm.new_arrival,
            slug,
          })
          .eq("id", editingId);

        if (error) throw error;

        if (newFiles.length) {
          await handleUploadImages(editingId);
        }

        toast.success("Product updated successfully.");
      } else {
        const { data: insertedProduct, error: insertError } = await supabase
          .from("products")
          .insert({
            product_name: productForm.product_name.trim(),
            sku: productForm.sku.trim(),
            slug,
            category_id: productForm.category_id,
            price: numericPrice,
            discount_price: numericDiscount,
            description: productForm.description.trim() || null,
            fabric: productForm.fabric.trim() || null,
            color: productForm.color.trim() || null,
            sizes: productForm.sizes.split(",").map((item) => item.trim()).filter(Boolean),
            available: productForm.available,
            featured: productForm.featured,
            new_arrival: productForm.new_arrival,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newFiles.length && insertedProduct) {
          await handleUploadImages(insertedProduct.id);
        }

        toast.success("Product published successfully.");
      }

      resetProductForm();
      await loadData();
      setTab("products");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "There was a problem saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${product.product_name}?`);
    if (!confirmed) return;

    try {
      const paths = (product.images ?? []).map((image) => productStoragePathFromUrl(image.image_url)).filter(Boolean) as string[];
      if (paths.length) {
        await supabase.storage.from("product-images").remove(paths);
      }

      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;

      toast.success("Product deleted successfully.");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to delete the product.");
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ available: !current }).eq("id", id);
      if (error) throw error;
      toast.success(`Product marked ${!current ? "available" : "sold out"}.`);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to update availability.");
    }
  };

  const addCategory = async () => {
    const value = categoryName.trim();
    if (!value) {
      toast.error("Category name is required.");
      return;
    }

    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const { error } = await supabase.from("categories").insert({ name: value, slug, display_order:0 });
      if (error) throw error;
      setCategoryName("");
      toast.success("Category created.");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to create category.");
    }
  };

  const renameCategory = async () => {
    if (!renameCategoryId || !renameValue.trim()) {
      toast.error("Choose a category and enter a new name.");
      return;
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: renameValue.trim() })
        .eq("id", renameCategoryId);
      if (error) throw error;
      setRenameCategoryId("");
      setRenameValue("");
      toast.success("Category renamed.");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to rename category.");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const { data: productCountData } = await supabase
      .from("products")
      .select("id", { count: "exact" })
      .eq("category_id", categoryId);
    const count = productCountData?.length ?? 0;
    if (count > 0) {
      toast.error("This category still has products assigned to it. Reassign or remove them before deleting.");
      return;
    }

    const confirmed = window.confirm("This will permanently delete the category.");
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", categoryId);
      if (error) throw error;
      toast.success("Category deleted.");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to delete category.");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading dashboard...</div>;
  }

  if (!adminStatus || !adminStatus.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="max-w-md border border-border bg-background p-8 text-center">
          <p className="eyebrow">Access denied</p>
          <h1 className="mt-3 font-display text-4xl text-primary">Unauthorized</h1>
          <p className="mt-4 text-sm text-muted-foreground">This page is restricted to administrators.</p>
          <Link to="/auth" className="mt-8 inline-flex bg-primary px-6 py-3 text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground">
            Go to admin login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-secondary/25">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-display text-3xl text-primary">{siteConfig.name}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            ["dashboard", "Dashboard"],
            ["products", "Products"],
            ["categories", "Categories"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as "dashboard" | "products" | "categories")}
              className={`px-4 py-2 text-[0.7rem] tracking-[0.2em] uppercase ${tab === key ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="border border-border bg-secondary/25 p-6">
              <p className="eyebrow">Products</p>
              <h2 className="mt-3 font-display text-4xl text-primary">{totalProducts}</h2>
            </div>
            <div className="border border-border bg-secondary/25 p-6">
              <p className="eyebrow">Available</p>
              <h2 className="mt-3 font-display text-4xl text-primary">{availableCount}</h2>
            </div>
            <div className="border border-border bg-secondary/25 p-6">
              <p className="eyebrow">Sold out</p>
              <h2 className="mt-3 font-display text-4xl text-primary">{soldOutCount}</h2>
            </div>
            <div className="border border-border bg-secondary/25 p-6">
              <p className="eyebrow">Categories</p>
              <h2 className="mt-3 font-display text-4xl text-primary">{categories.length}</h2>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="border border-border bg-secondary/20 p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="font-display text-3xl text-primary">{editingId ? "Edit product" : "Add product"}</h2>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetProductForm}>
                      New product
                    </Button>
                  )}
                </div>

                <form onSubmit={submitProduct} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Product name</label>
                      <Input value={productForm.product_name} onChange={(e) => handleProductFormChange("product_name", e.target.value)} required />
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">SKU / Product ID</label>
                      <Input value={productForm.sku} onChange={(e) => handleProductFormChange("sku", e.target.value)} required />
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Category</label>
                      <select
                        value={productForm.category_id}
                        onChange={(e) => handleProductFormChange("category_id", e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Price</label>
                      <Input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => handleProductFormChange("price", e.target.value)} required />
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Discount price</label>
                      <Input type="number" min="0" step="0.01" value={productForm.discount_price} onChange={(e) => handleProductFormChange("discount_price", e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Fabric</label>
                      <Input value={productForm.fabric} onChange={(e) => handleProductFormChange("fabric", e.target.value)} />
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Color</label>
                      <Input value={productForm.color} onChange={(e) => handleProductFormChange("color", e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => handleProductFormChange("description", e.target.value)}
                        className="min-h-28 w-full rounded-md border border-input bg-background p-3 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Sizes</label>
                      <Input value={productForm.sizes} onChange={(e) => handleProductFormChange("sizes", e.target.value)} placeholder="S, M, L, XL" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.available} onChange={(e) => handleProductFormChange("available", e.target.checked)} /> Available</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.featured} onChange={(e) => handleProductFormChange("featured", e.target.checked)} /> Featured</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm.new_arrival} onChange={(e) => handleProductFormChange("new_arrival", e.target.checked)} /> New arrival</label>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">Images</label>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="block w-full text-sm" />
                    {(previews.length > 0 || existingImages.length > 0) && (
                      <div className="mt-4 grid grid-cols-4 gap-3">
                        {previews.map((preview, index) => (
                          <img key={preview + index} src={preview} alt="Preview" className="h-20 w-full object-cover" />
                        ))}
                        {existingImages.map((image) => (
                          <img key={image.id || image.image_url} src={image.image_url} alt="Existing product shot" className="h-20 w-full object-cover" />
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? "Saving..." : editingId ? "Save product" : "Publish product"}
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-border bg-secondary/20 p-6">
                <h2 className="font-display text-3xl text-primary">Recent products</h2>
                <div className="mt-4 space-y-3">
                  {products.slice(0, 8).map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 border-b border-border pb-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground">{product.available ? "Available" : "Sold out"}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => populateEditForm(product)}>
                          Edit
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => toggleAvailability(product.id, product.available)}>
                          {product.available ? "Sold out" : "Available"}
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => deleteProduct(product)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "categories" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-secondary/20 p-6">
              <h2 className="font-display text-3xl text-primary">Add category</h2>
              <div className="mt-5 flex gap-3">
                <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category name" />
                <Button onClick={addCategory}>Add</Button>
              </div>
            </div>

            <div className="border border-border bg-secondary/20 p-6">
              <h2 className="font-display text-3xl text-primary">Manage categories</h2>
              <div className="mt-5 space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <span>{category.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setRenameCategoryId(category.id); setRenameValue(category.name); }}>
                        Rename
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {renameCategoryId && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="eyebrow">Rename</p>
                  <div className="mt-3 flex gap-3">
                    <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                    <Button onClick={renameCategory}>Save</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
