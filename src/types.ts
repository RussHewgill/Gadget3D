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
          has_image: boolean
          id: number
          is_artist: boolean
        }
        Insert: {
          category: string
          created_at?: string
          has_image?: boolean
          id?: number
          is_artist?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          has_image?: boolean
          id?: number
          is_artist?: boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date_end: string | null
          date_start: string
          event_link: string | null
          id: number
          location: string
          name: string
          organizer: string | null
          poster_link: string | null
          time_end: string | null
          time_start: string | null
        }
        Insert: {
          created_at?: string
          date_end?: string | null
          date_start: string
          event_link?: string | null
          id?: number
          location: string
          name: string
          organizer?: string | null
          poster_link?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Update: {
          created_at?: string
          date_end?: string | null
          date_start?: string
          event_link?: string | null
          id?: number
          location?: string
          name?: string
          organizer?: string | null
          poster_link?: string | null
          time_end?: string | null
          time_start?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          tag: string
        }
        Insert: {
          created_at?: string
          tag: string
        }
        Update: {
          created_at?: string
          tag?: string
        }
        Relationships: []
      }
      things: {
        Row: {
          category: string | null
          created_at: string
          image_url: string
          item_name: string
          price: number | null
          tags: string[]
          token: string | null
          uuid: string
          variation: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          image_url?: string
          item_name: string
          price?: number | null
          tags?: string[]
          token?: string | null
          uuid?: string
          variation: string
        }
        Update: {
          category?: string | null
          created_at?: string
          image_url?: string
          item_name?: string
          price?: number | null
          tags?: string[]
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
