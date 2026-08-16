import { z } from "zod";
export declare const RecipeSchema: z.ZodObject<{
    title: z.ZodString;
    ingredients: z.ZodArray<z.ZodString>;
    description: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=RecipeSchema.d.ts.map