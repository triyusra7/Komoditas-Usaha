import { notFound } from "next/navigation";

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
import { requireRole } from "@/lib/auth/access-control";
import { TraceabilityService } from "@/lib/services/traceability-service";
import { createClient } from "@/lib/supabase/server";

import { createEvent } from "../actions";

const EVENT_TYPE_LABEL: Record<string, string> = {
  acquisition: "Akuisisi Bibit",
  transport: "Transportasi",
  housing: "Penempatan Kandang",
  growth: "Pertumbuhan/Kesehatan",
  ready: "Siap Potong/Karkas",
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
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">{subject.code}</h1>
        <p className="text-sm text-muted-foreground">
          Slug publik: /traceability/{subject.public_slug}
        </p>
      </div>

      <ol className="space-y-4 border-l border-border pl-6">
        {events.map((event) => (
          <li key={event.id} className="relative">
            <span className="absolute -left-[1.65rem] top-1.5 size-2.5 rounded-full bg-primary" />
            <p className="text-xs text-muted-foreground">
              {new Date(event.happened_at).toLocaleDateString("id-ID")} ·{" "}
              {EVENT_TYPE_LABEL[event.event_type] ?? event.event_type} ·{" "}
              {event.is_public ? "Publik" : "Draft"}
            </p>
            <p className="font-medium">{event.title}</p>
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
            {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
          </li>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada event tercatat.</p>
        )}
      </ol>

      <div className="max-w-md space-y-4 rounded-lg border border-border p-6">
        <h2 className="font-heading text-lg font-semibold">Tambah Event</h2>
        <form action={createEvent} className="space-y-4">
          <input type="hidden" name="subjectId" value={subject.id} />
          <div className="space-y-2">
            <Label htmlFor="eventType">Jenis Event</Label>
            <Select name="eventType" defaultValue="acquisition">
              <SelectTrigger id="eventType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPE_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" name="title" required placeholder="Akuisisi bibit dari peternak X" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="happenedAt">Tanggal</Label>
            <Input id="happenedAt" name="happenedAt" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" name="location" placeholder="Palopo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <input id="isPublic" name="isPublic" type="checkbox" className="size-4" />
            <Label htmlFor="isPublic">Tampilkan di halaman publik</Label>
          </div>
          <Button type="submit">Simpan Event</Button>
        </form>
      </div>
    </div>
  );
}
