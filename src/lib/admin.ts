import { supabase } from "@/integrations/supabase/client";

export type AdminStatus = {
  authenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
};

export async function getAdminStatus(): Promise<AdminStatus> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { authenticated: false, isAdmin: false, userId: null };
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id);

  if (error) {
    throw error;
  }

  return {
    authenticated: true,
    isAdmin: (data ?? []).some((row) => row.role === "admin"),
    userId: session.user.id,
  };
}

export function productStoragePathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/product-images/";
    const match = parsed.pathname.includes(marker)
      ? parsed.pathname.split(marker)[1]
      : parsed.pathname.replace(/^\/+/, "");
    return match ? decodeURIComponent(match) : null;
  } catch {
    return null;
  }
}
