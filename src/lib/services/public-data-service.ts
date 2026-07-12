import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/types/supabase";

export type PublicCategory = Tables<"commodity_categories">;
export type PublicProduct = Tables<"products">;
export type PublicTraceSubject = Tables<"trace_subjects">;
export type PublicTraceEvent = Tables<"trace_events">;
export type PublicSiteSettings = Tables<"site_settings">;

export type LeadPayload = {
  name: string;
  contact: string;
  message?: string;
  sourcePage?: string;
};

/**
 * The only door the public site uses to read data. `is_public` filters are
 * applied here AND enforced again by RLS — two layers, per PRD-1.
 */
export class PublicDataService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSiteSettings(): Promise<PublicSiteSettings> {
    const { data, error } = await this.supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .single();
    if (error || !data) throw new Error(`Failed to load site settings: ${error?.message}`);
    return data;
  }

  async getCategories(): Promise<PublicCategory[]> {
    const { data, error } = await this.supabase
      .from("commodity_categories")
      .select("*")
      .eq("is_public", true)
      .order("sort_order", { ascending: true });
    if (error || !data) throw new Error(`Failed to load categories: ${error?.message}`);
    return data;
  }

  async getProducts(options?: { categorySlug?: string }): Promise<PublicProduct[]> {
    let query = this.supabase.from("products").select("*, commodity_categories!inner(slug)").eq(
      "is_public",
      true,
    );

    if (options?.categorySlug) {
      query = query.eq("commodity_categories.slug", options.categorySlug);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data) throw new Error(`Failed to load products: ${error?.message}`);
    return data;
  }

  async getProductBySlug(slug: string): Promise<PublicProduct | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_public", true)
      .maybeSingle();
    if (error) throw new Error(`Failed to load product: ${error.message}`);
    return data;
  }

  async getTraceabilityBySlug(
    publicSlug: string,
  ): Promise<{ subject: PublicTraceSubject; events: PublicTraceEvent[] } | null> {
    const { data: subject, error: subjectError } = await this.supabase
      .from("trace_subjects")
      .select("*")
      .eq("public_slug", publicSlug)
      .eq("is_public", true)
      .maybeSingle();

    if (subjectError) throw new Error(`Failed to load trace subject: ${subjectError.message}`);
    if (!subject) return null;

    const { data: events, error: eventsError } = await this.supabase
      .from("trace_events")
      .select("*")
      .eq("subject_id", subject.id)
      .eq("is_public", true)
      .order("happened_at", { ascending: true });

    if (eventsError) throw new Error(`Failed to load trace events: ${eventsError.message}`);

    return { subject, events: events ?? [] };
  }

  async getTraceabilityByProduct(
    productId: string,
  ): Promise<{ subject: PublicTraceSubject; events: PublicTraceEvent[] }[]> {
    const { data: subjects, error: subjectsError } = await this.supabase
      .from("trace_subjects")
      .select("*")
      .eq("product_id", productId)
      .eq("is_public", true);

    if (subjectsError) throw new Error(`Failed to load trace subjects: ${subjectsError.message}`);
    if (!subjects || subjects.length === 0) return [];

    const results = await Promise.all(
      subjects.map(async (subject) => {
        const { data: events } = await this.supabase
          .from("trace_events")
          .select("*")
          .eq("subject_id", subject.id)
          .eq("is_public", true)
          .order("happened_at", { ascending: true });
        return { subject, events: events ?? [] };
      }),
    );

    return results;
  }

  async submitLead(payload: LeadPayload): Promise<void> {
    const { error } = await this.supabase.from("leads").insert({
      name: payload.name,
      contact: payload.contact,
      message: payload.message ?? null,
      source_page: payload.sourcePage ?? null,
    });
    if (error) throw new Error(`Failed to submit lead: ${error.message}`);
  }
}
