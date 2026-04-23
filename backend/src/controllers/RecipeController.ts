import { Request, Response } from "express";
import { supabase } from "../config/supabase.js"
import { RecipeSchema } from "../schemas/RecipeSchema.js";
import { AuthRequest } from '../middleware/Auth';

export const getAllRecipes = async (req: Request, res: Response) => {
    try {

        // JOIN THE TABLE WITH SUPABASE SYNTAX
        const { data, error } = await supabase
            .from('recipes')
            .select(`
                *,
                profiles (display_name, avatar_url)
            `)
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
            .select()
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
            .select(`
                *,
                profiles (
                    email,
                    display_name,
                    avatar_url
                )
            `)
            .eq('id', id) // SPECIFIC RECIPE
            .single(); // RETURN AN OBJECT INSTEAD OF AN ARRAY

        if (findError || !recipe) {
            return res.status(404).json({ message: "RECIPE NOT FOUND" });
        }

        res.status(200).json(recipe);
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
}

export const createRecipe = async (req: AuthRequest, res: Response) => {
    const result = RecipeSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "VALIDATION ERROR",
            errors: result.error.flatten().fieldErrors
        });
    }

    if (!req.user) {
        return res.status(401).json({ message: "UNAUTHORIZED: User not found on request" });
    }

    const user_id = req.user.id;

    try {
        const { data, error } = await supabase
            .from('recipes')
            .insert([{ ...result.data, user_id }])
            .select();

        if (error) {
            console.error("Supabase Insertion Error:", error.message);
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json(data[0]);
    } catch (err: any) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.id;

    try {
        const { data: recipe, error: findError } = await supabase
            .from('recipes')
            .select()
            .eq('id', id)
            .single();

        if (findError || !recipe) {
            return res.status(404).json({ message: "RECIPE NOT FOUND" });
        }

        const isAdmin = req.user?.app_metadata?.role === 'admin';
        if (recipe.user_id !== userId && !isAdmin) {
            return res.status(403).json({ message: "FORBIDDEN YOU DONT OWN THIS RECIPE" });
        }

        const { error: deleteError } = await supabase
            .from('recipes')
            .delete()
            .match({ id });

        if (deleteError) {
            throw deleteError;
        }

        res.status(200).json({ message: "RECIPE DELETED SUCCEssfUlly" });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}