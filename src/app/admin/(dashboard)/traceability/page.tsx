import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/access-control";
import { TraceabilityService } from "@/lib/services/traceability-service";
import { createClient } from "@/lib/supabase/server";

import { createSubject } from "./actions";

export default async function TraceabilityPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  const subjects = await traceability.listSubjects();

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Traceability</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publik</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell className="font-medium">{subject.code}</TableCell>
              <TableCell>{subject.commodity_type}</TableCell>
              <TableCell>{subject.current_status ?? "-"}</TableCell>
              <TableCell>{subject.is_public ? "Publik" : "Draft"}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/traceability/${subject.id}`}
                  className={buttonVariants({ size: "sm", variant: "outline" })}
                >
                  Kelola Jejak
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {subjects.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Belum ada subjek jejak.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="max-w-md space-y-4 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold">Tambah Subjek Jejak</h2>
        <form action={createSubject} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode</Label>
            <Input id="code" name="code" required placeholder="BABI-2026-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publicSlug">Slug Publik</Label>
            <Input id="publicSlug" name="publicSlug" required placeholder="babi-2026-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commodityType">Jenis Komoditas</Label>
            <Select name="commodityType" defaultValue="babi">
              <SelectTrigger id="commodityType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="babi">Babi</SelectItem>
                <SelectItem value="kopi">Kopi</SelectItem>
                <SelectItem value="perikanan">Perikanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Buat Subjek</Button>
        </form>
      </div>
    </div>
  );
}
