import { Database } from '../types/supabase.js';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        profiles: {
            Row: {
                avatar_url: string | null;
                display_name: string | null;
                email: string | null;
                id: string;
                role: string | null;
            };
            Insert: {
                avatar_url?: string | null;
                display_name?: string | null;
                email?: string | null;
                id: string;
                role?: string | null;
            };
            Update: {
                avatar_url?: string | null;
                display_name?: string | null;
                email?: string | null;
                id?: string;
                role?: string | null;
            };
            Relationships: [];
        };
        recipe_steps: {
            Row: {
                created_at: string | null;
                id: string;
                instruction_text: string;
                recipe_id: string;
                step_images: string[] | null;
                step_number: number;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                instruction_text: string;
                recipe_id: string;
                step_images?: string[] | null;
                step_number: number;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                instruction_text?: string;
                recipe_id?: string;
                step_images?: string[] | null;
                step_number?: number;
            };
            Relationships: [{
                foreignKeyName: "recipe_steps_recipe_id_fkey";
                columns: ["recipe_id"];
                isOneToOne: false;
                referencedRelation: "recipes";
                referencedColumns: ["id"];
            }];
        };
        recipes: {
            Row: {
                cover_image_urls: string[] | null;
                created_at: string | null;
                description: string | null;
                id: string;
                ingredients: string[] | null;
                title: string;
                user_id: string | null;
            };
            Insert: {
                cover_image_urls?: string[] | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                ingredients?: string[] | null;
                title: string;
                user_id?: string | null;
            };
            Update: {
                cover_image_urls?: string[] | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                ingredients?: string[] | null;
                title?: string;
                user_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "recipes_user_id_profiles_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "profiles";
                referencedColumns: ["id"];
            }];
        };
    };
    Views: { [_ in never]: never; };
    Functions: {
        search_recipes: {
            Args: {
                search_query: string;
            };
            Returns: {
                cover_image_urls: string[];
                created_at: string;
                description: string;
                id: string;
                profiles: import("../types/supabase.js").Json;
                title: string;
                user_id: string;
            }[];
        };
    };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "14.5";
}>;
//# sourceMappingURL=supabase.d.ts.map