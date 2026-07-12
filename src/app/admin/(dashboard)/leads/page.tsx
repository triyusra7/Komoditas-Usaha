import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const leads = await content.listLeads();

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Pesan masuk dari form kontak website — follow up secepatnya"
      />

      <div className="adm-card p-5">
        <div className="overflow-x-auto">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Kontak</th>
                <th>Minat</th>
                <th>Pesan</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="font-semibold">{lead.name}</td>
                  <td>{lead.contact}</td>
                  <td>
                    {lead.interest ? (
                      <span className="adm-badge adm-badge-blue">{lead.interest}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="max-w-md">
                    <p className="line-clamp-2">{lead.message}</p>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Belum ada leads masuk.
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
