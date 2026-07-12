import Link from "next/link";

import { CreateButton, FormModal } from "@/components/admin/modal";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { TraceabilityService } from "@/lib/services/traceability-service";
import { createClient } from "@/lib/supabase/server";

import { createSubject, toggleSubjectPublic } from "./actions";

const COMMODITY_LABEL: Record<string, string> = {
  pig: "🐖 Babi",
  coffee: "☕ Kopi",
  fishery: "🐟 Perikanan",
};

export default async function TraceabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  await requireRole("owner", "staff");
  const { new: isCreating } = await searchParams;

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  const subjects = await traceability.listSubjects();

  return (
    <div>
      <PageHeader
        title="Traceability"
        subtitle="Subjek jejak — 1 ekor atau 1 batch per subjek"
        actions={<CreateButton label="Subjek Baru" />}
      />

      {isCreating && (
        <FormModal
          title="Subjek Jejak Baru"
          subtitle="Buat 1 subjek untuk 1 ekor atau 1 batch"
          closeHref="/admin/traceability"
        >
          <form action={createSubject} className="space-y-4">
            <div>
              <label htmlFor="code" className="adm-label">
                Kode Internal
              </label>
              <input id="code" name="code" required placeholder="BABI-2026-015" className="adm-input" />
            </div>
            <div>
              <label htmlFor="title" className="adm-label">
                Judul (tampil di publik)
              </label>
              <input id="title" name="title" required placeholder="Babi Duroc #015" className="adm-input" />
            </div>
            <div>
              <label htmlFor="publicSlug" className="adm-label">
                Slug Publik (URL /jejak/...)
              </label>
              <input id="publicSlug" name="publicSlug" required placeholder="babi-2026-015" className="adm-input" />
            </div>
            <div>
              <label htmlFor="commodityType" className="adm-label">
                Jenis Komoditas
              </label>
              <select id="commodityType" name="commodityType" defaultValue="pig" className="adm-input">
                <option value="pig">🐖 Babi</option>
                <option value="coffee">☕ Kopi</option>
                <option value="fishery">🐟 Perikanan</option>
              </select>
            </div>
            <button type="submit" className="adm-btn adm-btn-primary w-full justify-center">
              Buat Subjek
            </button>
          </form>
        </FormModal>
      )}

      <div className="adm-card p-5">
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Status Terkini</th>
                <th>Publik</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="font-bold">{subject.code}</td>
                  <td>{subject.title ?? "-"}</td>
                  <td>{COMMODITY_LABEL[subject.commodity_type] ?? subject.commodity_type}</td>
                  <td>
                    {subject.current_status ? (
                      <span className="adm-badge adm-badge-amber">{subject.current_status}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <form action={toggleSubjectPublic.bind(null, subject.id, !subject.is_public)}>
                      <button
                        type="submit"
                        className={`adm-badge ${subject.is_public ? "adm-badge-green" : "adm-badge-gray"} cursor-pointer`}
                      >
                        {subject.is_public ? "Publik" : "Draft"}
                      </button>
                    </form>
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/admin/traceability/${subject.id}`}
                      className="adm-btn adm-btn-outline adm-btn-sm"
                    >
                      Kelola Jejak
                    </Link>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Belum ada subjek jejak. Klik &ldquo;Subjek Baru&rdquo; untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
