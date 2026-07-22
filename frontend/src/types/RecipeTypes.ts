export interface Profile {
    display_name: string | null;
    email: string | null;
    avatar_url: string | null;
}

export interface RecipeStep {
    step_number: number;
    instruction_text: string;
    step_images?: string[]; 
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    cover_image_urls: string[];
    steps: RecipeStep[]; 
    instructions?: string; 
    created_at: string;
    profiles?: Profile; 
}

export interface RecipeAuthorProfile {
    display_name: string;
    avatar_url: string;
    email: string;
}

export interface QueriedRecipe {
    id: string;
    title: string;
    description: string;
    cover_image_urls: string[]; 
    created_at: string;
    user_id: string;
    profiles: RecipeAuthorProfile; 
}