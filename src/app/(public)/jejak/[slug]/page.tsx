import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TraceabilityTimeline } from "@/components/traceability-timeline";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const result = await publicData.getTraceabilityBySlug(slug);
  return {
    title: result ? `Jejak ${result.subject.title ?? result.subject.code}` : "Jejak Produk",
    description: "Riwayat lengkap perjalanan produk — dari asal sampai siap jual.",
  };
}

export default async function JejakDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const result = await publicData.getTraceabilityBySlug(slug);

  if (!result) notFound();

  const { subject, events } = result;
  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
        Traceability
      </span>
      <h1 className="mt-6 font-heading text-4xl font-bold">
        {subject.title ?? subject.code}
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-foreground/10 bg-card p-4">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Kode
          </p>
          <p className="mt-1 font-semibold">{subject.code}</p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-card p-4">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Status
          </p>
          <p className="mt-1 font-semibold">{subject.current_status ?? "-"}</p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-card p-4">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Tahap Tercatat
          </p>
          <p className="mt-1 font-semibold">{events.length} tahap</p>
        </div>
        <div className="rounded-2xl border border-foreground/10 bg-card p-4">
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Periode
          </p>
          <p className="mt-1 text-sm font-semibold">
            {firstEvent && lastEvent
              ? `${new Date(firstEvent.happened_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })} — ${new Date(lastEvent.happened_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}`
              : "-"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <TraceabilityTimeline
          commodityType={subject.commodity_type}
          stages={events.map((event) => ({
            id: event.id,
            eventType: event.event_type,
            title: event.title,
            description: event.description,
            location: event.location,
            happenedAt: event.happened_at,
            meta: (event.meta ?? {}) as Record<string, string>,
          }))}
        />
      </div>

      {subject.product_id && (
        <div className="mt-12 text-center">
          <Link href="/katalog/babi" className="text-sm font-semibold hover:underline">
            ← Lihat produk terkait di katalog
          </Link>
        </div>
      )}
    </div>
  );
}
