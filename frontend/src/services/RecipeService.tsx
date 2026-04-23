import api from "../api/axios";

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
    
    delete: async (id: string) => {
        const response = await api.get(`/recipes/${id}`, { withCredentials: true });
        return response.data;
    }
};