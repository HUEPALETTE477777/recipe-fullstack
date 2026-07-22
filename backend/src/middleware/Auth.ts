import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];

    try {
        // ASK SUPABASE TO VERIFY THE JWT TOKEN SENT FROM FRONTEND
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: "INVALID OR EXPIRED TOKEN" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: "INTERNAL AUTH ERROR" });
    }
}

// THIS IS JUICY SINCE I CAN USE FOR ANY ROLE
export const authorize = (requiredRole: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "UNAUTHORIZED, NO USER SESSION FOUND" });
        }

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error || !profile) {
                return res.status(404).json({ message: "USER PROFILE NOT FOUND" });
            }

            if (profile.role !== requiredRole) {
                return res.status(403).json({ message: "FORBIDDEN: ACCESS DENIED" });
            }

            next();
        } catch (err) {
            console.error("Authorization error:", err);
            return res.status(500).json({ message: "INTERNAL SERVER AUTHORIZATION ERROR" });
        }
    };
}

// THIS WILL BE USED IN DELETE/EDIT, SINCE I WANT ADMIN AND OWNER OF RECIPE
// TO BE ABLE TO MODIFY
export const canModifyRecipe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const recipeId = req.params.id as string; 

    if (!userId) return res.status(401).json({ message: "UNAUTHORIZED: LOGIN REQUIRED" });
    if (!recipeId) return res.status(400).json({ message: "BAD REQUEST: MISSING RECIPE ID" });

    try {
        const { data: recipe, error: recipeError } = await supabase
            .from("recipes")
            .select("user_id") 
            .eq("id", recipeId)
            .single();  

        if (recipeError || !recipe) {
            return res.status(404).json({ message: "RECIPE NOT FOUDN" });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        const isAdmin = profile?.role === "admin";
        const isOwner = recipe.user_id === userId;

        if (isOwner || isAdmin) {
            return next(); 
        }

        // LOCKED OUT NOW
        return res.status(403).json({ message: "FORBIDDEN: You do not own this recipe" });
    } catch (err) {
        console.error("Authorization check failed:", err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR DURING AUTH CHECK" });
    }
};

