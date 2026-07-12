export type TraceabilityStage = {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  location: string | null;
  happenedAt: string;
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  acquisition: "Akuisisi Bibit",
  transport: "Transportasi",
  housing: "Penempatan Kandang",
  growth: "Pertumbuhan/Kesehatan",
  ready: "Siap Potong/Karkas",
};

type TraceabilityTimelineProps = {
  stages: TraceabilityStage[];
  commodityType: string;
};

/** Agnostic across commodities — babi today, kopi/ikan later, same shape. */
export function TraceabilityTimeline({ stages, commodityType }: TraceabilityTimelineProps) {
  const ordered = [...stages].sort(
    (a, b) => new Date(a.happenedAt).getTime() - new Date(b.happenedAt).getTime(),
  );

  if (ordered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada jejak {commodityType} yang dipublikasikan untuk subjek ini.
      </p>
    );
  }

  return (
    <ol className="space-y-6 border-l-2 border-primary/40 pl-6">
      {ordered.map((stage) => (
        <li key={stage.id} className="relative">
          <span className="absolute -left-[1.85rem] top-1.5 size-3 rounded-full border-2 border-primary bg-background" />
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {EVENT_TYPE_LABEL[stage.eventType] ?? stage.eventType}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(stage.happenedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {stage.location ? ` · ${stage.location}` : ""}
          </p>
          <p className="mt-1 font-medium">{stage.title}</p>
          {stage.description && (
            <p className="mt-1 text-sm text-muted-foreground">{stage.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
