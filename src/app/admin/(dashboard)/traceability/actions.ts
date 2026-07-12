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
  commodityType: z.enum(["babi", "kopi", "perikanan"]),
});

export async function createSubject(formData: FormData): Promise<void> {
  const user = await requireRole("owner", "staff");

  const parsed = createSubjectSchema.parse({
    code: formData.get("code"),
    publicSlug: formData.get("publicSlug"),
    commodityType: formData.get("commodityType"),
  });

  const supabase = await createClient();
  const traceability = new TraceabilityService(supabase);
  await traceability.createSubject({
    code: parsed.code,
    public_slug: parsed.publicSlug,
    commodity_type: parsed.commodityType,
    created_by: user.id,
  });

  revalidatePath("/admin/traceability");
}

const createEventSchema = z.object({
  subjectId: z.string().uuid(),
  eventType: z.enum(["acquisition", "transport", "housing", "growth", "ready"]),
  title: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  happenedAt: z.string().min(1),
  isPublic: z.coerce.boolean(),
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
    isPublic: formData.get("isPublic") === "on",
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
    is_public: parsed.isPublic,
    created_by: user.id,
  });

  revalidatePath(`/admin/traceability/${parsed.subjectId}`);
}
