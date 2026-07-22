import { useState } from "react";
import { RecipeService } from "../../services/RecipeService";
import { useNavigate } from "react-router-dom";

interface StepInput {
    instruction_text: string;
    images: File[];
}

export default function CreateRecipe() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [ingredientInput, setIngredientInput] = useState("");
    const [coverImages, setCoverImages] = useState<File[]>([]);

    const [steps, setSteps] = useState<StepInput[]>([
        { instruction_text: "", images: [] }
    ]);

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // extra layer for mime types
    const isValidImageType = (file: File): boolean => {
        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/HEIC"];

        if (!allowedMimeTypes.includes(file.type)) {
            alert("Invalid file format. Upload blocked.");
        }

        return allowedMimeTypes.includes(file.type);
    };

    const addIngredient = () => {
        if (ingredientInput.trim()) {
            setIngredients(prev => [...prev, ingredientInput.trim()]);
            setIngredientInput("");

            if (errors.ingredients) {
                setErrors(prev => {
                    const next = { ...prev };
                    delete next.ingredients;
                    return next;
                });
            }
        }
    };

    const addStepRow = () => {
        setSteps(prev => [...prev, { instruction_text: "", images: [] }]);
    };

    const updateStepText = (index: number, text: string) => {
        setSteps(prev => prev.map((step, idx) =>
            idx === index ? { ...step, instruction_text: text } : step
        ));
    };

    const handleStepImageUpload = (index: number, files: FileList | null) => {
        if (!files) {
            return;
        }

        const uploadedFiles = Array.from(files);
        const hasBadFiles = uploadedFiles.some(file => !isValidImageType(file));

        if (hasBadFiles) {
            setErrors(prev => ({
                ...prev,
                [`step_${index}_images`]: ["Only JPG, WEBP, or PNG images are allowed!"]
            }));
            return;
        }

        setErrors(prev => {
            const next = { ...prev };
            delete next[`step_${index}_images`];
            return next;
        });

        setSteps(prev => prev.map((step, idx) =>
            idx === index ? { ...step, images: [...step.images, ...uploadedFiles] } : step
        ));
    };

    const addCoverImages = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.files) {
            const uploadedFiles = Array.from(evt.target.files);
            const hasBadFiles = uploadedFiles.some(file => !isValidImageType(file));

            if (hasBadFiles) {
                setErrors(prev => ({
                    ...prev,
                    coverImages: ["Only JPG, WEBP, or PNG images are allowed!"]
                }));
                return;
            }

            setErrors(prev => {
                const next = { ...prev };
                delete next.coverImages;
                return next;
            });

            setCoverImages(prev => [...prev, ...uploadedFiles]);
        }
    };

    const submitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setErrors({});

        const clientErrors: Record<string, string[]> = {};

        if (!title.trim()) {
            clientErrors.title = ["You need a recipe title scrub"];
        }

        if (!description.trim()) {
            clientErrors.description = ["Description is required."];
        }

        if (ingredients.length === 0) {
            clientErrors.ingredients = ["Please add at least one ingredient."];
        }

        if (coverImages.some(file => !isValidImageType(file))) {
            clientErrors.coverImages = ["Cover images contain unsupported formats."];
        }

        steps.forEach((step, idx) => {
            if (step.images.some(file => !isValidImageType(file))) {
                clientErrors[`step_${idx}_images`] = ["This step contains unsupported MIME format"];
            }
            if (step.instruction_text.length === 0) {
                clientErrors[`step_${idx}_instruction_text`] = ["This step must contain instructions"];
            }
        });

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", description.trim());
            formData.append("ingredients", JSON.stringify(ingredients));

            coverImages.forEach(file => {
                formData.append("coverImages", file);
            });

            const stepsData = steps.map((s, idx) => ({
                step_number: idx + 1,
                instruction_text: s.instruction_text
            }));
            formData.append("steps", JSON.stringify(stepsData));

            steps.forEach((step, idx) => {
                step.images.forEach(file => {
                    formData.append(`stepImages_${idx}`, file);
                });
            });

            await RecipeService.createRecipe(formData);
            navigate('/my-recipes');
        } catch (err) {
            console.error("FAILED TO SAVE THE RECIPE", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
            <div className="bg-white p-10 shadow-sm max-w-2xl w-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">ADD NEW RECIPE HERE</h1>

                <form onSubmit={submitHandler} className="space-y-6">

                    {/* TITLE */}
                    <div>
                        <label className="block font-semibold text-sm mb-1 text-gray-700">Recipe Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(evt) => {
                                setTitle(evt.target.value);
                                if (errors.title) setErrors(prev => ({ ...prev, title: [] }));
                            }}
                            placeholder="Indian Curry"
                            className={`w-full border rounded p-2 focus:outline-none ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.title?.[0] && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block font-semibold text-sm mb-1 text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(evt) => {
                                setDescription(evt.target.value);
                                if (errors.description) {
                                    setErrors(prev => ({ ...prev, description: [] }));
                                }
                            }}
                            placeholder="Taste like how my desi mama makes it"
                            className={`w-full border rounded p-2 focus:outline-none h-24 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.description?.[0] && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    {/* COVER IMAGE UPLOADER */}
                    <div className={`bg-gray-50 p-4 border rounded ${errors.coverImages ? 'border-red-500' : 'border-gray-200'}`}>
                        <label className="block font-semibold text-sm mb-1 text-gray-700">Cover Images</label>
                        <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={addCoverImages}
                            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-black file:cursor-pointer"
                        />
                        {errors.coverImages?.[0] && <p className="text-red-500 text-xs mt-1">{errors.coverImages[0]}</p>}
                        {coverImages.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                                Loaded: {coverImages.map(f => f.name).join(", ")}
                            </div>
                        )}
                    </div>

                    {/* INGREDIENTS */}
                    <div>
                        <label className="block font-semibold text-sm mb-1 text-gray-700">Ingredients</label>
                        <div className="flex gap-2">
                            <input
                                value={ingredientInput}
                                onChange={(evt) => setIngredientInput(evt.target.value)}
                                placeholder="Add an ingredient..."
                                className="flex-1 border border-gray-300 rounded p-2 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-4 py-2 bg-gray-800 text-white font-medium text-sm rounded cursor-pointer hover:bg-black transition-colors"
                            >
                                Add to list
                            </button>
                        </div>
                        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-0.5">
                            {ingredients.map((ing, i) => (
                                <li key={i}>{ing}</li>
                            ))}
                        </ul>
                        {errors.ingredients?.[0] && <p className="text-red-500 text-xs mt-1">{errors.ingredients[0]}</p>}
                    </div>

                    {/* STEPS PREPARATION SECTION */}
                    <div className="space-y-4">
                        <label className="block font-semibold text-sm text-gray-700">Steps & Layout Instructions</label>
                        {steps.map((step, index) => (
                            <div key={index} className={`border p-4 rounded bg-gray-50/50 space-y-2 ${errors[`step_${index}_images`] ? 'border-red-500' : 'border-gray-200'}`}>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Step {index + 1}</span>
                                <label className="block font-semibold text-xs mb-1 mt-2 text-gray-400">Description</label>
                                <input
                                    type="text"
                                    value={step.instruction_text}
                                    onChange={(e) => updateStepText(index, e.target.value)}
                                    placeholder="Find the desi indian mom"
                                    className="w-full border border-gray-300 bg-white rounded p-2 text-sm focus:outline-none"
                                />
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={(e) => handleStepImageUpload(index, e.target.files)}
                                    className="text-xs file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 file:cursor-pointer"
                                />
                                {errors[`step_${index}_images`]?.[0] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[`step_${index}_images`][0]}</p>
                                )}
                                {errors[`step_${index}_instruction_text`]?.[0] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[`step_${index}_instruction_text`][0]}</p>
                                )}
                                {step.images.length > 0 && (
                                    <div className="text-[11px] text-gray-400">
                                        Step pictures: {step.images.map(f => f.name).join(", ")}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addStepRow}
                            className="w-full border border-dashed border-gray-300 py-2 rounded text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors"
                        >
                            + Add Next Step
                        </button>
                    </div>
                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded text-white bg-gray-600 font-bold hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        CREATE THE RECIPE NOW!!!
                    </button>
                </form>
            </div>
        </div>
    );
}