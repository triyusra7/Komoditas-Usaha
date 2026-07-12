import { t, tc, type Language } from "@/lib/i18n";

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

const META_KEY_LABEL: Record<string, Record<Language, string>> = {
  umur_saat_beli: { id: "Umur saat beli", en: "Age at purchase" },
  tanggal_lahir: { id: "Tanggal lahir", en: "Date of birth" },
  jenis: { id: "Jenis", en: "Type" },
  moda: { id: "Moda", en: "Mode" },
  lama_perjalanan: { id: "Lama perjalanan", en: "Travel duration" },
  blok: { id: "Blok kandang", en: "Pen block" },
  kondisi: { id: "Kondisi", en: "Condition" },
  bobot: { id: "Bobot", en: "Weight" },
  umur: { id: "Umur", en: "Age" },
  pakan: { id: "Pakan", en: "Feed" },
  vaksin: { id: "Vaksin", en: "Vaccine" },
  hasil: { id: "Hasil", en: "Result" },
  bobot_potong: { id: "Bobot potong", en: "Slaughter weight" },
  rendemen: { id: "Rendemen karkas", en: "Carcass yield" },
};

type TraceabilityTimelineProps = {
  stages: TraceabilityStage[];
  commodityType: string;
  lang?: Language;
};

/** Agnostic across commodities — pig today, coffee/fishery later, same shape. */
export function TraceabilityTimeline({ stages, commodityType, lang = "id" }: TraceabilityTimelineProps) {
  const labels = EVENT_META_BY_COMMODITY[commodityType] ?? {};
  const ordered = [...stages].sort(
    (a, b) => new Date(a.happenedAt).getTime() - new Date(b.happenedAt).getTime(),
  );

  if (ordered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-foreground/20 p-10 text-center text-sm text-muted-foreground">
        {t("Data jejak sedang dilengkapi.", lang)}
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
              <div className="text-xs font-bold tracking-widest text-primary-foreground/70 uppercase">
                <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">
                  {tc(eventMeta?.label ?? stage.eventType, lang)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                📅{" "}
                {new Date(stage.happenedAt).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {stage.location ? ` · 📍 ${stage.location}` : ""}
              </p>
              <p className="mt-1 font-heading text-lg font-bold">{tc(stage.title, lang)}</p>
              {stage.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {tc(stage.description, lang)}
                </p>
              )}
              {metaEntries.length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-foreground/10 pt-3 sm:grid-cols-3">
                  {metaEntries.map(([key, value]) => {
                    const labelObj = META_KEY_LABEL[key];
                    const labelText = labelObj ? labelObj[lang] : key.replaceAll("_", " ");
                    return (
                      <div key={key}>
                        <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                          {labelText}
                        </dt>
                        <dd className="text-sm font-semibold">{tc(value, lang)}</dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
