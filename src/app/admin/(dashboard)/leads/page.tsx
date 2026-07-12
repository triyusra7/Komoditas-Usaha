import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/access-control";
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const leads = await content.listLeads();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Leads</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Pesan</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>{lead.contact}</TableCell>
              <TableCell className="max-w-sm truncate">{lead.message}</TableCell>
              <TableCell>{new Date(lead.created_at).toLocaleDateString("id-ID")}</TableCell>
            </TableRow>
          ))}
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Belum ada leads.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
