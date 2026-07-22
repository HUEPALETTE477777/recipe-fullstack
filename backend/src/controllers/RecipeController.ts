import { Request, Response } from "express";
import { supabase } from "../config/supabase.js"
import { RecipeSchema } from "../schemas/RecipeSchema.js";
import { AuthRequest } from '../middleware/Auth';
import crypto from "crypto";

const RECIPE_SELECT_QUERY = `
    *,
    profiles (
        display_name,
        avatar_url,
        email
    )
`;

const MAX_COVER_IMAGES = 5;
const MAX_STEP_IMAGES = 3;

type AuthMulterRequest = AuthRequest & {
    files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
};

export const getAllRecipes = async (req: Request, res: Response) => {
    try {
        // JOIN THE TABLE WITH SUPABASE SYNTAX
        const { data, error } = await supabase
            .from('recipes')
            .select(RECIPE_SELECT_QUERY)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("SUPABASE ERROR:", error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const getMyRecipes = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id as string;

        const { data, error } = await supabase
            .from('recipes')
            .select(RECIPE_SELECT_QUERY)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("BULLSHID FETCHING MY RECIPES ERROR", error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export const getRecipe = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {

        // JOIN THE TABLE WITH SUPABASE SYNTAX
        const { data: recipe, error: findError } = await supabase
            .from('recipes')
            .select(RECIPE_SELECT_QUERY)
            .eq('id', id) // SPECIFIC RECIPE
            .single(); // RETURN AN OBJECT INSTEAD OF AN ARRAY

        if (findError || !recipe) {
            console.error("ERROR FETCHING RECIPE:", findError.message);
            return res.status(404).json({ error: "RECIPE NOT FOUND" });
        }

        // NOW GET THE RECIPE STEPS
        const { data: steps, error: stepsError } = await supabase
            .from('recipe_steps')
            .select('*')
            .eq('recipe_id', id)
            .order('step_number', { ascending: true });

        if (stepsError) {
            console.error("ERROR FETCHING RECIPE STEPS:", stepsError.message);
            return res.status(500).json({ error: "FAILED TO FETCH RECIPE STEPS" });
        }

        res.status(200).json({
            ...recipe,
            steps: steps || []
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
}

// MULTER FILE MAPPING
// [
//   {
//     "fieldname": "coverImages",
//     "originalname": "pizza_crust.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "buffer": { "type": "Buffer", "data": [ 255, 216, 255, 224, 0, 16, 74, 70, 73, 70, ... ] },
//     "size": 142045
//   },
//   {
//     "fieldname": "coverImages",
//     "originalname": "pizza_cheese.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "buffer": { "type": "Buffer", "data": [ 255, 216, 255, 224, 0, 16, 74, 70, 73, 70, ... ] },
//     "size": 98432
//   },
//   {
//     "fieldname": "stepImages_0",
//     "originalname": "dough_roll.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "buffer": { "type": "Buffer", "data": [ 137, 80, 78, 71, 13, 10, 26, 10, 0, 0, ... ] },
//     "size": 240500
//   }
// ]
export const createRecipe = async (req: AuthMulterRequest, res: Response) => {
    try {
        // ALL FORMDATA FROM TEH FRONTEND, CHECK AGAINST TEXT STRINGS
        const incomingIngredients = typeof req.body.ingredients === "string"
            ? JSON.parse(req.body.ingredients)
            : req.body.ingredients;

        const incomingSteps = typeof req.body.steps === "string"
            ? JSON.parse(req.body.steps)
            : req.body.steps || [];

        const result = RecipeSchema.safeParse({
            title: req.body.title,
            ingredients: incomingIngredients,
            description: req.body.description
        });

        if (!result.success) {
            return res.status(400).json({
                message: "VALIDATION ERROR",
                errors: result.error.flatten().fieldErrors
            });
        }

        if (!req.user?.id) {
            return res.status(401).json({ error: "UNAUTHORIZED: USER ID NOT FOUND ON REQUEST" });
        }
        const user_id = req.user.id;

        // USING UPLOAD.any(), WHERE IT IS A FLAT ARRAY OF FILES 
        // https://stackoverflow.com/questions/56491896/using-multer-and-express-with-typescript
        const allFiles = req.files as Express.Multer.File[] | undefined;

        console.log("=== MULTER INTERNAL FILE MAPPING ===", JSON.stringify(allFiles, null, 2));

        const coverImagesUrls: string[] = [];
        const coverFiles = allFiles?.filter(f => f.fieldname === "coverImages") || [];

        if (coverFiles.length > MAX_COVER_IMAGES) {
            return res.status(400).json({
                error: "VALIDATION ERROR",
                message: `You can upload a max of ${MAX_COVER_IMAGES} cover images`
            });
        }

        for (const coverFile of coverFiles) {
            const uniqueFilename = `${crypto.randomUUID()}-${coverFile.originalname}`;

            const { error: uploadError } = await supabase.storage
                .from("recipe-images")
                .upload(`covers/${uniqueFilename}`, coverFile.buffer, {
                    contentType: coverFile.mimetype,
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrlData } = supabase.storage
                .from("recipe-images")
                .getPublicUrl(`covers/${uniqueFilename}`);

            coverImagesUrls.push(publicUrlData.publicUrl);
        }

        // WRITE TO recipes TABLE SINCE WE ARE DONE, BUT NOT DOEN WITH RECIPE STEPS YET
        const { data: newRecipe, error: recipeError } = await supabase
            .from('recipes')
            .insert([{
                ...result.data,
                user_id,
                cover_image_urls: coverImagesUrls
            }])
            .select()
            .single();

        if (recipeError) {
            throw recipeError;
        }

        const stepsPayload = [];

        for (let i = 0; i < incomingSteps.length; i++) {
            const stepText = incomingSteps[i].instruction_text || incomingSteps[i];
            const stepImagesUrls: string[] = []; // 3 IMAGES PER STEP, GATHER THEM ALL FOR stepsPayload

            // GET THE stepImages_1 FIELD NAME
            // GO THRU EVERY FILE IN THERE WITH A NESTED LOOP
            // upload.any() MULTER EXAMPLE:
            // [
            //     { "fieldname": "coverImage", "buffer": "..." },
            //     { "fieldname": "stepImages_0", "buffer": "..." }
            // ]
            const stepFilesFieldName = `stepImages_${i}`;
            const targetedFiles = allFiles?.filter(f => f.fieldname === stepFilesFieldName) || [];
            if (targetedFiles.length > MAX_STEP_IMAGES) {
                return res.status(400).json({
                    error: "VALIDATION ERROR",
                    message: `Step ${i + 1} exceeds the max of ${MAX_STEP_IMAGES} images. (Received ${targetedFiles.length} images turd)`
                });
            }

            for (const file of targetedFiles) {
                const uniqueFilename = `${crypto.randomUUID()}-${file.originalname}`;

                const { error: stepUploadError } = await supabase.storage
                    .from("recipe-images")
                    .upload(`steps/${uniqueFilename}`, file.buffer, {
                        contentType: file.mimetype,
                    });

                if (stepUploadError) {
                    throw stepUploadError;
                }

                const { data: stepUrlData } = supabase.storage
                    .from("recipe-images")
                    .getPublicUrl(`steps/${uniqueFilename}`);


                stepImagesUrls.push(stepUrlData.publicUrl);
            }

            // PUSH FOR EVERY ITERATION/STEP
            stepsPayload.push({
                recipe_id: newRecipe.id,
                step_number: i + 1,
                instruction_text: stepText,
                step_images: stepImagesUrls
            })
        }

        // INSERT THAT SHID INTO recipe_steps FINALLY
        if (stepsPayload.length > 0) {
            const { error: stepsError } = await supabase
                .from('recipe_steps')
                .insert(stepsPayload);

            if (stepsError) {
                console.error("STEPS BULK INSERT ERROR:", stepsError.message);
                await supabase.from('recipes').delete().eq('id', newRecipe.id);
                return res.status(400).json({ error: "Failed to create recipe steps metadata." });
            }
        }

        res.status(201).json({ ...newRecipe, steps: stepsPayload });
    } catch (err: any) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
};

// OWNER OF RECIPE OR ADMIN CAN DELETE
// Note: Security/Access checks are safely handled by the canModifyRecipe middleware!
export const deleteRecipe = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    try {
        // MIDDLEWARE IS PASSED SO WE CAN DELETE IMMEDIATELY
        const { error: deleteError } = await supabase
            .from('recipes')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error("SUPABASE DELETION ERROR:", deleteError.message);
            return res.status(400).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: "RECIPE DELETED SUCCESSFULLY" });

    } catch (error: any) {
        console.error("SERVER EXCEPTION DURING DELETION:", error.message);
        return res.status(500).json({ error: "INTERNAL SERVER ERROR DURING DELETION" });
    }
}