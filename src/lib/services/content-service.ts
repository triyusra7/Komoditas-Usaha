import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Enums, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type CommodityCategory = Tables<"commodity_categories">;
export type Product = Tables<"products">;
export type SiteSettings = Tables<"site_settings">;
export type Lead = Tables<"leads">;

/** CRUD for site settings, categories, products, and leads — the CMS layer. */
export class ContentService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await this.supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .single();
    if (error || !data) throw new Error(`Failed to load site settings: ${error?.message}`);
    return data;
  }

  async updateSiteSettings(input: TablesUpdate<"site_settings">): Promise<void> {
    const { error } = await this.supabase.from("site_settings").update(input).eq("id", true);
    if (error) throw new Error(`Failed to update site settings: ${error.message}`);
  }

  async listCategories(): Promise<CommodityCategory[]> {
    const { data, error } = await this.supabase
      .from("commodity_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data) throw new Error(`Failed to list categories: ${error?.message}`);
    return data;
  }

  async createCategory(input: TablesInsert<"commodity_categories">): Promise<void> {
    const { error } = await this.supabase.from("commodity_categories").insert(input);
    if (error) throw new Error(`Failed to create category: ${error.message}`);
  }

  async updateCategory(id: string, input: TablesUpdate<"commodity_categories">): Promise<void> {
    const { error } = await this.supabase
      .from("commodity_categories")
      .update(input)
      .eq("id", id);
    if (error) throw new Error(`Failed to update category: ${error.message}`);
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase.from("commodity_categories").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete category: ${error.message}`);
  }

  async listProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) throw new Error(`Failed to list products: ${error?.message}`);
    return data;
  }

  async createProduct(input: TablesInsert<"products">): Promise<void> {
    const { error } = await this.supabase.from("products").insert(input);
    if (error) throw new Error(`Failed to create product: ${error.message}`);
  }

  async updateProduct(id: string, input: TablesUpdate<"products">): Promise<void> {
    const { error } = await this.supabase.from("products").update(input).eq("id", id);
    if (error) throw new Error(`Failed to update product: ${error.message}`);
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete product: ${error.message}`);
  }

  async listLeads(): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) throw new Error(`Failed to list leads: ${error?.message}`);
    return data;
  }
}

export type ProductStatus = Enums<"product_status">;
export type CategoryStatus = Enums<"category_status">;
export type CommodityType = Enums<"commodity_type">;
