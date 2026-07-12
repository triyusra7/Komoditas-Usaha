import Link from "next/link";

import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const { setup } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold">Masuk Admin</h1>
          <p className="text-sm text-muted-foreground">Tri Agri — panel pengelolaan</p>
        </div>
        {setup === "success" && (
          <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm">
            Akun owner berhasil dibuat. Silakan masuk.
          </p>
        )}
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground">
          Belum ada akun owner?{" "}
          <Link href="/admin/setup" className="underline">
            Buat akun pertama
          </Link>
        </p>
      </div>
    </div>
  );
}
