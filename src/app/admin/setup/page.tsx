import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .eq("role", "owner");

  if (count && count > 0) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold">Buat Akun Owner</h1>
          <p className="text-sm text-muted-foreground">
            Langkah ini hanya tersedia sebelum ada akun owner.
          </p>
        </div>
        <SetupForm />
      </div>
    </div>
  );
}
