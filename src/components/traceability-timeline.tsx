import Image from "next/image";

import { t, tc, type Language } from "@/lib/i18n";

export type TraceabilityStage = {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  location: string | null;
  happenedAt: string;
  photoUrl?: string | null;
  meta: Record<string, string>;
};

const EVENT_META_BY_COMMODITY: Record<string, Record<string, { icon: string; label: string }>> = {
  corn: {
    sourcing: { icon: "🌱", label: "Asal Lahan & Benih" },
    planting_inputs: { icon: "🚜", label: "Tanam & Pemupukan" },
    harvest: { icon: "🌽", label: "Panen Tongkol" },
    drying: { icon: "☀️", label: "Pengeringan & Kadar Air" },
    quality_lab: { icon: "🔬", label: "Uji Lab & Mutu" },
    distribution: { icon: "📦", label: "Siap Pasok Pakan" },
  },
  coffee: {
    sourcing: { icon: "🏞️", label: "Asal Kebun & Petani" },
    harvest: { icon: "🍒", label: "Panen Petik Merah" },
    processing: { icon: "⚙️", label: "Pengolahan Pasca-Panen" },
    drying: { icon: "☀️", label: "Pengeringan & Kadar Air" },
    grading: { icon: "🧺", label: "Hulling & Sortasi Biji" },
    cupping: { icon: "☕", label: "Uji Cita Rasa (Cupping)" },
    packaging: { icon: "📦", label: "Kemasan Green Bean" },
  },
  // Fallback compatibility
  pig: {
    sourcing: { icon: "🌱", label: "Asal Lahan" },
    planting_inputs: { icon: "🚜", label: "Perawatan & Input" },
    harvest: { icon: "🌽", label: "Pemanenan" },
    drying: { icon: "☀️", label: "Pengeringan" },
    quality_lab: { icon: "🔬", label: "Uji Mutu" },
    distribution: { icon: "📦", label: "Distribusi" },
  },
};

const META_KEY_LABEL: Record<string, Record<Language, string>> = {
  varietas_benih: { id: "Varietas Benih", en: "Seed Variety", zh: "种子品种" },
  jenis_pupuk: { id: "Bahan Pupuk", en: "Fertilizer / Inputs", zh: "肥料/投入品" },
  bahan_input: { id: "Bahan & Input", en: "Materials & Inputs", zh: "原料与投入品" },
  mitra_tani: { id: "Mitra Petani", en: "Partner Farmer", zh: "合作农户" },
  luas_lahan: { id: "Luas Lahan", en: "Farm Area", zh: "种植面积" },
  kadar_air: { id: "Kadar Air", en: "Moisture Content", zh: "水分含量" },
  aflatoksin: { id: "Kadar Aflatoksin", en: "Aflatoxin Level", zh: "黄曲霉毒素" },
  protein_kasar: { id: "Protein Kasar", en: "Crude Protein", zh: "粗蛋白" },
  elevasi: { id: "Ketinggian (Elevasi)", en: "Altitude", zh: "海拔高度" },
  metode_olah: { id: "Metode Olah", en: "Processing Method", zh: "处理方式" },
  cupping_score: { id: "Skor Cupping (SCAA)", en: "Cupping Score", zh: "杯测得分" },
  tasting_notes: { id: "Profil Rasa", en: "Tasting Notes", zh: "风味特征" },
  kemasan: { id: "Standar Kemasan", en: "Packaging Standard", zh: "包装标准" },
  kondisi: { id: "Kondisi", en: "Condition", zh: "状态" },
  bobot: { id: "Bobot/Volume", en: "Weight/Volume", zh: "重量/数量" },
  hasil: { id: "Hasil Uji", en: "Test Result", zh: "检验结果" },
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
              {stage.photoUrl && (
                <div className="relative mt-3 h-52 overflow-hidden rounded-xl border-2 border-secondary shadow-[3px_3px_0px_#1d2b1f]">
                  <Image
                    src={stage.photoUrl}
                    alt={tc(stage.title, lang)}
                    fill
                    sizes="(min-width: 768px) 40rem, 100vw"
                    className="object-cover"
                  />
                </div>
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
