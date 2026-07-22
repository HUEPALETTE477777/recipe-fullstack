// SERVICE WILL USE 'api' SO IT WILL CHEKC THE BORING 
// JWT BULLSHID AND TIMER EXPIRATION
import api from "../api/axios";
import type { QueriedRecipe, Recipe } from "../types/RecipeTypes";

export const RecipeService = {

    // GET ALL RECIPES
    getAllRecipes: async () => {
        const response = await api.get('/recipes');
        return response.data;
    },

    // GET ONLY LOGGED IN USERS RECIPES
    getMyRecipes: async () => {
        const response = await api.get('/recipes/my-recipes', { withCredentials: true });
        return response.data;
    },

    // GET ANY RECIPE BY ID
    getRecipeById: async (id: string) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    // CREATE RECIPE FOR ONLY REGISTERED USERS
    // createRecipe: async (recipeData: { title: string; instructions: string; ingredients: string[] }) => {
    //     const response = await api.post('/recipes/create-recipe', recipeData);
    //     return response.data;
    // },

    // UPDATED TO BE MULTIPART, WITH CREDENTIALS TO PROTECT THAT ROUTE MORE CONDOMS
    createRecipe: async (formData: FormData) => {
        const response = await api.post('/recipes/create-recipe', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response.data;
    },

    // DELETE RECIPE BY ID, MUST BE AUTHORIZED
    deleteRecipeById: async (id: string) => {
        const response = await api.delete(`/recipes/${id}`, { withCredentials: true });
        return response.data;
    },

    // STAY CONDOM SAFE encodeURIComponent
    searchRecipes: async (query: string): Promise<QueriedRecipe[]> => {
        const response = await api.get<QueriedRecipe[]>(`/recipes/search?q=${encodeURIComponent(query)}`);
        return response.data;
    }
};