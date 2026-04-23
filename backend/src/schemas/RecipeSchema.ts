import { z } from "zod";

export const RecipeSchema = z.object({
    title: z.string().min(1, { message: "TITLE IS REQUIRED" }),
    instructions: z.string().min(10, { message: "PROVIDE MORE DETAIL" }),
    ingredients: z.array(z.string()).min(1, { message: "AT LEAST ONE INGREDIENT" })
});

export type RecipeInput = z.infer<typeof RecipeSchema>;