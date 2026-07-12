import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables, TablesInsert } from "@/types/supabase";

export type TraceSubject = Tables<"trace_subjects">;
export type TraceEvent = Tables<"trace_events">;

/** CRUD for trace subjects + events. Generic across commodity_type. */
export class TraceabilityService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async listSubjects(): Promise<TraceSubject[]> {
    const { data, error } = await this.supabase
      .from("trace_subjects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) throw new Error(`Failed to list trace subjects: ${error?.message}`);
    return data;
  }

  async getSubjectByPublicSlug(publicSlug: string): Promise<TraceSubject | null> {
    const { data, error } = await this.supabase
      .from("trace_subjects")
      .select("*")
      .eq("public_slug", publicSlug)
      .maybeSingle();
    if (error) throw new Error(`Failed to load trace subject: ${error.message}`);
    return data;
  }

  async createSubject(input: TablesInsert<"trace_subjects">): Promise<void> {
    const { error } = await this.supabase.from("trace_subjects").insert(input);
    if (error) throw new Error(`Failed to create trace subject: ${error.message}`);
  }

  /** Events are always returned ordered by happened_at ascending — the timeline order. */
  async listEvents(subjectId: string): Promise<TraceEvent[]> {
    const { data, error } = await this.supabase
      .from("trace_events")
      .select("*")
      .eq("subject_id", subjectId)
      .order("happened_at", { ascending: true });
    if (error || !data) throw new Error(`Failed to list trace events: ${error?.message}`);
    return data;
  }

  async createEvent(input: TablesInsert<"trace_events">): Promise<void> {
    const { error } = await this.supabase.from("trace_events").insert(input);
    if (error) throw new Error(`Failed to create trace event: ${error.message}`);
  }
}
