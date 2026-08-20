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
      prompts: {
        Row: {
          id: string
          created_at: string
          title: string
          price: number
          category: string
          model: string
          short_description: string
          description: string
          usage: string
          caution: string
          prompt_text: string
          image_urls: string[]
          tags: string[]
          rating: number
          review_count: number
          download_count: number
          view_count: number
          file_url: string | null
          is_published: boolean
        }
        Insert: {
          id: string
          created_at?: string
          title: string
          price: number
          category: string
          model: string
          short_description: string
          description: string
          usage: string
          caution: string
          prompt_text: string
          image_urls?: string[]
          tags?: string[]
          rating?: number
          review_count?: number
          download_count?: number
          view_count?: number
          file_url?: string | null
          is_published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          price?: number
          category?: string
          model?: string
          short_description?: string
          description?: string
          usage?: string
          caution?: string
          prompt_text?: string
          image_urls?: string[]
          tags?: string[]
          rating?: number
          review_count?: number
          download_count?: number
          view_count?: number
          file_url?: string | null
          is_published?: boolean
        }
      }
      carts: {
        Row: {
          id: number
          created_at: string
          user_id: string
          prompt_id: string
        }
        Insert: {
          id?: never
          created_at?: string
          user_id: string
          prompt_id: string
        }
        Update: {
          id?: never
          created_at?: string
          user_id?: string
          prompt_id?: string
        }
      }
      wishlists: {
        Row: {
          id: number
          created_at: string
          user_id: string
          prompt_id: string
        }
        Insert: {
          id?: never
          created_at?: string
          user_id: string
          prompt_id: string
        }
        Update: {
          id?: never
          created_at?: string
          user_id?: string
          prompt_id?: string
        }
      }
      purchases: {
        Row: {
          id: string
          created_at: string
          buyer_id: string
          prompt_id: string
          payment_order_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          buyer_id: string
          prompt_id: string
          payment_order_id: string
        }
        Update: {
          id?: string
          created_at?: string
          buyer_id?: string
          prompt_id?: string
          payment_order_id?: string
        }
      }
    }
  }
}

export type PromptRow = Database["public"]["Tables"]["prompts"]["Row"]
export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"]
export type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"]
