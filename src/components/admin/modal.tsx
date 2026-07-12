import Link from "next/link";
import { Plus, X } from "lucide-react";

/* Modal state lives in the URL (?new=1) so the whole flow stays
   server-rendered: the open button is a Link, and create actions
   redirect back to the page on success — which closes the modal. */

export function CreateButton({ label, href = "?new=1" }: { label: string; href?: string }) {
  return (
    <Link href={href} className="adm-btn adm-btn-primary">
      <Plus aria-hidden="true" className="size-4" strokeWidth={2.75} />
      {label}
    </Link>
  );
}

export function FormModal({
  title,
  subtitle,
  closeHref,
  wide = false,
  children,
}: {
  title: string;
  subtitle?: string;
  closeHref: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <Link
        href={closeHref}
        aria-label="Tutup"
        className="absolute inset-0 bg-secondary/60 backdrop-blur-[2px]"
        scroll={false}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`adm-card relative z-10 max-h-[88vh] w-full overflow-y-auto p-6 ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-secondary">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <Link
            href={closeHref}
            aria-label="Tutup form"
            scroll={false}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-background transition-colors hover:bg-primary"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={2.75} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
