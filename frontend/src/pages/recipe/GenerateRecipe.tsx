import React, { useState } from 'react';
import { RecipeService } from '../../services/RecipeService';
import { type Recipe } from "../../types/RecipeTypes";

const GenerateRecipe = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const submitHandler = async(evt: React.FormEvent) => {
        evt.preventDefault();
        
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await RecipeService.generateAiRecipe(prompt);
            setRecipe(response.data);
        } catch (err: any) {    
            if (err.response) {
                if (err.response.status === 429) {
                    setErrorMessage("Rate limit reached. Please wait a minute before generating another recipe because of gemini");
                } else {
                    setErrorMessage(err.response.data?.error || "Failed to generate recipe.");
                }
            } else {
                setErrorMessage("Network error. Please check your connection");
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <div>
            <h1>Generate recipe with gemini ai </h1>
            <form onSubmit={submitHandler}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Generate me a quick spicy chicken pasta with spinach and cream sauce"
                    className="focus:outline-none"
                    rows={4}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="bg-green-500 disabled:bg-gray-400 hover:bg-green-700 cursor-pointer"
                >
                    {loading ? "Generating..." : "Generate Recipe"}
                </button>
            </form>

            {errorMessage && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700">
                    GEMINI ERROR: {errorMessage}
                </div>
            )}

            {recipe && (
                <div className="mt-6 p-4 border border-gray-200 rounded shadow-sm bg-white">
                    <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
                    <p className="text-gray-600 mb-6">{recipe.description}</p>
                    
                    <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                    <ul className="list-disc pl-5 mb-4">
                        {recipe.ingredients?.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>

                    <h3 className="font-semibold text-lg mb-2">Instructions</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                        {recipe.steps?.map((step: any, i: number) => {
                            const instructionText = typeof step === 'string' ? step : step.instruction_text;
                            const images: string[] = Array.isArray(step?.step_images) 
                                ? step.step_images 
                                : step?.step_images ? [step.step_images] : [];

                            return (
                                <li key={step.id || i} className="space-y-2">
                                    <p className="text-gray-800">{instructionText}</p>
                                    
                                    {images.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {images.map((imgUrl, imgIndex) => (
                                                <img 
                                                    key={imgIndex} 
                                                    src={imgUrl} 
                                                    className="w-48 h-32 object-cover rounded border border-gray-200"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}

        </div>
    )
}

export default GenerateRecipe