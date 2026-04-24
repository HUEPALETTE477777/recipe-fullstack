import { useState } from "react";
import { RecipeService } from "../../services/RecipeService";
import { useNavigate } from "react-router-dom";
import { RecipeSchema } from "../../../../backend/src/schemas/RecipeSchema"
import { z } from "zod";

type RecipeFormData = z.infer<typeof RecipeSchema>;

export default function CreateRecipe() {
    const navigate = useNavigate();

    // NAME: VALUE ATTRIBUTE FORM THE INPUTS. WILL 
    const [formData, setFormData] = useState<RecipeFormData>({
        title: '',
        instructions: '',   
        ingredients: []
    });
    const [ingredientInput, setIngredientInput] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});


    // USE SPREAD OPERATOR TO APPEND INGREDIENT TO STRING ARRAY
    const addIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    const submitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        const result = RecipeSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors as Record<string, string[]>);
            return;
        }

        try {
            await RecipeService.createRecipe(result.data);

            navigate('/my-recipes');
        } catch (err) {
            console.error("FAILED TO SAVE THE RECIPE", err);
        }
    }

    // USED FOR TITLE
    const handleInputChange = async (evt: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = evt.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name]; 
                return newErrors;
            });
        }
    }

    return (
        <div>
            <h1>ADD NEW RECIPES HERE</h1>
            <form onSubmit={submitHandler} className="flex justify-start items-center">
                <div className="flex flex-col">

                    {/* TITLE OF RECIPE */}
                    <div>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Condom"
                            className={`w-full border focus:outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.title?.[0] && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                    </div>

                    {/* INSTRUCTIONS FOR RECIPE */}
                    <div>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            className={`w-full border focus:outline-none ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Put that shid on and thrust hump"
                        />
                        {errors.instructions?.[0] && <p className="text-red-500 text-xs mt-1">{errors.instructions[0]}</p>}
                    </div>

                    {/* INGREDIENTS INPUT */}
                    <div className="flex items-center mt-4">
                        <input
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                            placeholder="Add ingredients"
                            className=" w-full border border-gray-200 focus:outline-none"
                        />
                        <button
                            className="p-4 hover:cursor-pointer bg-gray-300"
                            type="button"
                            onClick={addIngredient}>
                            ADd to list
                        </button>
                    </div>

                    {/* INGREDIENTS DISPLAY */}
                    <ul className="list-disc ml-5">
                        {formData.ingredients?.map((ing, i) =>
                            <li key={i}>{ing}</li>
                        )}
                    </ul>

                    {errors.ingredients && <p className="text-red-500 text-xs">{errors.ingredients[0]}</p>}

                    <button
                        type="submit"
                        className="bg-purple-400 hover:cursor-pointer"
                    >
                        CREATE THE RECIPE NOW!!!
                    </button>

                </div>
            </form>
        </div>
    )
}

