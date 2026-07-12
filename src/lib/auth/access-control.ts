import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/supabase";

export type UserRole = Enums<"user_role">;

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string;
  role: UserRole;
};

/** Returns the signed-in user + profile, or null if not authenticated. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    role: profile.role,
  };
}

/** Redirects to /admin/login when not authenticated, otherwise returns the user. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Redirects to /admin when authenticated but lacking one of the allowed roles. */
export async function requireRole(...allowed: UserRole[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect("/admin");
  return user;
}
