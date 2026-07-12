"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitLead } from "./actions";

export function LeadForm() {
  const [state, formAction, isPending] = useActionState(submitLead, undefined);

  if (state?.success) {
    return (
      <p className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
        Terima kasih! Pesan Anda sudah kami terima dan akan segera kami tindak lanjuti.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Kontak (WhatsApp/Email)</Label>
        <Input id="contact" name="contact" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Pesan</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
