import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnimateIn } from "@/components/animate-in";
import { TraceabilityTimeline } from "@/components/traceability-timeline";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";
import { t, tc } from "@/lib/i18n";
import { getLanguage } from "@/lib/i18n-server";

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
  const lang = await getLanguage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <AnimateIn variant="fade-down" duration={500}>
        <span className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
          {t("Traceability", lang)}
        </span>
      </AnimateIn>
      <AnimateIn variant="fade-up" delay={100} duration={700}>
        <h1 className="mt-6 font-heading text-4xl font-bold">
          {subject.title ? tc(subject.title, lang) : subject.code}
        </h1>
      </AnimateIn>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: t("Kode", lang), value: subject.code },
          { label: t("Status", lang), value: subject.current_status ? tc(subject.current_status, lang) : "-" },
          { label: t("Tahap Tercatat", lang), value: `${events.length} ${t("tahap", lang)}` },
          {
            label: t("Periode", lang),
            value:
              firstEvent && lastEvent
                ? `${new Date(firstEvent.happened_at).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { month: "short", year: "numeric" })} — ${new Date(lastEvent.happened_at).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { month: "short", year: "numeric" })}`
                : "-",
          },
        ].map((stat, i) => (
          <AnimateIn key={stat.label} variant="scale-up" delay={200 + i * 100} duration={500}>
            <div className="rounded-2xl border border-foreground/10 bg-card p-4">
              <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="mt-1 font-semibold">{stat.value}</p>
            </div>
          </AnimateIn>
        ))}
      </div>

      <AnimateIn variant="fade-up" delay={300} duration={800}>
        <div className="mt-12">
          <TraceabilityTimeline
            commodityType={subject.commodity_type}
            lang={lang}
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
      </AnimateIn>

      {subject.product_id && (
        <AnimateIn variant="fade-up" delay={100} duration={600}>
          <div className="mt-12 text-center">
            <Link href="/katalog/babi" className="text-sm font-semibold hover:underline">
              {t("← Lihat produk terkait di katalog", lang)}
            </Link>
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
