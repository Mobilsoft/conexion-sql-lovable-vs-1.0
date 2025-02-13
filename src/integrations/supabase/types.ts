export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          apellido: string
          ciudad: string
          created_at: string | null
          direccion: string
          documento: string
          email: string
          estado: string
          id: number
          master_detail: string | null
          nombre: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          apellido: string
          ciudad: string
          created_at?: string | null
          direccion: string
          documento: string
          email: string
          estado: string
          id?: number
          master_detail?: string | null
          nombre: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          ciudad?: string
          created_at?: string | null
          direccion?: string
          documento?: string
          email?: string
          estado?: string
          id?: number
          master_detail?: string | null
          nombre?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          barrio: string | null
          ciudad: string | null
          codigo_ciuu: string | null
          comentarios: string | null
          correo_electronico: string | null
          departamento: string
          descripcion_actividad: string | null
          direccion: string
          direccion_principal: string | null
          dv: string
          email: string
          fecha_actualizacion: string | null
          fecha_constitucion: string | null
          fecha_creacion: string | null
          master_detail: string | null
          municipio: string
          naturaleza_empresa: string | null
          nit: string
          numero_documento: string | null
          pagina_web: string | null
          pais: string | null
          primer_apellido: string | null
          primer_nombre: string | null
          razon_social: string
          regimen_tributario: string | null
          responsabilidad_fiscal: string | null
          segundo_apellido: string | null
          segundo_nombre: string | null
          sucursales: boolean | null
          telefono: string
          telefono_fijo: string | null
          telefono_movil: string | null
          tipo_contribuyente: string
          tipo_documento: string | null
          tipo_empresa: string | null
        }
        Insert: {
          barrio?: string | null
          ciudad?: string | null
          codigo_ciuu?: string | null
          comentarios?: string | null
          correo_electronico?: string | null
          departamento: string
          descripcion_actividad?: string | null
          direccion: string
          direccion_principal?: string | null
          dv: string
          email: string
          fecha_actualizacion?: string | null
          fecha_constitucion?: string | null
          fecha_creacion?: string | null
          master_detail?: string | null
          municipio: string
          naturaleza_empresa?: string | null
          nit: string
          numero_documento?: string | null
          pagina_web?: string | null
          pais?: string | null
          primer_apellido?: string | null
          primer_nombre?: string | null
          razon_social: string
          regimen_tributario?: string | null
          responsabilidad_fiscal?: string | null
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          sucursales?: boolean | null
          telefono: string
          telefono_fijo?: string | null
          telefono_movil?: string | null
          tipo_contribuyente: string
          tipo_documento?: string | null
          tipo_empresa?: string | null
        }
        Update: {
          barrio?: string | null
          ciudad?: string | null
          codigo_ciuu?: string | null
          comentarios?: string | null
          correo_electronico?: string | null
          departamento?: string
          descripcion_actividad?: string | null
          direccion?: string
          direccion_principal?: string | null
          dv?: string
          email?: string
          fecha_actualizacion?: string | null
          fecha_constitucion?: string | null
          fecha_creacion?: string | null
          master_detail?: string | null
          municipio?: string
          naturaleza_empresa?: string | null
          nit?: string
          numero_documento?: string | null
          pagina_web?: string | null
          pais?: string | null
          primer_apellido?: string | null
          primer_nombre?: string | null
          razon_social?: string
          regimen_tributario?: string | null
          responsabilidad_fiscal?: string | null
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          sucursales?: boolean | null
          telefono?: string
          telefono_fijo?: string | null
          telefono_movil?: string | null
          tipo_contribuyente?: string
          tipo_documento?: string | null
          tipo_empresa?: string | null
        }
        Relationships: []
      }
      sql_connections: {
        Row: {
          created_at: string | null
          database: string
          id: number
          last_connected: string | null
          master_detail: string | null
          password: string
          port: string
          server: string
          updated_at: string | null
          use_windows_auth: boolean | null
          username: string
        }
        Insert: {
          created_at?: string | null
          database: string
          id: number
          last_connected?: string | null
          master_detail?: string | null
          password: string
          port: string
          server: string
          updated_at?: string | null
          use_windows_auth?: boolean | null
          username: string
        }
        Update: {
          created_at?: string | null
          database?: string
          id?: number
          last_connected?: string | null
          master_detail?: string | null
          password?: string
          port?: string
          server?: string
          updated_at?: string | null
          use_windows_auth?: boolean | null
          username?: string
        }
        Relationships: []
      }
      table_structures: {
        Row: {
          column_default: string | null
          column_name: string
          created_at: string | null
          data_type: string
          id: number
          is_nullable: boolean
          master_detail: string | null
          sql_connection_id: number | null
          table_name: string
          updated_at: string | null
        }
        Insert: {
          column_default?: string | null
          column_name: string
          created_at?: string | null
          data_type: string
          id?: number
          is_nullable: boolean
          master_detail?: string | null
          sql_connection_id?: number | null
          table_name: string
          updated_at?: string | null
        }
        Update: {
          column_default?: string | null
          column_name?: string
          created_at?: string | null
          data_type?: string
          id?: number
          is_nullable?: boolean
          master_detail?: string | null
          sql_connection_id?: number | null
          table_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_structures_sql_connection_id_fkey"
            columns: ["sql_connection_id"]
            isOneToOne: false
            referencedRelation: "sql_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      task_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          master_detail: string | null
          task_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          master_detail?: string | null
          task_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          master_detail?: string | null
          task_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          master_detail: string | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          master_detail?: string | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          master_detail?: string | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          master_detail: string | null
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          master_detail?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          master_detail?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["nit"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          master_detail: string | null
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          master_detail?: string | null
          password_hash: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          master_detail?: string | null
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_table_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          row_count: number
          size_in_kb: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
