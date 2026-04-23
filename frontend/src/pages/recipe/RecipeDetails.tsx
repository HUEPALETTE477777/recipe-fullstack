import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { RecipeService } from "../../services/RecipeService";
import { type Recipe } from "../../types/RecipeTypes";

export default function RecipeDetails() {
    const { id } = useParams();

    const { data: recipe, loading } = useApi<Recipe>(
        () => RecipeService.getRecipeById(id as string),
        [id]
    );

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (!recipe) {
        return (
            <div>
                Recipe not found!
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-12 bg-white shadow-lg rounded-3xl mt-20 border border-gray-200">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                {recipe.profiles?.avatar_url ? (
                    <img
                        src={recipe.profiles.avatar_url}
                        className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        ?
                    </div>
                )}

                <p className="text-gray-600">
                    By <span className="font-semibold">{recipe.profiles?.display_name || "Anonymous Chef"}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-bold mb-2 text-gray-800">Ingredients</h2>
                    <ul className="space-y-3">
                        {recipe.ingredients?.map((ing, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="font-bold">•</span>
                                {ing}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Instructions</h2>
                    <p className="text-gray-700">
                        {recipe.instructions}
                    </p>
                </div>
            </div>
        </div>
    );
}