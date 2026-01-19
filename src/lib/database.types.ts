export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string;
          price: number;
          image_url: string;
          features: string[];
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string;
          price?: number;
          image_url?: string;
          features?: string[];
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          image_url?: string;
          features?: string[];
          is_featured?: boolean;
          created_at?: string;
        };
      };
      quote_requests: {
        Row: {
          id: string;
          product_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          message: string;
          quantity: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          message?: string;
          quantity?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          message?: string;
          quantity?: number;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type QuoteRequest = Database['public']['Tables']['quote_requests']['Row'];
