export interface Profile {
    display_name: string | null;
    email: string | null;
    avatar_url: string | null;
}

export interface Recipe {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string;
    created_at: string;
    profiles?: Profile; 
}