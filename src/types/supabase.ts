export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          normal_side: Database["public"]["Enums"]["normal_side"]
          parent_id: string | null
          type: Database["public"]["Enums"]["account_type"]
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          normal_side: Database["public"]["Enums"]["normal_side"]
          parent_id?: string | null
          type: Database["public"]["Enums"]["account_type"]
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          normal_side?: Database["public"]["Enums"]["normal_side"]
          parent_id?: string | null
          type?: Database["public"]["Enums"]["account_type"]
        }
        Relationships: [
          {
            foreignKeyName: "accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_loans: {
        Row: {
          created_at: string
          id: string
          interest_rate: number
          lender: string
          outstanding_principal: number
          principal: number
          start_date: string
          term_months: number
        }
        Insert: {
          created_at?: string
          id?: string
          interest_rate: number
          lender: string
          outstanding_principal: number
          principal: number
          start_date: string
          term_months: number
        }
        Update: {
          created_at?: string
          id?: string
          interest_rate?: number
          lender?: string
          outstanding_principal?: number
          principal?: number
          start_date?: string
          term_months?: number
        }
        Relationships: []
      }
      commodity_categories: {
        Row: {
          commodity_type: Database["public"]["Enums"]["commodity_type"]
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["category_status"]
          updated_at: string
        }
        Insert: {
          commodity_type: Database["public"]["Enums"]["commodity_type"]
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Update: {
          commodity_type?: Database["public"]["Enums"]["commodity_type"]
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["category_status"]
          updated_at?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          block_type: string
          content: Json
          created_at: string
          id: string
          page_id: string
          sort_order: number
        }
        Insert: {
          block_type: string
          content?: Json
          created_at?: string
          id?: string
          page_id: string
          sort_order?: number
        }
        Update: {
          block_type?: string
          content?: Json
          created_at?: string
          id?: string
          page_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page_contents"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      fixed_assets: {
        Row: {
          accumulated_depreciation: number
          acquisition_cost: number
          acquisition_date: string
          created_at: string
          depreciation_method: string
          id: string
          name: string
          useful_life_months: number
        }
        Insert: {
          accumulated_depreciation?: number
          acquisition_cost: number
          acquisition_date: string
          created_at?: string
          depreciation_method?: string
          id?: string
          name: string
          useful_life_months: number
        }
        Update: {
          accumulated_depreciation?: number
          acquisition_cost?: number
          acquisition_date?: string
          created_at?: string
          depreciation_method?: string
          id?: string
          name?: string
          useful_life_months?: number
        }
        Relationships: []
      }
      investors: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
          ownership_percent: number | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
          ownership_percent?: number | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
          ownership_percent?: number | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          created_by: string | null
          entry_date: string
          id: string
          memo: string | null
          reversed_entry_id: string | null
          source_id: string | null
          source_type: string | null
          status: Database["public"]["Enums"]["journal_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entry_date: string
          id?: string
          memo?: string | null
          reversed_entry_id?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["journal_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entry_date?: string
          id?: string
          memo?: string | null
          reversed_entry_id?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["journal_status"]
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "journal_entries_reversed_entry_id_fkey"
            columns: ["reversed_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_lines: {
        Row: {
          account_id: string
          created_at: string
          credit: number
          debit: number
          entry_id: string
          id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          credit?: number
          debit?: number
          entry_id: string
          id?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          credit?: number
          debit?: number
          entry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          contact: string
          created_at: string
          id: string
          interest: string | null
          message: string | null
          name: string
          source_page: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          interest?: string | null
          message?: string | null
          name: string
          source_page?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          interest?: string | null
          message?: string | null
          name?: string
          source_page?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt: string | null
          bucket: string
          created_at: string
          created_by: string | null
          id: string
          path: string
          product_id: string | null
        }
        Insert: {
          alt?: string | null
          bucket?: string
          created_at?: string
          created_by?: string | null
          id?: string
          path: string
          product_id?: string | null
        }
        Update: {
          alt?: string | null
          bucket?: string
          created_at?: string
          created_by?: string | null
          id?: string
          path?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "media_assets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      page_contents: {
        Row: {
          id: string
          is_public: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          id?: string
          is_public?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_public?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          availability: Database["public"]["Enums"]["product_availability"]
          breed: string | null
          category_id: string
          cover_image: string | null
          created_at: string
          created_by: string | null
          description: string | null
          gallery: Json
          id: string
          is_public: boolean
          name: string
          price_numeric: number | null
          price_visible: boolean
          short_desc: string | null
          slug: string
          sort: number
          status: Database["public"]["Enums"]["product_status"]
          unit: string | null
          updated_at: string
        }
        Insert: {
          availability?: Database["public"]["Enums"]["product_availability"]
          breed?: string | null
          category_id: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          gallery?: Json
          id?: string
          is_public?: boolean
          name: string
          price_numeric?: number | null
          price_visible?: boolean
          short_desc?: string | null
          slug: string
          sort?: number
          status?: Database["public"]["Enums"]["product_status"]
          unit?: string | null
          updated_at?: string
        }
        Update: {
          availability?: Database["public"]["Enums"]["product_availability"]
          breed?: string | null
          category_id?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          gallery?: Json
          id?: string
          is_public?: boolean
          name?: string
          price_numeric?: number | null
          price_visible?: boolean
          short_desc?: string | null
          slug?: string
          sort?: number
          status?: Database["public"]["Enums"]["product_status"]
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "commodity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          business_name: string
          email: string | null
          tagline: string | null
          hero_text: string | null
          id: boolean
          logo_url: string | null
          social_links: Json
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string
          email?: string | null
          tagline?: string | null
          hero_text?: string | null
          id?: boolean
          logo_url?: string | null
          social_links?: Json
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          email?: string | null
          tagline?: string | null
          hero_text?: string | null
          id?: boolean
          logo_url?: string | null
          social_links?: Json
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          location: string | null
          name: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
        }
        Relationships: []
      }
      trace_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_type: string
          happened_at: string
          id: string
          is_public: boolean
          location: string | null
          meta: Json
          photo_url: string | null
          sort: number
          subject_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type: string
          happened_at: string
          id?: string
          is_public?: boolean
          location?: string | null
          meta?: Json
          photo_url?: string | null
          sort?: number
          subject_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type?: string
          happened_at?: string
          id?: string
          is_public?: boolean
          location?: string | null
          meta?: Json
          photo_url?: string | null
          sort?: number
          subject_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "trace_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trace_events_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "trace_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      trace_subjects: {
        Row: {
          category_id: string | null
          code: string
          commodity_type: Database["public"]["Enums"]["commodity_type"]
          created_at: string
          created_by: string | null
          current_status: string | null
          id: string
          is_public: boolean
          product_id: string | null
          public_slug: string
          title: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          code: string
          commodity_type: Database["public"]["Enums"]["commodity_type"]
          created_at?: string
          created_by?: string | null
          current_status?: string | null
          id?: string
          is_public?: boolean
          product_id?: string | null
          public_slug: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          code?: string
          commodity_type?: Database["public"]["Enums"]["commodity_type"]
          created_at?: string
          created_by?: string | null
          current_status?: string | null
          id?: string
          is_public?: boolean
          product_id?: string | null
          public_slug?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trace_subjects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "commodity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trace_subjects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trace_subjects_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          counterparty: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          journal_entry_id: string | null
          meta: Json
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          journal_entry_id?: string | null
          meta?: Json
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          counterparty?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          journal_entry_id?: string | null
          meta?: Json
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      account_type: "asset" | "liability" | "equity" | "income" | "expense"
      category_status: "active" | "coming_soon"
      commodity_type: "pig" | "coffee" | "fishery"
      journal_status: "posted" | "void"
      product_availability: "available" | "preorder" | "sold_out"
      normal_side: "debit" | "credit"
      product_status: "draft" | "published" | "archived"
      transaction_type:
        | "sale"
        | "purchase_feed"
        | "purchase_livestock"
        | "purchase_medicine"
        | "purchase_asset"
        | "purchase_service"
        | "investor_contribution"
        | "bank_loan"
        | "loan_repayment"
        | "opex"
        | "depreciation"
        | "manual"
      user_role: "owner" | "staff" | "investor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["asset", "liability", "equity", "income", "expense"],
      category_status: ["active", "coming_soon"],
      commodity_type: ["pig", "coffee", "fishery"],
      journal_status: ["posted", "void"],
      product_availability: ["available", "preorder", "sold_out"],
      normal_side: ["debit", "credit"],
      product_status: ["draft", "published", "archived"],
      transaction_type: [
        "sale",
        "purchase_feed",
        "purchase_livestock",
        "purchase_medicine",
        "purchase_asset",
        "purchase_service",
        "investor_contribution",
        "bank_loan",
        "loan_repayment",
        "opex",
        "depreciation",
        "manual",
      ],
      user_role: ["owner", "staff", "investor"],
    },
  },
} as const
