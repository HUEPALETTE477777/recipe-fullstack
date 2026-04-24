import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeService } from "../../services/RecipeService";
import { useApi } from "../../hooks/useApi";
import { type Recipe } from "../../types/RecipeTypes"

export default function HomePage() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [inputCurrentPage, setInputCurrentPage] = useState<string>("1")
    const itemsPerPage = 3;
    const { data: recipes, loading } = useApi(() => RecipeService.getAllRecipes(), []);

    useEffect(() => {
        setInputCurrentPage(currentPage.toString());
    }, [currentPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = recipes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(recipes.length / itemsPerPage);

    // PAGINATION FUNCTIONS AND CONTROLS
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
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
            <div className="max-w-7xl mx-auto">
                
                {/* RECIPES GRID 3 COLUMNS */}
                <div className="grid gap-6 grid-cols-3 mb-12">
                    {(currentItems || []).map((recipe : Recipe) => (
                        <div key={recipe.id} className="bg-white text-gray-800 p-10 shadow-sm border rounded-lg border-gray-200 hover:shadow-md transition-shadow flex flex-col">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
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
                                    <div>
                                        <h1 className="text-xl font-bold">{recipe.title}</h1>
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
                                className="w-full text-center bg-gray-800 hover:bg-black text-white py-2 font-medium"
                            >
                                View Recipe
                            </Link>
                        </div>
                    ))}
                </div>

                {/* PAGINATION CONTROLS  */}
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
                            className="text-gray-600 hover:text-gray-800 font-semibold hover:cursor-pointer"
                        >
                            NEXT
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}