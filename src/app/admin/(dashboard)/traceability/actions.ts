"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth/access-control";
import { TraceabilityService } from "@/lib/services/traceability-service";
import { createClient } from "@/lib/supabase/server";

const createSubjectSchema = z.object({
  code: z.string().min(2),
  publicSlug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  title: z.string().min(2),
  commodityType: z.enum(["pig", "coffee", "fishery"]),
});

export async function createSubject(formData: FormData): Promise<void> {
  const user = await requireRole("owner", "staff");

  const parsed = createSubjectSchema.parse({
    code: formData.get("code"),
    publicSlug: formData.get("publicSlug"),
    title: formData.get("title"),
    commodityType: formData.get("commodityType"),
  });

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  await traceability.createSubject({
    code: parsed.code,
    public_slug: parsed.publicSlug,
    title: parsed.title,
    commodity_type: parsed.commodityType,
    created_by: user.id,
  });

  revalidatePath("/admin/traceability");
}

export async function toggleSubjectPublic(id: string, isPublic: boolean): Promise<void> {
  await requireRole("owner", "staff");
  const supabase = await createClient();
  const { error } = await supabase
    .from("trace_subjects")
    .update({ is_public: isPublic })
    .eq("id", id);
  if (error) throw new Error(`Failed to toggle subject: ${error.message}`);
  revalidatePath("/admin/traceability");
}

const PIG_EVENT_TYPES = [
  "acquisition",
  "transport",
  "housing",
  "growth",
  "health",
  "ready_slaughter",
] as const;

const createEventSchema = z.object({
  subjectId: z.string().uuid(),
  eventType: z.enum(PIG_EVENT_TYPES),
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  happenedAt: z.string().min(1),
  extraNote: z.string().optional(),
  isPublic: z.coerce.boolean(),
  currentStatus: z.string().optional(),
});

export async function createEvent(formData: FormData): Promise<void> {
  const user = await requireRole("owner", "staff");

  const parsed = createEventSchema.parse({
    subjectId: formData.get("subjectId"),
    eventType: formData.get("eventType"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    location: formData.get("location") || undefined,
    happenedAt: formData.get("happenedAt"),
    extraNote: formData.get("extraNote") || undefined,
    isPublic: formData.get("isPublic") === "on",
    currentStatus: formData.get("currentStatus") || undefined,
  });

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  await traceability.createEvent({
    subject_id: parsed.subjectId,
    event_type: parsed.eventType,
    title: parsed.title,
    description: parsed.description ?? null,
    location: parsed.location ?? null,
    happened_at: parsed.happenedAt,
    meta: parsed.extraNote ? { catatan: parsed.extraNote } : {},
    is_public: parsed.isPublic,
    created_by: user.id,
  });

  if (parsed.currentStatus) {
    await supabase
      .from("trace_subjects")
      .update({ current_status: parsed.currentStatus })
      .eq("id", parsed.subjectId);
  }

  revalidatePath(`/admin/traceability/${parsed.subjectId}`);
  revalidatePath("/admin/traceability");
}
