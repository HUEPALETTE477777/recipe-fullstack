import { useState } from "react";
import api from "../../api/axios"


export default function CreateRecipe() {
    const [title, setTitle] = useState<string>('');
    const [instructions, setInstructions] = useState<string>('');
    const [ingredientInput, setIngredientInput] = useState<string>('')
    const [ingredients, setIngredients] = useState<string[]>([]);

    // USE SPREAD OPERATOR TO APPEND INGREDIENT TO STRING ARRAY
    const addIngredient = () => {
        if (ingredientInput.trim()) {
            setIngredients([...ingredients, ingredientInput]);
            setIngredientInput('');
        }
    }

    const submitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            const response = await api.post('/recipes/create-recipe', { title, instructions, ingredients });
            console.log("SUCCESS XD", response)

            setTitle('');
            setInstructions('');
            setIngredientInput('');
            setIngredients([]);
        } catch (err) {
            console.error("FAILED TO SAVE THE RECIPE", err);
        }
    }

    return (
        <div>
            <h1>ADD NEW RECIPES HERE</h1>
            <form onSubmit={submitHandler} className="flex justify-start items-center">
                <div className="flex flex-col">
                    <input type="text"
                        value={title}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setTitle(evt.target.value)}
                        className="bg-red-300 focus:placeholder-transparent"
                        placeholder="SET TITLE OF RECIPE"
                    />
                    <input type="text"
                        value={instructions}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setInstructions(evt.target.value)}
                        className="bg-blue-300 focus:placeholder-transparent"
                        placeholder="SET INSTRUCTIONS FOR RECIPE"
                    />
                    <div className="mt-4">
                        <input type="text"
                            value={ingredientInput}
                            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => setIngredientInput(evt.target.value)}
                            className="bg-green-200 focus:placeholder-transparent"
                            placeholder="INGREDIENT NAME"
                        />
                        <button
                            className="p-4 hover:cursor-pointer bg-gray-300"
                            type="button"
                            onClick={addIngredient}>
                            ADd to list
                        </button>
                    </div>

                    <ul className="list-disc ml-5">
                        {ingredients?.map((ing, i) =>
                            <li key={i}>{ing}</li>
                        )}
                    </ul>

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

