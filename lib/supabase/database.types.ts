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
    }
  }
}

export type PromptRow = Database["public"]["Tables"]["prompts"]["Row"]
export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"]
export type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"]
