"use client";

import { useActionState } from "react";

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
import { Textarea } from "@/components/ui/textarea";

import { submitLead } from "./actions";

export function LeadForm() {
  const [state, formAction, isPending] = useActionState(submitLead, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <p className="text-2xl" aria-hidden="true">
          ✅
        </p>
        <p className="mt-2 font-heading text-lg font-bold">Pesan terkirim!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Terima kasih. Kami akan menghubungi Anda secepatnya.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <Label htmlFor="name">Nama *</Label>
        <Input id="name" name="name" required placeholder="Nama lengkap Anda" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Kontak (WhatsApp/Email) *</Label>
        <Input id="contact" name="contact" required placeholder="08xx atau email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interest">Minat</Label>
        <Select name="interest">
          <SelectTrigger id="interest">
            <SelectValue placeholder="Pilih minat Anda (opsional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beli-produk">Beli produk</SelectItem>
            <SelectItem value="pasokan-rutin">Pasokan rutin / katering</SelectItem>
            <SelectItem value="kemitraan">Kemitraan</SelectItem>
            <SelectItem value="investasi">Investasi</SelectItem>
            <SelectItem value="lainnya">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Pesan *</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Ceritakan kebutuhan Anda..."
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
