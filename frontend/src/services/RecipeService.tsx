// SERVICE WILL USE 'api' SO IT WILL CHEKC THE BORING 
// JWT BULLSHID AND TIMER EXPIRATION
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

    // CREATE RECIPE FOR ONLY USERS
    createRecipe: async (recipeData: { title: string; instructions: string; ingredients: string[] }) => {
        const response = await api.post('/recipes/create-recipe', recipeData);
        return response.data;
    },

    // DELETE RECIPE BY ID, MUST BE AUTHORIZED
    deleteRecipeById: async (id: string) => {
        const response = await api.delete(`/recipes/${id}`, { withCredentials: true });
        return response.data;
    }
};