import { z } from "zod";

export const RecipeSchema = z.object({
    title: z.string()
        .trim()
        .min(3, "Title is too short (min 3 chars)")
        .max(50, "Title is too long (max 50 chars)"),
    instructions: z.string()
        .trim()
        .min(10, "Instructions are too short (min 10 chars)"),
    ingredients: z.array(z.string().trim())
        .min(1, "You need at least one ingredient")
});