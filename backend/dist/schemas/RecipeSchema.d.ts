import { z } from "zod";
export declare const RecipeStepsSchema: z.ZodObject<{
    step_number: z.ZodOptional<z.ZodNumber>;
    instruction_text: z.ZodString;
    step_images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const RecipeSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    ingredients: z.ZodArray<z.ZodString>;
    steps: z.ZodArray<z.ZodObject<{
        step_number: z.ZodOptional<z.ZodNumber>;
        instruction_text: z.ZodString;
        step_images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const AiRecipeSchema: {
    type: string;
    properties: {
        title: {
            type: string;
            description: string;
        };
        description: {
            type: string;
            description: string;
        };
        ingredients: {
            type: string;
            items: {
                type: string;
            };
            description: string;
        };
        steps: {
            type: string;
            items: {
                type: string;
                properties: {
                    step_number: {
                        type: string;
                    };
                    instruction_text: {
                        type: string;
                    };
                    image_prompt: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            description: string;
        };
    };
    required: string[];
};
//# sourceMappingURL=RecipeSchema.d.ts.map