import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { TraceabilityService } from "@/lib/services/traceability-service";
import { createClient } from "@/lib/supabase/server";

import { createEvent } from "../actions";

const EVENT_TYPE_LABEL: Record<string, string> = {
  acquisition: "🐷 Akuisisi Bibit",
  transport: "🚚 Transportasi",
  housing: "🏠 Penempatan Kandang",
  growth: "📈 Pertumbuhan",
  health: "💉 Kesehatan",
  ready_slaughter: "✅ Siap Potong / Karkas",
};

export default async function TraceSubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("owner", "staff");
  const { id } = await params;

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  const [subjects, events] = await Promise.all([
    traceability.listSubjects(),
    traceability.listEvents(id),
  ]);
  const subject = subjects.find((s) => s.id === id);

  if (!subject) notFound();

  return (
    <div>
      <PageHeader
        title={`${subject.title ?? subject.code}`}
        subtitle={`Kode ${subject.code} · URL publik: /jejak/${subject.public_slug}`}
        actions={
          <Link
            href={`/jejak/${subject.public_slug}`}
            target="_blank"
            className="adm-btn adm-btn-outline adm-btn-sm"
          >
            🌐 Lihat Halaman Publik
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Timeline */}
        <div className="adm-card p-5 xl:col-span-2">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">🗓️ Timeline Jejak</h3>
          <ol className="space-y-3 border-l-2 border-[#e8edf2] pl-5">
            {events.map((event) => (
              <li key={event.id} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-[#e8a020]" />
                <div className="rounded-lg border border-[#f0f4f8] bg-[#fafbfd] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#264C70]">
                      {EVENT_TYPE_LABEL[event.event_type] ?? event.event_type}
                    </p>
                    <span
                      className={`adm-badge ${event.is_public ? "adm-badge-green" : "adm-badge-gray"}`}
                    >
                      {event.is_public ? "Publik" : "Internal"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-[#8896ab]">
                    {new Date(event.happened_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  {event.description && (
                    <p className="mt-1 text-xs text-[#5a6a7e]">{event.description}</p>
                  )}
                </div>
              </li>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-[#8896ab]">Belum ada event tercatat.</p>
            )}
          </ol>
        </div>

        {/* Add event form */}
        <div className="adm-card h-fit p-5">
          <h3 className="mb-4 text-sm font-bold text-[#1e3f5c]">➕ Tambah Event</h3>
          <form action={createEvent} className="space-y-4">
            <input type="hidden" name="subjectId" value={subject.id} />
            <div>
              <label htmlFor="eventType" className="adm-label">
                Jenis Event
              </label>
              <select id="eventType" name="eventType" defaultValue="acquisition" className="adm-input">
                {Object.entries(EVENT_TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="title" className="adm-label">
                Judul
              </label>
              <input
                id="title"
                name="title"
                required
                placeholder="Vaksinasi hog cholera dosis 1"
                className="adm-input"
              />
            </div>
            <div>
              <label htmlFor="happenedAt" className="adm-label">
                Tanggal
              </label>
              <input id="happenedAt" name="happenedAt" type="date" required className="adm-input" />
            </div>
            <div>
              <label htmlFor="location" className="adm-label">
                Lokasi
              </label>
              <input id="location" name="location" placeholder="Kandang Palopo" className="adm-input" />
            </div>
            <div>
              <label htmlFor="description" className="adm-label">
                Deskripsi
              </label>
              <textarea id="description" name="description" rows={2} className="adm-input" />
            </div>
            <div>
              <label htmlFor="extraNote" className="adm-label">
                Catatan Detail (mis. bobot 62 kg)
              </label>
              <input id="extraNote" name="extraNote" className="adm-input" />
            </div>
            <div>
              <label htmlFor="currentStatus" className="adm-label">
                Update Status Subjek (opsional)
              </label>
              <input
                id="currentStatus"
                name="currentStatus"
                placeholder="mis. Pertumbuhan / Siap Potong"
                className="adm-input"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[#4a5568]">
              <input name="isPublic" type="checkbox" className="size-4" defaultChecked />
              Tampilkan di halaman publik
            </label>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              💾 Simpan Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
