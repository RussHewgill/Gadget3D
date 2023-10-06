export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          category: string
          created_at: string
          id: number
          image_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
          image_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
          image_url?: string | null
        }
        Relationships: []
      }
      things: {
        Row: {
          category: string | null
          created_at: string
          image_url: string | null
          item_name: string
          price: number | null
          token: string | null
          uuid: string
          variation: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          image_url?: string | null
          item_name: string
          price?: number | null
          token?: string | null
          uuid?: string
          variation: string
        }
        Update: {
          category?: string | null
          created_at?: string
          image_url?: string | null
          item_name?: string
          price?: number | null
          token?: string | null
          uuid?: string
          variation?: string
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
