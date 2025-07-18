export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      case_studies: {
        Row: {
          description: string | null
          has_detail_page: boolean | null
          id: number
          impact: string | null
          industry: string | null
          slug: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          industry?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          industry?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          expires: number | null
          id: number
          issuer: string | null
          link: string | null
          status: string | null
          title: string | null
          year: number
        }
        Insert: {
          expires?: number | null
          id?: number
          issuer?: string | null
          link?: string | null
          status?: string | null
          title?: string | null
          year: number
        }
        Update: {
          expires?: number | null
          id?: number
          issuer?: string | null
          link?: string | null
          status?: string | null
          title?: string | null
          year?: number
        }
        Relationships: []
      }
      dashboards: {
        Row: {
          description: string | null
          has_detail_page: boolean | null
          id: number
          impact: string | null
          slug: string | null
          status: string | null
          title: string | null
          tools: string[] | null
        }
        Insert: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          tools?: string[] | null
        }
        Update: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          tools?: string[] | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          date_end: string | null
          date_start: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date_end?: string | null
          date_start: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date_end?: string | null
          date_start?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_notes: {
        Row: {
          admin_comments: string | null
          category: string
          content: Json
          created_at: string | null
          date: string
          excerpt: string
          id: string
          published: boolean | null
          read_time: string
          tab_config: Json | null
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          admin_comments?: string | null
          category: string
          content: Json
          created_at?: string | null
          date: string
          excerpt: string
          id?: string
          published?: boolean | null
          read_time: string
          tab_config?: Json | null
          tags: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          admin_comments?: string | null
          category?: string
          content?: Json
          created_at?: string | null
          date?: string
          excerpt?: string
          id?: string
          published?: boolean | null
          read_time?: string
          tab_config?: Json | null
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string | null
          id: number
          name: string | null
          newsletter_type: string | null
          subscribed_at: string
        }
        Insert: {
          email?: string | null
          id?: number
          name?: string | null
          newsletter_type?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string | null
          id?: number
          name?: string | null
          newsletter_type?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: string | null
          has_detail_page: boolean | null
          id: number
          impact: string | null
          slug: string | null
          status: string | null
          tech: string[] | null
          title: string | null
        }
        Insert: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          slug?: string | null
          status?: string | null
          tech?: string[] | null
          title?: string | null
        }
        Update: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          impact?: string | null
          slug?: string | null
          status?: string | null
          tech?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      publications: {
        Row: {
          description: string | null
          has_detail_page: boolean | null
          id: number
          journal: string | null
          link: string | null
          slug: string | null
          status: string | null
          title: string | null
          year: number | null
        }
        Insert: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          journal?: string | null
          link?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          year?: number | null
        }
        Update: {
          description?: string | null
          has_detail_page?: boolean | null
          id?: number
          journal?: string | null
          link?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          year?: number | null
        }
        Relationships: []
      }
      todo_items: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          list_id: string
          text: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          list_id: string
          text: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          list_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "todo_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
