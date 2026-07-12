import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TraceabilityTimeline } from "@/components/traceability-timeline";
import { PublicDataService } from "@/lib/services/public-data-service";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Traceability ${slug}` };
}

export default async function TraceabilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const publicData = new PublicDataService(supabase);
  const result = await publicData.getTraceabilityBySlug(slug);

  if (!result) notFound();

  const { subject, events } = result;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Traceability
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold">{subject.code}</h1>
      {subject.current_status && (
        <p className="mt-1 text-muted-foreground">Status: {subject.current_status}</p>
      )}

      <div className="mt-10">
        <TraceabilityTimeline
          commodityType={subject.commodity_type}
          stages={events.map((event) => ({
            id: event.id,
            eventType: event.event_type,
            title: event.title,
            description: event.description,
            location: event.location,
            happenedAt: event.happened_at,
          }))}
        />
      </div>
    </div>
  );
}
