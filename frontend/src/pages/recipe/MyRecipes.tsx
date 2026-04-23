import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { RecipeService } from "../../services/RecipeService.tsx";
import { useApi } from "../../hooks/useApi.ts";
import { type Recipe } from "../../types/RecipeTypes.ts";

export default function MyRecipes() {
    const { session } = useAuth();
    const { data: recipes, loading } = useApi(() => RecipeService.getMyRecipes(), [session]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Recipes</h1>

            {!session && <p className="text-red-500">LOGIN TO SEE YOUR RECIPES UNC</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-4 gap-6">
                    {recipes.map((recipe : Recipe) => (
                        <div key={recipe.id} className="bg-white p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
                            <p className="text-gray-500 text-sm mt-3">
                                Created on {new Date(recipe.created_at).toLocaleDateString()}
                                <Link to={`/recipe/${recipe.id}`} className="bg-gray-800 text-white mt-4 hover:cursor-pointer">
                                    View
                                </Link>
                            </p>

                        </div>
                    ))}
                </div>
            )}

            {recipes?.length === 0 && !loading && (
                <p className="text-gray-400 italic">You haven't posted any recipes yet.</p>
            )}
        </div>
    );
}