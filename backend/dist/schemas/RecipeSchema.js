import { z } from "zod";
export const RecipeStepsSchema = z.object({
    step_number: z.number().int().positive().optional(),
    instruction_text: z.string().trim().min(1, "Instruction text is required"),
    step_images: z.array(z.string().url()).optional().default([])
});
export const RecipeSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Title is too short (min 3 chars)")
        .max(50, "Title is too long (max 50 chars)"),
    description: z.string().min(1, "Description is required"),
    ingredients: z.array(z.string().trim())
        .min(1, "You need at least one ingredient"),
    steps: z.array(RecipeStepsSchema)
        .min(1, "You need at least one step instruction"),
});
// Gemini requires the facking genai schema objects
export const AiRecipeSchema = {
    type: "OBJECT",
    properties: {
        title: {
            type: "STRING",
            description: "Recipe title (3 to 50 characters)"
        },
        description: {
            type: "STRING",
            description: "Brief description of the dish"
        },
        ingredients: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "List of ingredients with quantities"
        },
        steps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    step_number: { type: "INTEGER" },
                    instruction_text: { type: "STRING" },
                    image_prompt: {
                        type: "STRING",
                        description: "A short, vivid visual prompt describing what this specific cooking step looks like for an image generator."
                    }
                },
                required: ["instruction_text"]
            },
            description: "Ordered list of step-by-step instruction objects"
        }
    },
    required: ["title", "description", "ingredients", "steps"]
};
//# sourceMappingURL=RecipeSchema.js.map