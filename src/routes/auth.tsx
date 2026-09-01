import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login | Sanvika Collection" },
      { name: "description", content: "Admin access for Sanvika Collection." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (session) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
        const isAdmin = (data ?? []).some((row) => row.role === "admin");
        if (isAdmin) {
          navigate({ to: "/admin" });
          return;
        }
      }

      setCheckingSession(false);
    }

    checkSession();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Unable to log in.");
      return;
    }

    toast.success("Logged in successfully.");
    navigate({ to: "/admin" });
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md border border-border bg-background p-8 shadow-sm">
        <p className="eyebrow">Admin portal</p>
        <h1 className="mt-3 font-display text-4xl text-primary">Log in</h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sanvikacollection.in"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
