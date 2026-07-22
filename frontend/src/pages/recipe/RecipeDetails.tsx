import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { RecipeService } from "../../services/RecipeService";
import { type Recipe } from "../../types/RecipeTypes";
import HomePageRecipeCarousel from "../../components/HomePageRecipeCarousel";

export default function RecipeDetails() {
    const { id } = useParams();

    const { data: recipe, loading } = useApi<Recipe>(
        () => RecipeService.getRecipeById(id as string),
        [id]
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-500 animate-pulse">Loading recipe...</div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl font-bold text-gray-800 bg-white p-8 shadow rounded-xl">Recipe not found!</div>
            </div>
        );
    }

    console.log(recipe)

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white shadow-lg rounded-3xl mt-10 mb-20 border border-gray-200">

            {/* COVER IMAGES CAROUSEL */}
            {recipe.cover_image_urls && recipe.cover_image_urls.length > 0 && (
                <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
                    <HomePageRecipeCarousel urls={recipe.cover_image_urls} />
                </div>
            )}

            {/* TITLE & DESCRIPTION */}
            <h1 className="text-4xl font-medium text-gray-900 mb-3 tracking-tight">{recipe.title}</h1>

            {recipe.description && (
                <p className="text-lg text-gray-700 mb-6">
                    {recipe.description}
                </p>
            )}

            {/* AUTHOR PROFILE BANNER */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                {recipe.profiles?.avatar_url ? (
                    <img
                        src={recipe.profiles.avatar_url}
                        className="w-12 h-12 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg shadow-sm">
                        {recipe.profiles?.display_name?.charAt(0).toUpperCase() || "?"}
                    </div>
                )}

                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold text-[10px]">Created By</p>
                    <p className="text-gray-800 font-medium">
                        {recipe.profiles?.display_name || "Anonymous Chef"}
                    </p>
                </div>
            </div>

            {/* INGREDIENTS SECTION */}
            <div className="border-b pb-4 border-gray-200">
                <h1 className="text-4xl font-medium text-gray-900 mb-3 tracking-tight">ingredients</h1>
                {recipe.ingredients?.map((ing, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-gray-500 font-bold">•</span>
                        <span className="text-sm font-medium">{ing}</span>
                    </div>
                ))}
            </div>

            {/* STEPS SECTION */}
            {recipe.steps && recipe.steps.length > 0 ? (
                recipe.steps
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step, idx) => (
                        <div key={idx}>
                            <div className="bg-gray-200 mt-4 mb-4 p-4">
                                <span className="text-xs text-gray-600 tracking-wider">
                                    Step {step.step_number}
                                </span>

                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {step.instruction_text}
                                </p>

                                {step?.step_images && (
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {step.step_images.map((imgUrl, imgIdx) => (
                                            <img
                                                key={imgIdx}
                                                src={imgUrl}
                                                className="w-full object-cover"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
            ) : (
                <div>

                </div>
            )}
        </div>
    );
}