export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_content: {
        Row: {
          content: Json
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          poi_position: number
          poi_type: string
          points: number | null
          position_data: Json
          title: string
          tour_id: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          poi_position: number
          poi_type: string
          points?: number | null
          position_data: Json
          title: string
          tour_id: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          poi_position?: number
          poi_type?: string
          points?: number | null
          position_data?: Json
          title?: string
          tour_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_content_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_user_progress: {
        Row: {
          completed_at: string | null
          daily_content_id: string
          id: string
          interaction_data: Json | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          daily_content_id: string
          id?: string
          interaction_data?: Json | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          daily_content_id?: string
          id?: string
          interaction_data?: Json | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_user_progress_daily_content_id_fkey"
            columns: ["daily_content_id"]
            isOneToOne: false
            referencedRelation: "daily_content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "daily_user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hotspots: {
        Row: {
          contenido: string | null
          created_at: string | null
          id: string
          media: Json | null
          opciones: Json | null
          pitch: number
          puntos: number | null
          scene: string
          tipo: string
          titulo: string
          tour_id: string | null
          yaw: number
        }
        Insert: {
          contenido?: string | null
          created_at?: string | null
          id?: string
          media?: Json | null
          opciones?: Json | null
          pitch: number
          puntos?: number | null
          scene: string
          tipo: string
          titulo: string
          tour_id?: string | null
          yaw: number
        }
        Update: {
          contenido?: string | null
          created_at?: string | null
          id?: string
          media?: Json | null
          opciones?: Json | null
          pitch?: number
          puntos?: number | null
          scene?: string
          tipo?: string
          titulo?: string
          tour_id?: string | null
          yaw?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotspots_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      multimedia: {
        Row: {
          descripcion: string | null
          id: number
          poi_id: number
          tipo: Database["public"]["Enums"]["multimedia_tipo"]
          url: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          poi_id: number
          tipo: Database["public"]["Enums"]["multimedia_tipo"]
          url: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          poi_id?: number
          tipo?: Database["public"]["Enums"]["multimedia_tipo"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "multimedia_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
        ]
      }
      oficinas: {
        Row: {
          address: string | null
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: never
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: never
          name?: string
        }
        Relationships: []
      }
      pois: {
        Row: {
          activo: boolean | null
          fecha_asignacion: string
          id: number
          oficina_id: number
          posicion: Json | null
          tipo: Database["public"]["Enums"]["poi_tipo"]
        }
        Insert: {
          activo?: boolean | null
          fecha_asignacion?: string
          id?: number
          oficina_id: number
          posicion?: Json | null
          tipo: Database["public"]["Enums"]["poi_tipo"]
        }
        Update: {
          activo?: boolean | null
          fecha_asignacion?: string
          id?: number
          oficina_id?: number
          posicion?: Json | null
          tipo?: Database["public"]["Enums"]["poi_tipo"]
        }
        Relationships: []
      }
      preguntas: {
        Row: {
          explicacion: string | null
          id: number
          opciones: Json
          poi_id: number
          respuesta_correcta: string
          texto: string
        }
        Insert: {
          explicacion?: string | null
          id?: number
          opciones: Json
          poi_id: number
          respuesta_correcta: string
          texto: string
        }
        Update: {
          explicacion?: string | null
          id?: number
          opciones?: Json
          poi_id?: number
          respuesta_correcta?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "preguntas_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          descripcion: string | null
          id: number
          nombre: string
          poi_id: number
          puntos_otorgados: number
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre: string
          poi_id: number
          puntos_otorgados?: number
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre?: string
          poi_id?: number
          puntos_otorgados?: number
        }
        Relationships: [
          {
            foreignKeyName: "productos_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          created_at: string | null
          hotspot_id: string | null
          id: string
          puntos: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          hotspot_id?: string | null
          id?: string
          puntos: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          hotspot_id?: string | null
          id?: string
          puntos?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_hotspot_id_fkey"
            columns: ["hotspot_id"]
            isOneToOne: false
            referencedRelation: "hotspots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          activo: boolean
          ciudad: string
          competition_end: string | null
          competition_start: string | null
          created_at: string
          descripcion: string | null
          id: string
          imagen_portada: string | null
          nombre: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          ciudad: string
          competition_end?: string | null
          competition_start?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_portada?: string | null
          nombre: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          ciudad?: string
          competition_end?: string | null
          competition_start?: string | null
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_portada?: string | null
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      }
      usuario_poi: {
        Row: {
          completado: boolean | null
          fecha: string | null
          poi_id: number
          puntos_obtenidos: number | null
          usuario_id: number
        }
        Insert: {
          completado?: boolean | null
          fecha?: string | null
          poi_id: number
          puntos_obtenidos?: number | null
          usuario_id: number
        }
        Update: {
          completado?: boolean | null
          fecha?: string | null
          poi_id?: number
          puntos_obtenidos?: number | null
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "usuario_poi_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_poi_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          email: string | null
          id: number
          nombre: string | null
          progreso: Json | null
          puntos_totales: number
          racha_dias: number
        }
        Insert: {
          email?: string | null
          id?: number
          nombre?: string | null
          progreso?: Json | null
          puntos_totales?: number
          racha_dias?: number
        }
        Update: {
          email?: string | null
          id?: number
          nombre?: string | null
          progreso?: Json | null
          puntos_totales?: number
          racha_dias?: number
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          posicion: number | null
          total_puntos: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      multimedia_tipo: "foto" | "video"
      poi_tipo: "test" | "multimedia" | "reseña" | "producto"
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
      multimedia_tipo: ["foto", "video"],
      poi_tipo: ["test", "multimedia", "reseña", "producto"],
    },
  },
} as const
