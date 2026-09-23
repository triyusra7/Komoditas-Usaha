import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/types/supabase";

export type PublicCategory = Tables<"commodity_categories">;
export type PublicProduct = Tables<"products">;
export type PublicTraceSubject = Tables<"trace_subjects">;
export type PublicTraceEvent = Tables<"trace_events">;
export type PublicSiteSettings = Tables<"site_settings">;
export type PublicContentBlock = Tables<"content_blocks">;

export type LeadPayload = {
  name: string;
  contact: string;
  message?: string;
  interest?: string;
  sourcePage?: string;
};

const LEGACY_SLUG_REMAP: Record<
  string,
  {
    name: string;
    slug: string;
    breed: string;
    short_desc: string;
    description: string;
    price_numeric: number;
    unit: string;
    price_visible: boolean;
    availability: "available" | "preorder" | "sold_out";
  }
> = {
  "karkas-babi-duroc": {
    name: "Jagung Pipil Kering Pakan (Grade A)",
    slug: "jagung-pipil-kering-grade-a",
    breed: "NK 212 / P35",
    short_desc: "Kadar air terjamin < 14%, aflatoksin < 20 ppb, bersih bebas jamur & kutu.",
    description:
      "Jagung pipil pakan ternak kualitas super hasil budidaya petani mitra binaan Sulawesi. Melalui proses pengeringan modern dan silo terkontrol untuk menjamin nutrisi dan keamanan pakan ternak.",
    price_numeric: 5200,
    unit: "kg",
    price_visible: true,
    availability: "available",
  },
  "daging-babi-potongan-komersial": {
    name: "Jagung Pipil Curah Kualitas Super",
    slug: "jagung-pipil-curah-super",
    breed: "PIONEER P35",
    short_desc: "Kadar air < 14.5%, protein kasar 8.8%, siap pasok feed mill dan peternak.",
    description:
      "Jagung pipil curah berkualitas tinggi dengan kadar air rendah, ideal untuk pasokan rutin industri feed mill dan ransum peternakan unggas maupun ruminansia.",
    price_numeric: 5000,
    unit: "kg",
    price_visible: true,
    availability: "available",
  },
  "babi-hidup-siap-potong": {
    name: "Kopi Arabika Toraja Sapan Specialty",
    slug: "kopi-arabika-toraja-sapan",
    breed: "TYPICA / S795",
    short_desc: "Single origin 1.650 mdpl, petik merah 100%, cupping score 86.75, fully washed.",
    description:
      "Biji kopi mentah (green bean) pilihan dari lereng Gunung Sesean, Tana Toraja. Diproses fully washed dengan fermentasi terkontrol dan penjemuran di atas raised beds.",
    price_numeric: 125000,
    unit: "kg",
    price_visible: true,
    availability: "available",
  },
  "bibit-weaner-crossbreed-f1": {
    name: "Kopi Robusta Enrekang Grade 1",
    slug: "kopi-robusta-enrekang-grade-1",
    breed: "ROBUSTA FINE",
    short_desc: "Petik merah dataran sedang 800 mdpl, aroma cokelat tebal & body kuat.",
    description:
      "Kopi robusta kualitas prima dari pegunungan Enrekang Sulawesi dengan profil rasa bold chocolate dan tingkat keasaman lembut.",
    price_numeric: 65000,
    unit: "kg",
    price_visible: false,
    availability: "preorder",
  },
};

const REVERSE_SLUG_LOOKUP: Record<string, string> = {
  "jagung-pipil-kering-grade-a": "karkas-babi-duroc",
  "jagung-pipil-curah-super": "daging-babi-potongan-komersial",
  "kopi-arabika-toraja-sapan": "babi-hidup-siap-potong",
  "kopi-robusta-enrekang-grade-1": "bibit-weaner-crossbreed-f1",
};

function sanitizeProduct(p: PublicProduct): PublicProduct {
  const slugLower = p.slug.toLowerCase();
  const nameLower = p.name.toLowerCase();

  if (LEGACY_SLUG_REMAP[slugLower]) {
    const remap = LEGACY_SLUG_REMAP[slugLower];
    return {
      ...p,
      ...remap,
    };
  }

  const isPig =
    nameLower.includes("babi") ||
    slugLower.includes("babi") ||
    (p.breed && p.breed.toLowerCase().includes("duroc")) ||
    (p.breed && p.breed.toLowerCase().includes("crossbreed"));

  if (!isPig) return p;

  return {
    ...p,
    name: "Jagung Pipil Kering Pakan Ternak",
    slug: "jagung-pipil-kering-grade-a",
    breed: "NK 212 / P35",
    short_desc: "Kadar air terjamin < 14%, aflatoksin < 20 ppb, siap pasok pabrik pakan.",
    price_numeric: 5200,
    unit: "kg",
    price_visible: true,
    availability: "available",
  };
}

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

    return data.map((c) => {
      if (c.slug === "babi" || c.name.toLowerCase().includes("babi")) {
        return {
          ...c,
          name: "Jagung Pakan",
          slug: "jagung",
          description:
            c.description && !c.description.toLowerCase().includes("babi")
              ? c.description
              : "Komoditas jagung pipil kering berkualitas tinggi dari sentra pertanian Sulawesi untuk industri pakan ternak (feed mill) & peternak mandiri.",
        };
      }
      return c;
    });
  }

  async getProducts(options?: { categorySlug?: string }): Promise<PublicProduct[]> {
    let query = this.supabase
      .from("products")
      .select("*, commodity_categories!inner(slug)")
      .eq("is_public", true);

    if (options?.categorySlug) {
      if (options.categorySlug === "jagung" || options.categorySlug === "babi") {
        query = query.in("commodity_categories.slug", ["jagung", "babi"]);
      } else {
        query = query.eq("commodity_categories.slug", options.categorySlug);
      }
    }

    const { data, error } = await query
      .order("sort", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) throw new Error(`Failed to load products: ${error?.message}`);
    return data.map(sanitizeProduct);
  }

  async getFeaturedProducts(limit = 4): Promise<PublicProduct[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("is_public", true)
      .order("sort", { ascending: true })
      .limit(limit);
    if (error || !data) throw new Error(`Failed to load featured products: ${error?.message}`);
    return data.map(sanitizeProduct);
  }

  async getProductBySlug(slug: string): Promise<PublicProduct | null> {
    const slugsToTry = [slug];
    if (REVERSE_SLUG_LOOKUP[slug]) {
      slugsToTry.push(REVERSE_SLUG_LOOKUP[slug]);
    }

    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .in("slug", slugsToTry)
      .eq("is_public", true)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(`Failed to load product: ${error.message}`);
    return data ? sanitizeProduct(data) : null;
  }

  /** Ordered blocks for an editable page (home/about). Empty array if page not public. */
  async getPageBlocks(pageSlug: string): Promise<PublicContentBlock[]> {
    const { data: page, error: pageError } = await this.supabase
      .from("page_contents")
      .select("id")
      .eq("slug", pageSlug)
      .eq("is_public", true)
      .maybeSingle();
    if (pageError) throw new Error(`Failed to load page: ${pageError.message}`);
    if (!page) return [];

    const { data: blocks, error: blocksError } = await this.supabase
      .from("content_blocks")
      .select("*")
      .eq("page_id", page.id)
      .order("sort_order", { ascending: true });
    if (blocksError) throw new Error(`Failed to load blocks: ${blocksError.message}`);
    return blocks ?? [];
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
      .order("happened_at", { ascending: true })
      .order("sort", { ascending: true });

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
          .order("happened_at", { ascending: true })
          .order("sort", { ascending: true });
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
      interest: payload.interest ?? null,
      source_page: payload.sourcePage ?? null,
    });
    if (error) throw new Error(`Failed to submit lead: ${error.message}`);
  }
}
