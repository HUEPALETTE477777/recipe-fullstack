
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeService } from "../../services/RecipeService";
import { useApi } from "../../hooks/useApi";
// 1. Import QueriedRecipe along with Recipe
import { type Recipe, type QueriedRecipe } from "../../types/RecipeTypes";
import { useAuth } from "../../hooks/useAuth";
import HomePageRecipeCarousel from "../../components/HomePageRecipeCarousel";

export default function HomeFeed() {
    const [searchParams] = useSearchParams();
    const currentQuery = searchParams.get("q") || "";

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [inputCurrentPage, setInputCurrentPage] = useState<string>("1");
    const itemsPerPage = 3;

    // GRAB THE USER PROFILE STATE AND AUTH 
    const { user, session, loading: authLoading } = useAuth();

    const {
        data: recipes,
        loading: recipesLoading,
    } = useApi<QueriedRecipe[]>(
        () => currentQuery
            ? RecipeService.searchRecipes(currentQuery)
            : (RecipeService.getAllRecipes()), 
        [currentQuery],
        { enabled: !authLoading }
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [currentQuery]);

    useEffect(() => {
        setInputCurrentPage(currentPage.toString());
    }, [currentPage]);

    if (authLoading || recipesLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600 font-medium animate-pulse">Syncing credentials and recipes...</p>
            </div>
        );
    }

    const safeRecipes = recipes || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = safeRecipes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(safeRecipes.length / itemsPerPage) || 1;

    const prev = () => {
        setCurrentPage((prev) => (prev - 1 <= 0 ? totalPages : prev - 1));
    };

    const next = () => {
        setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    };

    const submitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const pageNum = parseInt(inputCurrentPage);

        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        } else {
            setInputCurrentPage(currentPage.toString());
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
            <div className="max-w-7xl w-full mx-auto">

                {currentQuery && (
                    <div className="mb-6">
                        <h2 className="text-xl text-gray-600">
                            Showing results for: <span className="font-bold text-gray-800">"{currentQuery}"</span>
                        </h2>
                    </div>
                )}

                {/* RECIPES GRID 3 COLUMNS */}
                {safeRecipes.length > 0 ? (
                    <div className="grid gap-6 grid-cols-3 mb-12">

                        {currentItems.map((recipe: QueriedRecipe) => (
                            <div key={recipe.id} className="bg-white text-gray-800 p-10 shadow-sm border rounded-lg border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[450px]">
                                <div>
                                    <HomePageRecipeCarousel urls={recipe.cover_image_urls} />
                                    <div className="flex items-center gap-3 mb-4 mt-2">
                                        {recipe.profiles?.avatar_url ? (
                                            <img
                                                src={recipe.profiles.avatar_url}
                                                className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm object-cover"
                                                alt="avatar"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                ?
                                            </div>
                                        )}
                                        <div>
                                            <h1 className="text-xl font-bold truncate max-w-[180px]">{recipe.title}</h1>
                                            <p className="text-sm text-gray-500 font-medium italic">
                                                by {recipe.profiles?.display_name || "Anonymous Chef"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-gray-400 text-xs mb-4 uppercase font-semibold">
                                        Published On {new Date(recipe.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <Link
                                    to={`/recipe/${recipe.id}`}
                                    className="w-full text-center bg-gray-800 hover:bg-black text-white py-2 font-medium rounded transition-colors"
                                >
                                    View Recipe
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm mb-12">
                        <p className="text-gray-500 text-lg font-medium">No recipes found matching your search.</p>
                    </div>
                )}

                {/* PAGINATION CONTROLS */}
                {safeRecipes.length > 0 && (
                    <div className="flex justify-center">
                        <div className="flex bg-white px-6 py-3 shadow-sm border border-gray-200 items-center rounded-full gap-10">
                            <button
                                onClick={prev}
                                className="text-gray-600 hover:text-gray-800 font-semibold hover:cursor-pointer transition-colors"
                            >
                                PREVIOUS
                            </button>

                            <form onSubmit={submitHandler} className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-2xl border border-gray-200">
                                <input
                                    type="text"
                                    className="w-10 text-center bg-transparent font-bold text-gray-800 focus:outline-none"
                                    value={inputCurrentPage}
                                    onChange={(evt) => setInputCurrentPage(evt.target.value)}
                                />
                                <span className="text-gray-400">/</span>
                                <span className="font-bold text-gray-500">{totalPages || 1}</span>
                            </form>

                            <button
                                onClick={next}
                                className="text-gray-600 hover:text-gray-800 font-semibold hover:cursor-pointer transition-colors"
                            >
                                NEXT
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
