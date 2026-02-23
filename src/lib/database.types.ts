export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string;
          description: string | null;
          price: number;
          image_url: string | null;
          category_id: string | null;
          isbn: string | null;
          rating: number | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          category_id?: string | null;
          isbn?: string | null;
          rating?: number | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          category_id?: string | null;
          isbn?: string | null;
          rating?: number | null;
          tags?: string[];
          created_at?: string;
        };
      };
    };
  };
}

export type Book = Database['public']['Tables']['books']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
