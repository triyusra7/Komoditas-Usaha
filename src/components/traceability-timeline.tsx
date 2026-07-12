export type TraceabilityStage = {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  location: string | null;
  happenedAt: string;
  meta: Record<string, string>;
};

const EVENT_META_BY_COMMODITY: Record<string, Record<string, { icon: string; label: string }>> = {
  pig: {
    acquisition: { icon: "🐷", label: "Akuisisi Bibit" },
    transport: { icon: "🚚", label: "Transportasi" },
    housing: { icon: "🏠", label: "Penempatan Kandang" },
    growth: { icon: "📈", label: "Pertumbuhan" },
    health: { icon: "💉", label: "Kesehatan" },
    ready_slaughter: { icon: "✅", label: "Siap Potong / Karkas" },
  },
  coffee: {
    sourcing: { icon: "🌱", label: "Asal" },
    harvest: { icon: "🍒", label: "Panen" },
    transport: { icon: "🚚", label: "Perjalanan" },
    processing: { icon: "⚙️", label: "Pengolahan" },
    drying: { icon: "☀️", label: "Pengeringan" },
    packaging: { icon: "📦", label: "Green Bean" },
  },
};

const META_KEY_LABEL: Record<string, string> = {
  umur_saat_beli: "Umur saat beli",
  tanggal_lahir: "Tanggal lahir",
  jenis: "Jenis",
  moda: "Moda",
  lama_perjalanan: "Lama perjalanan",
  blok: "Blok kandang",
  kondisi: "Kondisi",
  bobot: "Bobot",
  umur: "Umur",
  pakan: "Pakan",
  vaksin: "Vaksin",
  hasil: "Hasil",
  bobot_potong: "Bobot potong",
  rendemen: "Rendemen karkas",
};

type TraceabilityTimelineProps = {
  stages: TraceabilityStage[];
  commodityType: string;
};

/** Agnostic across commodities — pig today, coffee/fishery later, same shape. */
export function TraceabilityTimeline({ stages, commodityType }: TraceabilityTimelineProps) {
  const labels = EVENT_META_BY_COMMODITY[commodityType] ?? {};
  const ordered = [...stages].sort(
    (a, b) => new Date(a.happenedAt).getTime() - new Date(b.happenedAt).getTime(),
  );

  if (ordered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center text-sm text-muted-foreground">
        Data jejak sedang dilengkapi.
      </div>
    );
  }

  return (
    <ol className="relative space-y-8 border-l-2 border-primary/50 pl-8">
      {ordered.map((stage) => {
        const eventMeta = labels[stage.eventType];
        const metaEntries = Object.entries(stage.meta).filter(
          ([, value]) => typeof value === "string" && value.length > 0,
        );

        return (
          <li key={stage.id} className="relative">
            <span className="absolute -left-[2.85rem] top-0 flex size-9 items-center justify-center rounded-full border-2 border-primary bg-background text-base">
              {eventMeta?.icon ?? "📍"}
            </span>
            <div className="rounded-2xl border border-foreground/10 bg-card p-5">
              <p className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
                <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">
                  {eventMeta?.label ?? stage.eventType}
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                📅{" "}
                {new Date(stage.happenedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {stage.location ? ` · 📍 ${stage.location}` : ""}
              </p>
              <p className="mt-1 font-heading text-lg font-bold">{stage.title}</p>
              {stage.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {stage.description}
                </p>
              )}
              {metaEntries.length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-foreground/10 pt-3 sm:grid-cols-3">
                  {metaEntries.map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {META_KEY_LABEL[key] ?? key.replaceAll("_", " ")}
                      </dt>
                      <dd className="text-sm font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
