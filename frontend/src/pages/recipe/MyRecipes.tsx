import { RecipeService } from "../../services/RecipeService";
import { useApi } from "../../hooks/useApi";
import { type Recipe } from "../../types/RecipeTypes";

// 'useApi' DOES THE INITIAL FETCH, RENAME DATA TO RECIPES
export default function MyRecipes() {
    const { data: recipes, loading, removeListItem } = useApi<Recipe[]>(
        () => RecipeService.getMyRecipes(), 
        []
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this?")) {
            return;
        }

        try {
            await RecipeService.deleteRecipeById(id);
            removeListItem(id);
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (loading) {
        return <div>Loading phonk...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">My Recipes</h1>
            
            <div className="space-y-4">
                {recipes?.length === 0 ? (
                    <p className="text-gray-500 italic">YOU HAVEN'T POSTED ANY RECIPES YET</p>
                ) : (
                    recipes?.map((recipe) => (
                        <div key={recipe.id} className="flex justify-between items-center p-6 bg-white shadow-sm border border-gray-100 rounded-2xl">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{recipe.title}</h2>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                                    Added {new Date(recipe.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleDelete(recipe.id)}
                                    className="px-4 py-2 text-sm font-bold bg-red-400 hover:cursor-pointer text-white rounded-2xl hover:bg-red-600 transition-colors"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}