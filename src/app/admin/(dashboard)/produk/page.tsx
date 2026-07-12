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

import { createProduct, deleteProduct, togglePriceVisible, toggleProductPublic } from "./actions";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
}

export default async function ProdukPage() {
  await requireRole("owner", "staff");

  const supabase = await createClient();
  const content = new ContentService(supabase);
  const [products, categories] = await Promise.all([
    content.listProducts(),
    content.listCategories(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Produk</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Harga Tampil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publik</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                {product.price_numeric != null ? formatRupiah(product.price_numeric) : "-"}
              </TableCell>
              <TableCell>
                <form action={togglePriceVisible.bind(null, product.id, !product.price_visible)}>
                  <Button type="submit" size="sm" variant="outline">
                    {product.price_visible ? "Tampil" : "Sembunyi"}
                  </Button>
                </form>
              </TableCell>
              <TableCell>
                <Badge variant={product.status === "published" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>
                <form action={toggleProductPublic.bind(null, product.id, !product.is_public)}>
                  <Button type="submit" size="sm" variant={product.is_public ? "default" : "outline"}>
                    {product.is_public ? "Publik" : "Draft"}
                  </Button>
                </form>
              </TableCell>
              <TableCell className="text-right">
                <form action={deleteProduct.bind(null, product.id)}>
                  <Button type="submit" size="sm" variant="ghost" className="text-destructive">
                    Hapus
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada produk.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="max-w-md space-y-4 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold">Tambah Produk</h2>
        <form action={createProduct} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Kategori</Label>
            <Select name="categoryId" required>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" name="name" required placeholder="Karkas Babi Duroc" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required placeholder="karkas-babi-duroc" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Satuan</Label>
            <Input id="unit" name="unit" placeholder="kg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceNumeric">Harga (Rp)</Label>
            <Input id="priceNumeric" name="priceNumeric" type="number" min={0} step="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input id="description" name="description" />
          </div>
          <Button type="submit">Simpan Produk</Button>
        </form>
      </div>
    </div>
  );
}
