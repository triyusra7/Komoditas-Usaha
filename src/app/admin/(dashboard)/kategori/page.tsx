import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ContentService } from "@/lib/services/content-service";
import { createClient } from "@/lib/supabase/server";

import { createCategory, deleteCategory, toggleCategoryPublic } from "./actions";

export default async function KategoriPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const categories = await content.listCategories();

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Kategori Komoditas</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publik</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>{category.commodity_type}</TableCell>
              <TableCell>
                <Badge variant={category.status === "active" ? "default" : "secondary"}>
                  {category.status === "active" ? "Aktif" : "Segera Hadir"}
                </Badge>
              </TableCell>
              <TableCell>
                <form action={toggleCategoryPublic.bind(null, category.id, !category.is_public)}>
                  <Button type="submit" size="sm" variant={category.is_public ? "default" : "outline"}>
                    {category.is_public ? "Publik" : "Draft"}
                  </Button>
                </form>
              </TableCell>
              <TableCell className="text-right">
                <form action={deleteCategory.bind(null, category.id)}>
                  <Button type="submit" size="sm" variant="ghost" className="text-destructive">
                    Hapus
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada kategori.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="max-w-md space-y-4 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold">Tambah Kategori</h2>
        <form action={createCategory} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" required placeholder="Babi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required placeholder="babi" />
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
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" name="description" />
          </div>
          <Button type="submit">Simpan Kategori</Button>
        </form>
      </div>
    </div>
  );
}
